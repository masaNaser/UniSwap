import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";

import { CurrentUserProvider } from "./Context/CurrentUserContext";
import { UnreadCountProvider } from "./Context/unreadCountContext";
import { NotificationProvider } from "./Context/NotificationContext";

// 🆕 إضافات الدارك مود
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeModeProvider, ThemeModeContext } from "./Context/ThemeContext";
import { useContext } from "react";

function App() {
  return (
    <ThemeModeProvider>
      <AppWithTheme />
    </ThemeModeProvider>
  );
}

function AppWithTheme() {
  const { theme } = useContext(ThemeModeContext);

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
