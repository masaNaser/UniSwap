

// import React from 'react'
// import Navbar from '../components/Navbar/Navbar'
// import { Outlet } from 'react-router-dom'
// import Footer from '../components/Footer/Footer'
// import { ProfileContext } from "../Context/ProfileContext";
// import { CurrentUserProvider } from "../Context/CurrentUserContext"; // ✅ استورد الجديد
// import { useState } from "react";

// export default function MainLayout() {
//     const [userData, setUserData] = useState(null);
//     const [isMyProfile, setIsMyProfile] = useState(false);

//   return (
//     <>
//       {/* ✅ لف الكل بالـ CurrentUserProvider */}
//       <CurrentUserProvider>
//         <ProfileContext.Provider value={{ userData, setUserData, isMyProfile, setIsMyProfile }}>
//           <Navbar/>
//           <Outlet/>
//         </ProfileContext.Provider>
//         <Footer/>
//       </CurrentUserProvider>
//     </>
//   )
// }

import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { ProfileContext } from "../Context/ProfileContext";
import { CurrentUserProvider } from "../Context/CurrentUserContext";
import { GetFullProfile, GetProfileById } from "../services/profileService";
import { useParams } from "react-router-dom";

export default function MainLayout() {
  const [userData, setUserData] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);

  // ⬅️ دالة لجلب البيانات (هاي الأهم!)
  const fetchUserData = async (userId = null) => {
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
      console.log("✅ Profile data refreshed:", res.data);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
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
          fetchUserData // ⬅️ أضف الدالة هنا
        }}>
          <Navbar/>
          <Outlet/>
        </ProfileContext.Provider>
        <Footer/>
      </CurrentUserProvider>
    </>
  );
}