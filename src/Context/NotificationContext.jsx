import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  createNotificationHub,
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteAll
} from "../services/notificationService";
import { getToken } from "../utils/authHelpers";
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setunreadNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const connectionRef = useRef(null);
  const hasLoadedRef = useRef(false);
  
  // ✅ استخدم state بدل مباشرة من localStorage
  const [token, setToken] = useState(() => getToken());

  // 🔥 جلب البيانات
  const loadInitialData = async () => {
    if (!token || hasLoadedRef.current) return;
    
    try {
      // console.log("🔄 Loading notifications...");
      setLoading(true);
      
      const startTime = Date.now();
      
      const [notifRes, countRes] = await Promise.all([
        getAllNotifications(token),
        getUnreadCount(token),
      ]);

      const endTime = Date.now();
      // console.log(`⏱️ API Response Time: ${endTime - startTime}ms`);
      console.log("📦 Raw API Response:", notifRes.data);
      // console.log("🔢 Unread Count:", countRes.data);

      let flatNotifications = [];
      
      if (Array.isArray(notifRes.data)) {
        flatNotifications = notifRes.data.flatMap(group => 
          Array.isArray(group.items) ? group.items : []
        );
      }

      // console.log("📋 Processed Notifications:", flatNotifications);
      // console.log("✅ Total Notifications:", flatNotifications.length);

      setNotifications(flatNotifications);
      setunreadNotificationCount(countRes.data);
      hasLoadedRef.current = true;
      
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      console.error("❌ Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
      // console.log("✅ Notifications loaded successfully");
    }
  };

  // ✅ راقب التغيير في localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // const newToken = localStorage.getItem("accessToken");
      const newToken = getToken();
      // console.log("🔄 Token changed:", newToken ? "Token exists" : "No token");
      setToken(newToken);
      hasLoadedRef.current = false; // ✅ اسمح بتحميل جديد
    };

    // راقب التغييرات من نفس الـ tab
    window.addEventListener("storage", handleStorageChange);
    
    // راقب التغييرات من نفس الـ window (login/logout)
    const intervalId = setInterval(() => {
      // const currentToken = localStorage.getItem("accessToken");
      const currentToken = getToken();
      if (currentToken !== token) {
        handleStorageChange();
      }
    }, 500); // فحص كل 500ms

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [token]);

  // ✅ جلب البيانات فوراً عند Mount أو تغيير Token
  useEffect(() => {
    if (!token) {
      console.log("⚠️ No token found");
      setLoading(false);
      setNotifications([]);
      setunreadNotificationCount(0);
      return;
    }

    // console.log("🚀 NotificationProvider Mounted");
    
    // جلب البيانات فوراً
    loadInitialData();

    // ثم اتصال SignalR
    const startConnection = async () => {
      try {
        console.log("🔌 Connecting to SignalR...");
        const connection = createNotificationHub(token);
        connectionRef.current = connection;

        connection.on("ReceiveNotification", async (notification) => {
          console.log("📬 New notification received:", notification);
          
          try {
            // إعادة جلب كل الإشعارات
            hasLoadedRef.current = false;
            await loadInitialData();
          } catch (error) {
            console.error("❌ Error reloading notifications:", error);
            // Fallback: أضف الإشعار مباشرة
            setNotifications((prev) => [notification, ...prev]);
            setunreadNotificationCount((prev) => prev + 1);
          }
        });

        await connection.start();
        console.log("✅ SignalR Connected Successfully");

      } catch (error) {
        console.error("❌ SignalR Connection Failed:", error);
      }
    };

    startConnection();

    return () => {
      console.log("🔌 Disconnecting SignalR...");
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setunreadNotificationCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("❌ Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setunreadNotificationCount(0);
    } catch (error) {
      console.error("❌ Error marking all as read:", error);
    }
  };
  
  const deleteAllNotification = async () => {
    try {
      await deleteAll(token);
      setNotifications([]);
      setunreadNotificationCount(0);
    } catch (error) {
      console.error("❌ Error deleting all:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadNotificationCount,
        loading, // ✅ شاركه مع الـ components
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        clearAll: deleteAllNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};