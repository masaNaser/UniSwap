import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getUnreadCount, createChatHubConnection } from '../services/chatService';
import { getToken } from '../utils/authHelpers';
export const UnreadCountContext = createContext();

export const UnreadCountProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  // const token = localStorage.getItem('accessToken');
  const token = getToken();
  const connectionRef = useRef(null); // نستخدم useRef للحفاظ على استقرار الاتصال

  // 1. دالة جلب العداد من الباك اند
  const refreshUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getUnreadCount(token);
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  }, [token]);

  // 2. دالة تقليل العداد (مهمة جداً إذا كانت تُستدعى عند قراءة الرسائل)
  const decreaseUnreadCount = useCallback((amount = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - amount));
  }, []);

  // 3. إدارة اتصال SignalR
  useEffect(() => {
    if (!token) return;

    const connection = createChatHubConnection(token);
    connectionRef.current = connection;

    const start = async () => {
      try {
        await connection.start();
        
        // جلب العداد فور نجاح الاتصال
        refreshUnreadCount();

        // الاستماع للرسائل الجديدة
        connection.on("ReceiveMessage", () => {
          setUnreadCount(prev => prev + 1);
        });
      } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
      }
    };

    start();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [token]); // لا نضع refreshUnreadCount هنا لتجنب إعادة الاتصال بلا داعي

  // 4. تحديث احتياطي كل دقيقة
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(refreshUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [token, refreshUnreadCount]);

  return (
    <UnreadCountContext.Provider 
      value={{ 
        unreadCount, 
        refreshUnreadCount, 
        decreaseUnreadCount, // أعدنا الدالة المفقودة
        setUnreadCount,
        connection: connectionRef.current 
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
};

export const useUnreadCount = () => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error("useUnreadCount must be used within an UnreadCountProvider");
  }
  return context;
};