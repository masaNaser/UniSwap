
// استخدمت useRef 
// لتخزين القيم التي أحتاجها برمجياً خلف الكواليس
//  ولكن لا أريد أن يتسبب تغييرها في إعادة رندرة المكون.
//  مثلاً في connectionRef احتفظت بمرجع لاتصال الـ SignalR
//  لأتمكن من إغلاقه عند الـ 
// Unmount،
// وفي hasLoadedRef
//  استخدمته كـ 
// Flag 
// لمنع تكرار طلبات
//  الـ 
// API 
// غير الضرورية."


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
import { useCurrentUser } from "./CurrentUserContext";
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setunreadNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // . تخزين اتصال الـ SignalR (connectionRef)
// الهدف: 
// الحفاظ على نفس الاتصال (Instance) مفتوحاً.
  const connectionRef = useRef(null);
  // مفتاح أمان لمنع التكرار (hasLoadedRef)
// الهدف: 
// التأكد من أن جلب البيانات من الـ API يتم مرة واحدة فقط
  const hasLoadedRef = useRef(false);

  // ✅ استخدم state بدل مباشرة من localStorage
  const [token, setToken] = useState(() => getToken());
  const { updateCurrentUser } = useCurrentUser();

  // وظيفتها الأساسية هي إحضار الإشعارات من السيرفر وترتيبها بحيث يفهمها المتصفح.
  const loadInitialData = async () => {
    if (!token || hasLoadedRef.current) return;

    try {
      // console.log("🔄 Loading notifications...");
      setLoading(true);

      const startTime = Date.now();
// Promise.all: 
//  بدلاً من جلب الإشعارات ثم الانتظار ثم جلب العدد،
//  نقوم بطلب الاثنين معاً في نفس اللحظة.
//  هذا يقلل وقت الانتظار للنصف تقريباً.
      const [notifRes, countRes] = await Promise.all([
        getAllNotifications(token),
        getUnreadCount(token),
      ]);
      const endTime = Date.now();
    // عملنا وهيك واستخدمنا موضوع الجروب لانه الباك اصلا برجع الاشعارات مصنفات ك جروب
    // (flatMap): تقوم هذه الدالة بفتح هذه المجموعات ودمج كل العناصر 
    // الموجودة بداخلها في مصفوفة واحدة "مسطحة"
    //  (Flat Array).
      let flatNotifications = [];
      if (Array.isArray(notifRes.data)) {
        flatNotifications = notifRes.data.flatMap(group =>
          Array.isArray(group.items) ? group.items : []
        );
      }

      setNotifications(flatNotifications);
      setunreadNotificationCount(countRes.data);
      hasLoadedRef.current = true;

    } catch (error) {
      console.error("❌ Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // هذا الجزء من الكود يمثل "نظام المراقبة والأمان
  //  وظيفته الأساسية هي التأكد من أن الإشعارات المعروضة تخص المستخدم الحالي فقط، 
  // وتحديثها فوراً إذا تغير المستخدم (تسجيل دخول أو خروج) دون الحاجة لتحديث الصفحة يدوياً. 
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = getToken();
      setToken(newToken);
      hasLoadedRef.current = false; //  اسمح بتحميل جديد
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
        const connection = createNotificationHub(token);
        connectionRef.current = connection;

        connection.on("ReceiveNotification", async (notification) => {

          try {
            // إعادة جلب كل الإشعارات
            hasLoadedRef.current = false;
            await loadInitialData();
            const pointsRelatedTypes = [
              "Project",
              "Completed",
              "Collaboration",
              "Review",
              "Rating",
              "System"
            ];

            const isPointsRelated =
              pointsRelatedTypes.includes(notification.refType) ||
              notification.message?.toLowerCase().includes("point") ||
              notification.message?.toLowerCase().includes("completed") ||
              notification.message?.toLowerCase().includes("accepted") ||
              notification.message?.toLowerCase().includes("earned");

            if (isPointsRelated && updateCurrentUser) {
              console.log("🔄 Updating user points after notification");
              await updateCurrentUser();
            }
          } catch (error) {
            console.error("❌ Error reloading notifications:", error);
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
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [token, updateCurrentUser]);

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