// utils/authHelpers.js
import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isAdmin = () => {
  return getUserRole() === "Admin";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};