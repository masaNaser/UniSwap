// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/",
// });

// // 🔒 متغير لمنع محاولات refresh متعددة في نفس الوقت
// let isRefreshing = false;
// let failedQueue = [];

// // دالة لمعالجة الطلبات المعلقة بعد نجاح/فشل الـ refresh
// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // 📤 Interceptor للطلبات (قبل الإرسال)
// api.interceptors.request.use(
//   async (config) => {
//     let token = localStorage.getItem('accessToken');
//     const refreshToken = localStorage.getItem('refreshToken');
//     const expiration = localStorage.getItem('accessTokenExpiration');

//     const now = Math.floor(Date.now() / 1000);

//     // ✅ لو Token منتهي وعندك Refresh Token
//     if (expiration && now >= expiration && refreshToken && !isRefreshing) {
//       isRefreshing = true;

//       try {
//         console.log('🔄 Token expired, refreshing...');

//         // ⚠️ استخدم axios العادي (مش api) عشان ما يدخل بـ loop
//         const response = await axios.post(
//           'https://uni1swap.runasp.net/Account/refresh-token',
//           { refreshToken },
//           {
//             headers: { 'Content-Type': 'application/json' }
//           }
//         );

//         token = response.data.accessToken;

//         // حفظ Token الجديد
//         localStorage.setItem('accessToken', token);
//         localStorage.setItem('accessTokenExpiration', response.data.exp);

//         // لو السيرفر بيرجع refreshToken جديد
//         if (response.data.refreshToken) {
//           localStorage.setItem('refreshToken', response.data.refreshToken);
//         }

//         console.log('✅ Token refreshed successfully');

//         // معالجة الطلبات المعلقة
//         processQueue(null, token);

//         isRefreshing = false;

//       } catch (err) {
//         console.error('❌ Refresh token failed:', err);

//         // فشل الـ refresh → Logout
//         processQueue(err, null);
//         isRefreshing = false;

//         // مسح كل التوكنات
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         localStorage.removeItem('accessTokenExpiration');
//         localStorage.removeItem('userId');

//         // إعادة التوجيه لصفحة Login
//         window.location.href = '/login';

//         return Promise.reject(err);
//       }
//     }

//     // إرفاق التوكن في الطلب
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 📥 Interceptor للردود (بعد الاستجابة)
// // 📥 Interceptor للردود (بعد الاستجابة من الـ Server)
// // هاد الـ Interceptor بيشتغل على كل response بترجع من الـ API
// api.interceptors.response.use(
//   // ✅ الحالة الأولى: لو الـ Response نجح (200, 201, etc.)
//   (response) => response, // رجّع الـ response عادي بدون تعديل

//   // ❌ الحالة الثانية: لو في Error
//   async (error) => {
//     // احفظ معلومات الطلب الأصلي (URL, Headers, Data, etc.)
//     const originalRequest = error.config;

//     // ✅ حالة خاصة: تجاهل 401 من صفحة Login
//     // لما المستخدم يدخل بيانات غلط، بيرجع 401 (Unauthorized)
//     // بس هاد مش معناه Token منتهي، معناه البيانات غلط!
//     // فلازم نرجّع الـ Error عادي بدون ما نعمل redirect أو refresh
//     if (originalRequest.url.includes('/Account/login')) {
//       return Promise.reject(error); // رجّع الـ error للمستدعي (Login component)
//     }

//     // ✅ التعامل مع 401 Unauthorized (Token منتهي أو مش صحيح)
//     // الشرط:
//     // 1. Status Code = 401
//     // 2. ما حاولنا نعمل retry قبل هيك (عشان ما ندخل بـ infinite loop)
//     if (error.response?.status === 401 && !originalRequest._retry) {

//       // 🔒 لو في عملية refresh token شغالة حالياً (من request ثاني)
//       // لازم ننتظرها تخلص، مش نبدأ refresh جديد
//       if (isRefreshing) {
//         // أضيف هاد الـ Request للـ Queue (قائمة الانتظار)
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(token => {
//             // لما يخلص الـ refresh، استخدم الـ Token الجديد
//             originalRequest.headers['Authorization'] = 'Bearer ' + token;
//             // وأعد إرسال الطلب الأصلي
//             return api(originalRequest);
//           })
//           .catch(err => Promise.reject(err));
//       }

//       // 🏷️ علّم هاد الـ Request إنه صار فيه retry
//       // عشان لو رجع 401 مرة ثانية، ما ندخل بـ infinite loop
//       originalRequest._retry = true;

//       // جيب الـ Refresh Token من localStorage
//       const refreshToken = localStorage.getItem('refreshToken');

//       // ❌ لو مافي Refresh Token → المستخدم مش مسجل دخول
//       if (!refreshToken) {
//         console.error('❌ No refresh token available');
//         // امسح كل البيانات
//         localStorage.clear();
//         // وروح على صفحة Login
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }

//       // 🔄 ابدأ عملية Refresh Token
//       isRefreshing = true; // علم إنه في عملية refresh شغالة

//       try {
//         console.log('🔄 401 detected, attempting refresh...');

//         // 🌐 اطلب Access Token جديد من الـ Backend
//         // ⚠️ مهم: استخدم axios العادي (مش api) عشان ما ندخل بالـ interceptor مرة ثانية
//         const response = await axios.post(
//           'https://uni1swap.runasp.net/Account/refresh-token',
//           { refreshToken }, // أرسل الـ Refresh Token
//           { headers: { 'Content-Type': 'application/json' } }
//         );

//         // استخرج الـ Access Token الجديد من الـ Response
//         const newToken = response.data.accessToken;

//         // 💾 احفظ الـ Token الجديد في localStorage
//         localStorage.setItem('accessToken', newToken);
//         localStorage.setItem('accessTokenExpiration', response.data.exp);

//         // لو السيرفر بعث Refresh Token جديد كمان، احفظه
//         if (response.data.refreshToken) {
//           localStorage.setItem('refreshToken', response.data.refreshToken);
//         }

//         console.log('✅ Token refreshed after 401');

//         // 🔄 حدّث الطلب الأصلي بالـ Token الجديد
//         originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

//         // ✅ عالج كل الطلبات اللي كانت مستنية في الـ Queue
//         processQueue(null, newToken);

//         // خلصنا من عملية الـ Refresh
//         isRefreshing = false;

//         // 🔁 أعد إرسال الطلب الأصلي بالـ Token الجديد
//         return api(originalRequest);

//       } catch (err) {
//         // ❌ فشل الـ Refresh Token (يعني الـ Refresh Token منتهي أو مش صحيح)
//         console.error('❌ Refresh failed after 401:', err);

//         // فشّل كل الطلبات اللي في الـ Queue
//         processQueue(err, null);

//         // خلصنا من محاولة الـ Refresh
//         isRefreshing = false;

//         // امسح كل البيانات من localStorage
//         localStorage.clear();

//         // اعمل Logout وروح على صفحة Login
//         window.location.href = '/login';

//         return Promise.reject(err);
//       }
//     }

//     // ✅ لو الـ Error مش 401 (مثلاً 404, 500, etc.)
//     // رجّع الـ Error عادي للمستدعي
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/",
});

// متغيرات التحكم بالـ Queue والـ Refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Interceptor للطلبات (إضافة الـ Token لكل طلب)
api.interceptors.request.use(
  (config) => {
const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor للردود (معالجة انتهاء الصلاحية 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // تجاهل أخطاء الـ Login العادية
    if (originalRequest.url.includes("/Account/login")) {
      return Promise.reject(error);
    }

    // إذا كان الخطأ 401 ولم يتم تجربة الطلب مسبقاً
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // إذا كان هناك طلب refresh قيد التنفيذ، أضف هذا الطلب للانتظار
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // طلب توكن جديد - نستخدم axios العادي وليس api instance
        const response = await axios.post(
          "https://uni1swap.runasp.net/Account/refresh-token",
          { refreshToken: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        const storage = localStorage.getItem("refreshToken") ? localStorage : sessionStorage;
         // فك التوكن الجديد لتحديث وقت الانتهاء في الـ localStorage
        // هذا السطر مهم جداً لضمان استمرار الدورة بشكل صحيح
        const decoded = JSON.parse(atob(accessToken.split('.')[1])); 
        storage.setItem('accessTokenExpiration', decoded.exp);
        
        // تحديث البيانات في LocalStorage
        storage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          storage.setItem("refreshToken", newRefreshToken);
        }

        // إكمال الطلبات المعلقة
        processQueue(null, accessToken);

        // تحديث الطلب الحالي وإعادة إرساله
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// دالة تنظيف البيانات والتحويل للـ Login
function handleLogout() {
  localStorage.clear();
  sessionStorage.clear(); // مهم جداً لمسح الجلسات المؤقتة
  setToken(null); // عشان الواجهة تتحدث فوراً
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

export default api;
