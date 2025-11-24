import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getUnreadCount } from '../services/chatService';

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

  // ✅ دالة لتقليل العداد مباشرة بدون استدعاء الباك
  const decreaseUnreadCount = useCallback((amount = 0) => {
    setUnreadCount((prev) => {
      const newCount = Math.max(0, prev - amount);
      console.log(`📉 Decreased unread count by ${amount}: ${prev} → ${newCount}`);
      return newCount;
    });
  }, []);

  // ✅ جلب العداد عند التحميل وكل 30 ثانية
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

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