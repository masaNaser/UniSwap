import api from "./api";
import axios from "axios";

export const register = (data) => api.post("/Account/register", data);

export const login = (credentials) => api.post("/Account/login", credentials);

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
  return await api.post(
    `/Account/ChangePassword`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const logout = async () => {
  try {
    // إرسال طلب logout للباك-إند لإلغاء الـ refresh token من الـ database
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/"}Account/logout`,
      {}, // body فاضي لأن الـ backend بيقرأ refresh token من الـ cookie
      { withCredentials: true } // مهم لإرسال الـ cookies
    );
  } catch (e) {
    console.warn("Logout request failed", e);
  } finally {
    // مسح البيانات من المتصفح
    localStorage.clear();
    sessionStorage.clear();
    // التحويل للـ login
    window.location.href = "/login";
  }
};