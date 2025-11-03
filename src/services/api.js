import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni.runasp.net/api",
  // headers: { 'Content-Type': 'application/json' },
          // baseURL: '/api', // فقط /api عشان proxy يشتغل

});

api.interceptors.request.use(async (config) => {
  // أ) جلب التوكنات من التخزين
  let token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiration = localStorage.getItem('accessTokenExpiration');

  // الوقت الحالي بالثواني
  const now = Math.floor(Date.now() / 1000);

  // ب) تحقق من انتهاء صلاحية الـ access token
  if (expiration && now >= expiration && refreshToken) {
    try {
      const response = await axios.post('https://uni.runasp.net/api/Account/refresh-token', { refreshToken });

      token = response.data.accessToken;
      localStorage.setItem('accessToken', token);

      // تأكدي من اسم الحقل اللي يرجعه السيرفر (exp أو accessTokenExpiration)
      localStorage.setItem('accessTokenExpiration', response.data.exp);
    } catch (err) {
      console.error('Refresh token failed', err);
    }
  }

  // ج) إرفاق التوكن في كل الطلبات
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
