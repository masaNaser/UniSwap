import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";

import { CurrentUserProvider } from "./Context/CurrentUserContext";
import { UnreadCountProvider } from "./Context/unreadCountContext";
import { NotificationProvider } from "./Context/NotificationContext";

// 🆕 إضافات الدارك مود
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeModeProvider, ThemeModeContext } from "./Context/ThemeContext";
import { useContext, useEffect, useRef } from "react";

// استيراد دوال التحديث التلقائي للتوكن
import { startTokenRefreshTimer, stopTokenRefreshTimer } from "./utils/tokenRefresh";

function App() {
  return (
    <ThemeModeProvider>
      <AppWithTheme />
    </ThemeModeProvider>
  );
}

function AppWithTheme() {
  const { theme } = useContext(ThemeModeContext);
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    // بدء Timer للتحديث التلقائي عند تحميل التطبيق
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    
    if (token) {
      refreshTimerRef.current = startTokenRefreshTimer();
      // حفظ Timer ID بشكل global لاستخدامه في Logout
      window.tokenRefreshTimerId = refreshTimerRef.current;
      console.log("✅ Token refresh timer started");
    }

    //  تنظيف Timer عند إغلاق التطبيق أو Unmount
    return () => {
      if (refreshTimerRef.current) {
        stopTokenRefreshTimer(refreshTimerRef.current);
        window.tokenRefreshTimerId = null;
        console.log("🛑 Token refresh timer stopped");
      }
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <CurrentUserProvider>
        <UnreadCountProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </UnreadCountProvider>
      </CurrentUserProvider>
    </ThemeProvider>
  );
}

export default App;