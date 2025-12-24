import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { GetFullProfile } from "../services/profileService";
import { getToken } from "../utils/authHelpers";
export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enablePolling, setEnablePolling] = useState(false); // 🔥 جديد
  const pollingIntervalRef = useRef(null);

  // ✅ الدالة المحسّنة لتحديث بيانات المستخدم
 const updateCurrentUser = useCallback(async () => {
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  if (!token) {
    console.log("⚠️ No token found, skipping update");
    return null;
  }

  try {
    const res = await GetFullProfile(token);    
    // 🔥 الحل الأقوى: استخدمي functional update
    setCurrentUser(prevUser => {
      
      // ✅ هاد بيضمن إنه الـ state يتحدث
      return { ...res.data };
    });
    
    return res.data;
  } catch (error) {
    console.error("❌ Error updating current user:", error);
    return null;
  }
}, []);

  // 🔥 دالة لتفعيل الـ Polling المؤقت
  const startTemporaryPolling = useCallback((duration = 2000) => {
    setEnablePolling(true);

    // أوقف الـ polling بعد المدة المحددة
    setTimeout(() => {
      setEnablePolling(false);
    }, duration);
  }, []);

  // ✅ تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    const fetchCurrentUser = async () => {
      // const token = localStorage.getItem("accessToken");
      const token = getToken();
      if (token) {
        try {
          const res = await GetFullProfile(token);
          setCurrentUser(res.data);
        } catch (error) {
          console.error("❌ Error loading current user:", error);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // 🔥 Polling Effect - بس لما يكون مفعّل
  useEffect(() => {
    if (enablePolling) {
      
      pollingIntervalRef.current = setInterval(() => {
        updateCurrentUser();
      }, 2000); // كل ثانيتين

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [enablePolling, updateCurrentUser]);

  return (
    <CurrentUserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      updateCurrentUser,
      startTemporaryPolling, // 🔥 جديد
      loading 
    }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider');
  }
  return context;
};