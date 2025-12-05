import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  createNotificationHub,
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteAll
} from "../services/notificationService";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setunreadNotificationCount] = useState(0);
  const connectionRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    const startConnection = async () => {
      try {
        const connection = createNotificationHub(token);
        connectionRef.current = connection;

        // 🔥 استقبال إشعار جديد - مع reload البيانات
        connection.on("ReceiveNotification", async (notification) => {
          console.log("📬 New notification received:", notification);
          console.log("User Image:", notification.userImage); // ← debug

          // 🔥 الحل: نجيب كل الإشعارات من جديد عشان نضمن الصور موجودة
          try {
            await loadInitialData();
          } catch (error) {
            console.error("❌ Error reloading notifications:", error);
            // لو فشل الـ reload، نضيف الإشعار كما هو
            setNotifications((prev) => [notification, ...prev]);
            setunreadNotificationCount((prev) => prev + 1);
          }
        });

        await connection.start();
        console.log("✅ SignalR Notifications Connected");

        // جلب البيانات
        await loadInitialData();
      } catch (error) {
        console.error("❌ Connection failed:", error);
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [token]);

  // 🔥 الوظيفة المهمة - جلب وتحويل البيانات
  const loadInitialData = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        getAllNotifications(token),
        getUnreadCount(token),
      ]);

      console.log("📦 API Response:", notifRes.data);

      // Backend بيرجع Array of Groups
      // نحتاج نفلطها لـ Array واحد
      let flatNotifications = [];
      
      if (Array.isArray(notifRes.data)) {
        // التحويل من Groups إلى Array مباشر
        flatNotifications = notifRes.data.flatMap(group => 
          Array.isArray(group.items) ? group.items : []
        );
      }

      console.log("📋 Flat Notifications:", flatNotifications);

      setNotifications(flatNotifications);
      setunreadNotificationCount(countRes.data);
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setunreadNotificationCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setunreadNotificationCount(0);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const deleteAllNotification = async () => {
    try {
      await deleteAll(token);
      setNotifications([]);
      setunreadNotificationCount(0);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadNotificationCount,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        clearAll: deleteAllNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};