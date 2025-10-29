import { Container,Box } from '@mui/material'
import ProfileHeader from './ProfileHeader'
import React, { useState, useEffect } from "react";
  import { useParams } from "react-router-dom";
import { ProfileContext } from "../../Context/ProfileContext";
import { GetFullProfile, GetProfileById } from "../../services/profileService";

// export default function Profile() {
//   const [selectedConv, setSelectedConv] = useState(null);
//     const { userId } = useParams(); // بنجيب اي دي اليوزر من الرابط
//   const currentUserId = localStorage.getItem("userId");
//   const token = localStorage.getItem("accessToken");
 
//   const [userData, setUserData] = useState(null);
//   const isMyProfile = !userId || userId === currentUserId;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const res = isMyProfile
//         ? await GetFullProfile(token)
//         : await GetProfileById(token, userId);
//       setUserData(res.data);
//       console.log(res.data);
//     };
//     fetchProfile();
//   }, [userId, isMyProfile, token]);

//   if (!userData) return <p>Loading...</p>

//   return (
//     <>
//     {/* <Box>
//         <Container maxWidth="lg">
//           <ProfileHeader 
//           onOpenChat={setSelectedConv}     
//           userId={userId} 
//           />
//         </Container>
//     </Box> */}
//        <ProfileContext.Provider value={{ userData, isMyProfile, setUserData }}>
//       <Container maxWidth="lg">
//         <Box sx={{ mt: 3 }}>
//           <ProfileHeader  
//           onOpenChat={setSelectedConv}  
//           />
//         </Box>
//       </Container>
//     </ProfileContext.Provider>
//     </>
//   )
// }


import { useProfile } from "../../Context/ProfileContext";
// import { useParams } from "react-router-dom";
export default function Profile() {
  const { userData, setUserData, isMyProfile, setIsMyProfile } = useProfile();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      const mine = !userId || userId === currentUserId;
      setIsMyProfile(mine);
      const res = mine ? await GetFullProfile(token) : await GetProfileById(token, userId);
      setUserData(res.data);
    };
    fetchProfile();
  }, [userId, token]);
  
  if (!userData) return <p>Loading...</p>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3 }}>
        <ProfileHeader onOpenChat={() => {}} />
      </Box>
    </Container>
  );
}











