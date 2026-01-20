import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";

import { CurrentUserProvider } from "./Context/CurrentUserContext";
import { UnreadCountProvider } from "./Context/unreadCountContext";
import { NotificationProvider } from "./Context/NotificationContext";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeModeProvider, ThemeModeContext } from "./Context/ThemeContext";
import { useContext, useEffect, useRef } from "react";

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
    //  دالة للتحقق وبدء Timer
    const initializeTimer = () => {
  try {
    const token = localStorage.getItem("accessToken") || 
                  sessionStorage.getItem("accessToken");

    if (token && !window.tokenRefreshTimerId) {
      refreshTimerRef.current = startTokenRefreshTimer();
      window.tokenRefreshTimerId = refreshTimerRef.current;
      console.log(" Token refresh timer started from App.jsx");
    }
  } catch (error) {
    console.error(" Failed to start token refresh timer:", error);
  }
};

    //  بدء Timer عند تحميل التطبيق إذا كان هناك token
    initializeTimer();

    //  الاستماع لتغييرات localStorage (عند تسجيل الدخول من تاب آخر)
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" && e.newValue) {
        initializeTimer();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    //  تنظيف Timer عند إغلاق التطبيق
    return () => {
      window.removeEventListener("storage", handleStorageChange);

      if (refreshTimerRef.current) {
        stopTokenRefreshTimer(refreshTimerRef.current);
        window.tokenRefreshTimerId = null;
        console.log(" Token refresh timer stopped");
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