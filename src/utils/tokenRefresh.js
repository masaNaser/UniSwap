import { refreshToken } from '../services/authService';

/**
 * التحقق من صلاحية التوكن وتحديثه إذا كان قريب من الانتهاء
 */
export const checkAndRefreshToken = async () => {
  const storage = localStorage.getItem("accessToken") ? localStorage : sessionStorage;
  const token = storage.getItem("accessToken");
  const expiration = storage.getItem("accessTokenExpiration");

  if (!token || !expiration) {
    return false;
  }

  // حساب الوقت المتبقي بالثواني
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiration - currentTime;

  // إذا باقي أقل من 5 دقائق (300 ثانية)، حدّث التوكن
  if (timeUntilExpiry < 300) {
    try {
      const response = await refreshToken();
      const { accessToken } = response.data;

      // فك التوكن الجديد
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      
      // تحديث التخزين
      storage.setItem("accessToken", accessToken);
      storage.setItem("accessTokenExpiration", decoded.exp);
      
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // في حالة الفشل، امسح البيانات وأعد التوجيه للـ login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
      return false;
    }
  }

  return true;
};

//Timer لتحديث التوكن تلقائياً كل 10 دقائق
export const startTokenRefreshTimer = () => {
  // تحقق فوراً عند بدء التطبيق
  checkAndRefreshToken();

  // ثم كرر كل 10 دقائق
  return setInterval(() => {
    checkAndRefreshToken();
  }, 10 * 60 * 1000); // 10 minutes
};

// إيقاف Timer عند Logout
export const stopTokenRefreshTimer = (timerId) => {
  if (timerId) {
    clearInterval(timerId);
  }
};