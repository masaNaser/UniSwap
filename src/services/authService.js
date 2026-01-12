import api from "./api";
import { stopTokenRefreshTimer } from "../utils/tokenRefresh";

// ==================== Authentication ====================

export const login = async (credentials) => {
  const response = await api.post("/Account/login", credentials);
  return response;
};

export const register = async (userData) => {
  const response = await api.post("/Account/register", userData);
  return response;
};

export const logout = async () => {
  try {
    // إرسال طلب logout للباك-إند لإلغاء الـ refresh token من الـ database
    await api.post("/Account/logout", {});
  } catch (e) {
    console.warn("Logout request failed", e);
  } finally {
    //  إيقاف Timer قبل مسح البيانات
    if (window.tokenRefreshTimerId) {
      stopTokenRefreshTimer(window.tokenRefreshTimerId);
      window.tokenRefreshTimerId = null;
    }

    // مسح البيانات من المتصفح
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/";
  }
};

// ✅ تحديث التوكن
export const refreshToken = async () => {
  const response = await api.post("/Account/refresh-token", {});
  return response;
};

// ==================== Password Management ====================

export const forgotPassword = (data) =>
  api.post("/Account/ForgotPassword", data);

export const resetPassword = ({ email, code, newPassword, confirmPassword }) =>
  api.post("/Account/reset-password", {
    email,
    code,
    newPassword,
    confirmPassword,
  });

export const changePassword = async (data, token) => {
  return await api.post(`/Account/ChangePassword`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
