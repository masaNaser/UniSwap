import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/",
  withCredentials: true, // مهم جداً لإرسال الـ cookies
});

// Create a separate axios instance for refresh calls (no interceptors)
const apiRefresh = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/",
  withCredentials: true,
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
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
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

    //  تجاهل أخطاء Login و Register و refresh-token
    const excludedUrls = [
      "/Account/login",
      "/Account/register",
      "/Account/refresh-token",
    ];
    if (excludedUrls.some((url) => originalRequest.url.includes(url))) {
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
        //  Use the separate refresh instance
        const response = await apiRefresh.post("/Account/refresh-token", {});
        const { accessToken } = response.data;

        // Determine which storage to use
        const storage = localStorage.getItem("accessToken")
          ? localStorage
          : sessionStorage;

        // Properly decode and store expiration as NUMBER
        try {
          const decoded = jwtDecode(accessToken);
          storage.setItem("accessToken", accessToken);
          storage.setItem("accessTokenExpiration", decoded.exp.toString());

          console.log("✅ Token refreshed successfully");
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
        }

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
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

function handleLogout() {
  console.log("🚪 Session expired, logging out...");
  localStorage.clear();
  sessionStorage.clear();
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
}

export default api;
