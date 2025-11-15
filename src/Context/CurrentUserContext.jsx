
// بستخدمه في الـ Navbar (وأي مكان بدك فيه بيانات اليوزر المسجل)
// بيعرض بيانات اليوزر المسجل دخول دائمًا
// ما بتتغير لما تدخل ع بروفايلات ثانية


// ✅ CurrentUserContext.js - ملف جديد اعمله
import { createContext, useContext, useState, useEffect } from "react";
import { GetFullProfile } from "../services/profileService";

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await GetFullProfile(token);
          console.log("Loaded current user:", res.data);
          setCurrentUser(res.data);
        } catch (error) {
          console.error("Error loading current user:", error);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);