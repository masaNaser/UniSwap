import * as signalR from "@microsoft/signalr";
import api from "./api";

const HUB_BASE_URL = "https://uni1swap.runasp.net"; 

// إنشاء اتصال SignalR
export function createNotificationHub(token) {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_BASE_URL}/notifications`, {  
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();
}

// جلب جميع الإشعارات
export const getAllNotifications = async (token) => {
  return await api.get("/Notifications/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// جلب عدد غير المقروءة
export const getUnreadCount = async (token) => {
  return await api.get("/Notifications/unread", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// وضع علامة مقروء على إشعار معين
export const markAsRead = async (notificationId, token) => {
  return await api.put(`/Notifications/read/${notificationId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// وضع علامة مقروء على الكل
export const markAllAsRead = async (token) => {
  return await api.put("/Notifications/read/all", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// حذف جميع الإشعارات
export const deleteAll = async (token) => {
  return await api.delete(`/Notifications/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};