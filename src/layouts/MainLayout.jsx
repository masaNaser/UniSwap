

import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { ProfileContext } from "../Context/ProfileContext";
import { CurrentUserProvider } from "../Context/CurrentUserContext";
import { GetFullProfile, GetProfileById } from "../services/profileService";
 import { useCurrentUser } from "../Context/CurrentUserContext";
import { Box } from '@mui/material'; // ⬅️ استوردي Box
import ScrollToTop from '../ScrollToTop';

export default function MainLayout() {
  const [userData, setUserData] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const { updateCurrentUser } = useCurrentUser(); // ✅ أضيفي هاي

  // ⬅️ دالة لجلب البيانات (هاي الأهم!)
  const fetchUserData = async (userId) => {
    const token = localStorage.getItem("accessToken");
    const currentUserId = localStorage.getItem("userId");
    
    if (!token) {
      console.warn("No token found");
      return;
    }

    try {
      const mine = !userId || userId === currentUserId;
      setIsMyProfile(mine);
      
      const res = mine
        ? await GetFullProfile(token)
        : await GetProfileById(token, userId);
      
      setUserData(res.data);
         if (mine) {
        await updateCurrentUser();
      }
          return res.data;   // ⬅⬅⬅ المهم هذا

    } catch (error) {
      console.error(" Error fetching profile:", error);
          return null;

    }
  };


  return (
    <>
      <CurrentUserProvider>
        <ProfileContext.Provider value={{ 
          userData, 
          setUserData, 
          isMyProfile, 
          setIsMyProfile,
          fetchUserData,
          // refreshProfile
        }}>
          {/* ⬇️⬇️⬇️ الحل هون ⬇️⬇️⬇️ */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ScrollToTop/>
          <Navbar />
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Outlet />
          </Box>

          <Footer />
        </Box>      
         </ProfileContext.Provider>

      </CurrentUserProvider>
    </>
  );
}