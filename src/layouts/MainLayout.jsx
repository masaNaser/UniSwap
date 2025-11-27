

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
import { useEffect } from "react";
// import { useCurrentUser } from "../Context/CurrentUserContext";

export default function MainLayout() {
  const [userData, setUserData] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  // const { currentUser, updateCurrentUser } = useCurrentUser();

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
      console.log(" Profile data refreshed:", res.data);
          return res.data;   // ⬅⬅⬅ المهم هذا

    } catch (error) {
      console.error(" Error fetching profile:", error);
          return null;

    }
  };
// const refreshProfile = async () => {
//   const currentUserId = localStorage.getItem("userId");

//   // 1) تحديث بيانات البروفايل
//   const updatedData = await fetchUserData(currentUserId);

//   // 2) تحديث بيانات navbar (currentUser)
//   if (updatedData) {
//     updateCurrentUser(prev => ({
//       ...prev,
//       totalPoints: updatedData.totalPoints,   // ← هون النقاط الجديدة
//       averageRating: updatedData.averageRating,
//       completedProjectsCount: updatedData.completedProjectsCount
//     }));
//   }
// };

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    fetchUserData(); // 🔥 هيك من أول ما يفتح المستخدم الموقع بنجيب بياناته
  }
}, []);


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
          <Navbar/>
          <Outlet/>
        </ProfileContext.Provider>
        <Footer/>
      </CurrentUserProvider>
    </>
  );
}