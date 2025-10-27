import api from "./api";

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

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
};