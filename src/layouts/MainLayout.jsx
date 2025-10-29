import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import { ProfileContext } from "../Context/ProfileContext";
import { useState } from "react";
export default function MainLayout() {
    const [userData, setUserData] = useState(null);
    const [isMyProfile, setIsMyProfile] = useState(false);

  return (
    <>
      <ProfileContext.Provider value={{ userData, setUserData, isMyProfile, setIsMyProfile }}>
       <Navbar/>
       <Outlet/>
        </ProfileContext.Provider>
       <Footer/>
    </>
  )
}

