// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/",
//   withCredentials: true,
// });

// // متغيرات التحكم بالـ Queue والـ Refresh
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// // 1. Interceptor للطلبات
// api.interceptors.request.use(
//   (config) => {
//     const token =
//       localStorage.getItem("accessToken") ||
//       sessionStorage.getItem("accessToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 2. Interceptor للردود
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/Account/login") &&
//       !originalRequest.url.includes("/Account/refresh-token") &&
//       !originalRequest.url.includes("/Account/logout")
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = "Bearer " + token;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const response = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/"}Account/refresh-token`,
//           {},
//           { withCredentials: true }
//         );

//         const { accessToken, refreshToken: newRefreshToken } = response.data;
//         const storage = localStorage.getItem("refreshToken")
//           ? localStorage
//           : sessionStorage;

//         const decoded = jwtDecode(accessToken);
//         storage.setItem("accessToken", accessToken);
//         storage.setItem("accessTokenExpiration", decoded.exp);

//         if (newRefreshToken) {
//           storage.setItem("refreshToken", newRefreshToken);
//         }

//         processQueue(null, accessToken);

//         originalRequest.headers.Authorization = "Bearer " + accessToken;
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);

//         if (refreshError.response?.status === 401) {
//           handleLogout();
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false; // 🔴 هذا كان ناقص عندك
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // دالة تسجيل الخروج
// function handleLogout() {
//   localStorage.clear();
//   sessionStorage.clear();
//   if (!window.location.pathname.includes("/login")) {
//     window.location.href = "/login";
//   }
// }

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/",
  withCredentials: true, // مهم جداً لإرسال الـ cookies
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

      try {
        // طلب توكن جديد - الـ refresh token موجود بالـ cookie تلقائياً
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/"}Account/refresh-token`,
          {}, // body فاضي لأن الـ backend بيقرأ من الـ cookie
          { 
            withCredentials: true, // مهم لإرسال الـ cookies
            headers: { "Content-Type": "application/json" }
          }
        );

        const { accessToken } = response.data;
        
        // تحديد نوع الـ storage المستخدم
        const storage = localStorage.getItem("accessToken") ? localStorage : sessionStorage;
        
        // فك التوكن الجديد لتحديث وقت الانتهاء
        const decoded = JSON.parse(atob(accessToken.split('.')[1])); 
        storage.setItem('accessTokenExpiration', decoded.exp);
        
        // تحديث الـ access token
        storage.setItem("accessToken", accessToken);

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
  sessionStorage.clear();
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

export default api;