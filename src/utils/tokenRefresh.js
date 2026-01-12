import { refreshToken } from '../services/authService';
import { jwtDecode } from "jwt-decode";

/**
  التحقق من صلاحية التوكن وتحديثه إذا كان قريب من الانتهاء
 */
export const checkAndRefreshToken = async () => {
  console.log("🔍 [Timer] Checking token status...");
  
  const storage = localStorage.getItem("accessToken") ? localStorage : sessionStorage;
  const token = storage.getItem("accessToken");
  const expiration = storage.getItem("accessTokenExpiration");

  if (!token || !expiration) {
    console.log("⚠️ [Timer] No token or expiration found");
    return false;
  }

  // Convert expiration string to number (وقت انتهاء الصلاحية يكون بالثواني)
  const expirationTime = parseInt(expiration, 10);
  if (isNaN(expirationTime)) {
    console.error("❌ [Timer] Invalid expiration format");
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  // الناتج = كم ثانية بقيت للتوكن.
  const timeUntilExpiry = expirationTime - currentTime;

  console.log(`⏱️ [Timer] Token expires in ${Math.floor(timeUntilExpiry / 60)} minutes (${timeUntilExpiry} seconds)`);

  //  Refresh if less than 6 minutes remaining (increased buffer for safety)
  if (timeUntilExpiry < 360) {
    console.log(`🔄 [Timer] Token expiring soon (${Math.floor(timeUntilExpiry / 60)} min remaining), refreshing...`);
    try {
      const response = await refreshToken();
      const { accessToken } = response.data;

      // Decode new token
      const decoded = jwtDecode(accessToken);
      
      // Update storage
      storage.setItem("accessToken", accessToken);
      storage.setItem("accessTokenExpiration", decoded.exp.toString());
      
      const newTimeLeft = decoded.exp - Math.floor(Date.now() / 1000);
      console.log(`✅ [Timer] Token refreshed successfully - new expiry in ${Math.floor(newTimeLeft / 60)} minutes`);
      return true;
    } catch (error) {
      console.error("❌ [Timer] Failed to refresh token:", error);
      
      // Clear and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
      return false;
    }
  }

  console.log(`✔️ [Timer] Token is still valid, no refresh needed`);
  return true;
};

/**
   Check every 5 minutes in production
 */
export const startTokenRefreshTimer = () => {
  console.log("✅ [Timer] Token refresh timer starting...");
  
  // Check immediately on start
  checkAndRefreshToken();

  //  Check every 5 minutes
/*
كل 5 دقائق → نفحص التوكن
إذا قرب ينتهي → نعمل refresh
*/ 
  const timerId = setInterval(() => {
    console.log("⏰ [Timer] 5-minute interval triggered");
    checkAndRefreshToken();
  }, 5 * 60 * 1000); // 5 minutes

  console.log(`✅ [Timer] Timer started (ID: ${timerId}, checks every 5 min)`);
  return timerId;
};

/**
 * Stop the timer
 */
export const stopTokenRefreshTimer = (timerId) => {
  if (timerId) {
    clearInterval(timerId);
    console.log(`🛑 [Timer] Token refresh timer stopped (ID: ${timerId})`);
  }
};