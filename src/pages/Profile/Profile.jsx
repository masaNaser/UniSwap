
// import { Container, Box } from "@mui/material";
// import ProfileHeader from "./ProfileHeader";
// import React, {useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   GetFullProfile,
//   GetProfileById,
// } from "../../services/profileService";
// import { useProfile } from "../../Context/ProfileContext";
// import SelectActionCard from "../../components/Cards/Cards";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
// import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
// import ProfileInfo from "../Profile/ProfileInfo"
// // import { useParams } from "react-router-dom";
// export default function Profile() {
//   const { userData, setUserData, isMyProfile, setIsMyProfile } = useProfile();
//   const { userId } = useParams();
//   const currentUserId = localStorage.getItem("userId");
//   const token = localStorage.getItem("accessToken");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const mine = !userId || userId === currentUserId;
//       setIsMyProfile(mine);
//       const res = mine
//         ? await GetFullProfile(token)
//         : await GetProfileById(token, userId);
//       setUserData(res.data);
//       console.log("userInfo", res);
//     };
//     fetchProfile();
//   }, [userId, token]);

//   if (!userData) return <p>Loading...</p>;

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ mt: 3}}>
//         <ProfileHeader onOpenChat={() => {}} />

//         <Box sx={{ mt: 4 }}>
//           <div className="cards-section">
//             <SelectActionCard
//               title="Points Earned"
//               value={userData.totalPoints}
//               icon={
//                 <WorkspacePremiumOutlinedIcon
//                   sx={{ color: "rgba(217, 119, 6, 1)", fontSize: 30 }}
//                 />
//               }
//               iconBgColor="rgba(255, 251, 235, 1)"
//             />
//             <SelectActionCard
//               title="Projects Completed"
//               value={userData.completedProjectsCount}
//               icon={
//                 <WorkOutlineOutlinedIcon
//                   sx={{ color: "rgba(5, 150, 105, 1)", fontSize: 30 }}
//                 />
//               }
//               iconBgColor="rgba(236, 253, 245, 1)" // لون أخضر فاتح
//             />
//             <SelectActionCard
//               title="Average Rating"
//               value={userData.averageRating}
//               icon={
//                 <StarBorderIcon
//                   sx={{ color: "rgba(152, 16, 250, 1)", fontSize: 30 }}
//                 />
//               }
//               iconBgColor="rgba(243, 232, 255, 1)" // لون بنفسجي فاتح
//             />
//           </div>
//         </Box>
//        <ProfileInfo />

//       </Box>
//     </Container>
//   );
// }

import { Container, Box } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../../Context/ProfileContext";
import SelectActionCard from "../../components/Cards/Cards";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ProfileInfo from "../Profile/ProfileInfo";
import ProfileTabs from "./ProfileTabs/ProfileTabs";

export default function Profile() {
  const { userData, fetchUserData } = useProfile(); // ⬅️ جيب fetchUserData من الـ Context
  const { userId } = useParams();

  useEffect(() => {
    // ⬅️ استدعي fetchUserData لما تفتح الصفحة
    fetchUserData(userId);
  }, [userId]);

  if (!userData) return <p>Loading...</p>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3 }}>
        <ProfileHeader onOpenChat={() => {}} />

        <Box sx={{ mt: 4 }}>
          <div className="cards-section">
            <SelectActionCard
              title="Points Earned"
              value={userData.totalPoints}
              icon={
                <WorkspacePremiumOutlinedIcon
                  sx={{ color: "rgba(217, 119, 6, 1)", fontSize: 30 }}
                />
              }
              iconBgColor="rgba(255, 251, 235, 1)"
            />
            <SelectActionCard
              title="Projects Completed"
              value={userData.completedProjectsCount}
              icon={
                <WorkOutlineOutlinedIcon
                  sx={{ color: "rgba(5, 150, 105, 1)", fontSize: 30 }}
                />
              }
              iconBgColor="rgba(236, 253, 245, 1)"
            />
            <SelectActionCard
              title="Average Rating"
              value={userData.averageRating}
              icon={
                <StarBorderIcon
                  sx={{ color: "rgba(152, 16, 250, 1)", fontSize: 30 }}
                />
              }
              iconBgColor="rgba(243, 232, 255, 1)"
            />
          </div>
        </Box>
        <ProfileInfo />
      </Box>


      <ProfileTabs/>
    </Container>
  );
}