import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni.runasp.net/api",
});

// 🔒 متغير لمنع محاولات refresh متعددة في نفس الوقت
let isRefreshing = false;
let failedQueue = [];

// دالة لمعالجة الطلبات المعلقة بعد نجاح/فشل الـ refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 📤 Interceptor للطلبات (قبل الإرسال)
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiration = localStorage.getItem('accessTokenExpiration');

    const now = Math.floor(Date.now() / 1000);

    // ✅ لو Token منتهي وعندك Refresh Token
    if (expiration && now >= expiration && refreshToken && !isRefreshing) {
      isRefreshing = true;

      try {
        console.log('🔄 Token expired, refreshing...');
        
        // ⚠️ استخدم axios العادي (مش api) عشان ما يدخل بـ loop
        const response = await axios.post(
          'https://uni.runasp.net/api/Account/refresh-token',
          { refreshToken },
          { 
            headers: { 'Content-Type': 'application/json' }
          }
        );

        token = response.data.accessToken;
        
        // حفظ Token الجديد
        localStorage.setItem('accessToken', token);
        localStorage.setItem('accessTokenExpiration', response.data.exp);
        
        // لو السيرفر بيرجع refreshToken جديد
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        console.log('✅ Token refreshed successfully');
        
        // معالجة الطلبات المعلقة
        processQueue(null, token);
        
        isRefreshing = false;

      } catch (err) {
        console.error('❌ Refresh token failed:', err);
        
        // فشل الـ refresh → Logout
        processQueue(err, null);
        isRefreshing = false;
        
        // مسح كل التوكنات
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessTokenExpiration');
        localStorage.removeItem('userId');
        
        // إعادة التوجيه لصفحة Login
        window.location.href = '/login';
        
        return Promise.reject(err);
      }
    }

    // إرفاق التوكن في الطلب
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 📥 Interceptor للردود (بعد الاستجابة)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ لو رجع 401 ومش retry سابقاً
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // لو في عملية refresh شغالة، انتظر
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // مافي refresh token → Logout مباشرة
        console.error('❌ No refresh token available');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        console.log('🔄 401 detected, attempting refresh...');
        
        const response = await axios.post(
          'https://uni.runasp.net/api/Account/refresh-token',
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newToken = response.data.accessToken;
        
        localStorage.setItem('accessToken', newToken);
        localStorage.setItem('accessTokenExpiration', response.data.exp);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        console.log('✅ Token refreshed after 401');
        
        // إعادة محاولة الطلب الأصلي
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        
        processQueue(null, newToken);
        isRefreshing = false;
        
        return api(originalRequest);

      } catch (err) {
        console.error('❌ Refresh failed after 401:', err);
        
        processQueue(err, null);
        isRefreshing = false;
        
        localStorage.clear();
        window.location.href = '/login';
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;