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
import ProfilePageSkeleton from "../../components/Skeletons/ProfilePageSkeleton"; // ⬅️ استورد الـ Skeleton

export default function Profile() {
  const { userData, fetchUserData } = useProfile();
  const { userId } = useParams();

  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);

  // ⬅️ استخدم الـ Skeleton بدل النص البسيط
  if (!userData) return <ProfilePageSkeleton />;

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

      <ProfileTabs userData={userData} />
    </Container>
  );
}