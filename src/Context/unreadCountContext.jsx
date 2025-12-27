import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getUnreadCount, createChatHubConnection } from '../services/chatService';
import { getToken, getUserId } from '../utils/authHelpers';

export const UnreadCountContext = createContext();

export const UnreadCountProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const connectionRef = useRef(null);

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

  useEffect(() => {
    const token = getToken();
    
    // 🔥 إذا ما في توكن، نظّف كل شي وارجع
    if (!token) {
      setUnreadCount(0);
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      return;
    }

    // 🔥 منع تكرار الاتصال
    if (connectionRef.current?.state === "Connected") {
      // لو الاتصال شغال، بس حدّث العداد
      refreshUnreadCount();
      return;
    }

    const connection = createChatHubConnection(token);
    connectionRef.current = connection;

    const start = async () => {
      try {
        await connection.start();
        console.log("✅ SignalR Connected");
        
        // 🎯 جلب العداد فوراً بعد الاتصال
        await refreshUnreadCount();

        connection.on("ReceiveMessage", (message) => {
          const activeUserId = getUserId();
          if (String(message.senderId) !== String(activeUserId)) {
            setUnreadCount(prev => prev + 1);
          }
          window.dispatchEvent(new CustomEvent("NEW_SIGNALR_MESSAGE", { detail: message }));
        });

      } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
      }
    };

    start();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []); // 🔥 بلا dependencies! بنعتمد على getToken() اللي بتقرأ أحدث قيمة

  // 🔥 إضافة: مراقب للتوكن - لما يتغير (login/logout)
  useEffect(() => {
    const checkToken = () => {
      const token = getToken();
      if (token) {
        refreshUnreadCount();
      } else {
        setUnreadCount(0);
      }
    };

    // افحص التوكن كل شوي (optional)
    const interval = setInterval(checkToken, 5000);
    
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return (
    <UnreadCountContext.Provider 
      value={{ 
        unreadCount, 
        refreshUnreadCount, 
        decreaseUnreadCount, 
        setUnreadCount,
        connection: connectionRef.current 
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
};

export const useUnreadCount = () => useContext(UnreadCountContext);