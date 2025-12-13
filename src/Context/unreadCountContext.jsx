import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getUnreadCount } from '../services/chatService';
import { createChatHubConnection } from '../services/chatService'; // ✅ استورد الـ Hub

const UnreadCountContext = createContext();

export const useUnreadCount = () => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error('useUnreadCount must be used within UnreadCountProvider');
  }
  return context;
};

export const UnreadCountProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem('accessToken');
  const connectionRef = useRef(null); // ✅ حفظ الاتصال

  // ✅ دالة لتحديث العداد من الباك إند
  const refreshUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getUnreadCount(token);
      setUnreadCount(response.data || 0);
      console.log('🔄 Updated unread count:', response.data);
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  }, [token]);

  // ✅ دالة لتقليل العداد مباشرة
  const decreaseUnreadCount = useCallback((amount = 0) => {
    setUnreadCount((prev) => {
      const newCount = Math.max(0, prev - amount);
      console.log(`📉 Decreased unread count by ${amount}: ${prev} → ${newCount}`);
      return newCount;
    });
  }, []);

  // ✅ اتصال SignalR لاستقبال الرسائل الجديدة
  useEffect(() => {
    if (!token) return;

    const startConnection = async () => {
      try {
        const connection = createChatHubConnection(token);
        connectionRef.current = connection;

        // ✅ استقبال رسالة جديدة
        connection.on("ReceiveMessage", (message) => {
          console.log("📬 New message received in UnreadCountContext:", message);
          
          // ✅ زيادة العداد مباشرة
          setUnreadCount((prev) => prev + 1);
          console.log("🔔 Unread count increased");
        });

        await connection.start();
        console.log("✅ SignalR Chat Hub connected in UnreadCountContext");

        // جلب العداد الأولي
        await refreshUnreadCount();
      } catch (error) {
        console.error("❌ SignalR connection failed:", error);
      }
    };

    startConnection();

    // ✅ تنظيف الاتصال عند الخروج
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        console.log("🔌 SignalR disconnected from UnreadCountContext");
      }
    };
  }, [token, refreshUnreadCount]);

  // ✅ جلب العداد كل 30 ثانية (كنسخة احتياطية)
  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount, token]);

  return (
    <UnreadCountContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        decreaseUnreadCount,
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
};