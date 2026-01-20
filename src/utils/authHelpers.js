import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
  // يقرأ التوكن من أي مكان متاح
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
};

export const getUserName = () => {
  return localStorage.getItem("userName") || sessionStorage.getItem("userName");
};

export const getUserId = () => {
  return localStorage.getItem("userId") || sessionStorage.getItem("userId");
};

export const getUserRole = () => {
  const token = getToken(); // نستخدم الدالة الجديدة هنا
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (error) {
    return null;
  }
};

export const isAdmin = () => {
  return getUserRole() === "Admin";
};

export const isAuthenticated = () => {
  return !!getToken(); // نستخدم الدالة الجديدة هنا
};