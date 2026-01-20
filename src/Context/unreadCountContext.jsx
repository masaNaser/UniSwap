import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getUnreadCount, createChatHubConnection } from '../services/chatService';
import { getToken, getUserId } from '../utils/authHelpers';

export const UnreadCountContext = createContext();

export const UnreadCountProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const connectionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const refreshUnreadCount = useCallback(async () => {
    const currentToken = getToken();
    if (!currentToken) return;

    try {
      const response = await getUnreadCount(currentToken);
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  }, []);

  const decreaseUnreadCount = useCallback((amount = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - amount));
  }, []);

  //  دالة لإيقاف الاتصال بشكل آمن
  const stopConnection = useCallback(() => {
    if (connectionRef.current) {
      try {
        connectionRef.current.stop();
      } catch (err) {
        console.error("❌ Error stopping connection:", err);
      }
      connectionRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  //  دالة لبدء الاتصال
  const startConnection = useCallback(async () => {
    const token = getToken();

    // إذا ما في توكن، نظّف ولا تحاول الاتصال
    if (!token) {
      console.log("⚠️ No token available, skipping SignalR connection");
      stopConnection();
      setUnreadCount(0);
      return;
    }

    // منع محاولات الاتصال المتعددة
    if (isConnectingRef.current) {
      console.log("⚠️ Connection already in progress");
      return;
    }

    // إذا الاتصال شغال، لا تعيد الاتصال
    if (connectionRef.current?.state === "Connected") {
      console.log("✅ Already connected to SignalR");
      await refreshUnreadCount();
      return;
    }

    isConnectingRef.current = true;

    try {
      // أوقف أي اتصال قديم
      stopConnection();

      console.log("🔄 Starting SignalR connection...");
      const connection = createChatHubConnection(token);
      connectionRef.current = connection;

      await connection.start();
      console.log("✅ SignalR Connected successfully");

      // جلب العداد فوراً بعد الاتصال
      await refreshUnreadCount();

      // إضافة مستمع للرسائل
      connection.on("ReceiveMessage", (message) => {
        const activeUserId = getUserId();
        if (String(message.senderId) !== String(activeUserId)) {
          setUnreadCount(prev => prev + 1);
        }
        window.dispatchEvent(new CustomEvent("NEW_SIGNALR_MESSAGE", { detail: message }));
      });

      // معالجة قطع الاتصال
      connection.onclose((error) => {
        console.log("⚠️ SignalR connection closed", error);
        connectionRef.current = null;
        isConnectingRef.current = false;

        // محاولة إعادة الاتصال بعد 3 ثوان إذا كان هناك توكن
        if (getToken()) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("🔄 Attempting to reconnect...");
            startConnection();
          }, 3000);
        }
      });

      isConnectingRef.current = false;

    } catch (err) {
      console.error("❌ SignalR Connection Error:", err);
      connectionRef.current = null;
      isConnectingRef.current = false;

      // محاولة إعادة الاتصال بعد 5 ثوان
      if (getToken()) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("🔄 Retrying connection after error...");
          startConnection();
        }, 5000);
      }
    }
  }, [refreshUnreadCount, stopConnection]);

  //  Effect لمراقبة حالة التوكن وبدء الاتصال
  useEffect(() => {
    // محاولة الاتصال عند التحميل
    const initConnection = async () => {
      const token = getToken();
      if (token) {
        // انتظر قليلاً للتأكد من أن كل شيء جاهز
        await new Promise(resolve => setTimeout(resolve, 500));
        startConnection();
      }
    };

    initConnection();

    // تحقق من التوكن بشكل دوري
    const checkInterval = setInterval(() => {
      const token = getToken();

      if (token && (!connectionRef.current || connectionRef.current.state !== "Connected")) {
        console.log("🔄 Token available but not connected, attempting connection...");
        startConnection();
      } else if (!token && connectionRef.current) {
        console.log("⚠️ Token removed, stopping connection");
        stopConnection();
        setUnreadCount(0);
      } else if (token && connectionRef.current?.state === "Connected") {
        // الاتصال شغال، فقط حدّث العداد
        refreshUnreadCount();
      }
    }, 3000);

    return () => {
      clearInterval(checkInterval);
      stopConnection();
    };
  }, [startConnection, stopConnection, refreshUnreadCount]);

  return (
    <UnreadCountContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        decreaseUnreadCount,
        setUnreadCount,
        connection: connectionRef.current,
        reconnect: startConnection //  إضافة دالة لإعادة الاتصال يدوياً إذا لزم الأمر
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
};

export const useUnreadCount = () => useContext(UnreadCountContext);