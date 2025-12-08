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

  export const changePassword = async (data,token) =>
  {
  return await api.post(
    `/Account/ChangePassword`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );  }
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
};