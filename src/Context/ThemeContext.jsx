// ThemeContext.jsx
import React, { createContext, useState, useMemo, useEffect } from "react";
import { getTheme } from "../theme";

export const ThemeModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
  theme: getTheme("light"),
});

export const ThemeModeProvider = ({ children }) => {
  //  جيب الوضع من localStorage أو استخدم light كافتراضي
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "light";
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleMode = () => {
    setMode(prev => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode); //  احفظ الاختيار
      return newMode;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};