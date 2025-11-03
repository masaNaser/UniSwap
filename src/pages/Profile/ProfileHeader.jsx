import React, { useState } from "react";
import { Box, Avatar, Typography, Button, Stack, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../Context/ProfileContext";
import RequestServiceModal from "../../components/Modals/RequestServiceModal";
import ReportIcon from '@mui/icons-material/Report'; 
import EditProfileModal from "../../components/Modals/EditProfileModal";
import { getImageUrl } from "../../components/utils/imageHelper"; 

export default function ProfileHeader() {
  const { userData, isMyProfile, fetchUserData } = useProfile(); // ⬅️ جيب fetchUserData
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // ⬅️ دالة تُستدعى بعد التعديل الناجح
  const handleProfileUpdated = async () => {
    console.log("🔄 Refreshing profile data...");
    await fetchUserData(); // ⬅️ اجلب البيانات من جديد
    setIsEditModalOpen(false);
  };

  const handleMessageClick = () => {
    if (!userData?.id) return;
    navigate("/chat", {
      state: {
        convId: null,
        receiverId: userData.id,
        receiverName: userData.userName,
        receiverImage: userData.profilePicture,
        autoOpen: true,
      },
    });
  };

  const handleRequestService = () => {
    setIsRequestModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRequestModalOpen(false);
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          color: "white",
          mt: 5,
        }}
      >
        {/* الغلاف */}
        <Box
          sx={{
            width: "100%",
            height: 260,
            backgroundImage: `url(${
              getImageUrl(userData?.coverImg) ||
              "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            p: 3,
          }}
        >
          {/* فلتر غامق */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
            }}
          />

          {/* زر تعديل البروفايل */}
          {isMyProfile && (
            <Button
              variant="contained"
              onClick={() => setIsEditModalOpen(true)}
              startIcon={<EditIcon sx={{ color: "rgba(255,255,255,0.9)" }} />}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                textTransform: "none",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Edit Profile
            </Button>
          )}

          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-end"
            justifyContent="space-between"
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
            }}
          >
            {/* الصورة والمعلومات */}
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={
                    getImageUrl(userData?.profilePicture) ||
                    "https://randomuser.me/api/portraits/men/75.jpg"
                  }
                  alt={userData?.userName}
                  sx={{
                    width: 90,
                    height: 90,
                    border: "3px solid white",
                  }}
                />
                <Chip
                  label={userData?.rank}
                  color="secondary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 65,
                    fontWeight: "bold",
                  }}
                />
              </Box>

              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {userData?.userName}
                </Typography>
                <Typography variant="body1">
                  {userData?.universityMajor}
                </Typography>

                <Stack direction="row" spacing={2} mt={1} alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ fontSize: 18, color: "#FFD700" }} />
                    <Typography variant="body2">
                      {userData?.averageRating} ({userData?.ratingCount} reviews)
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CalendarMonthIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">Joined</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            {/* الأزرار */}
            {!isMyProfile && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={handleMessageClick}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Message
                </Button>
                <Button
                  onClick={handleRequestService}
                  variant="contained"
                  startIcon={<HandshakeIcon />}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  Request Service
                </Button>

                <Button
                  variant="contained"
                  startIcon={<ReportIcon />}
                  onClick={() => {/* هون حط الفنكشن تبع الريبورت */}}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      backgroundColor: "rgba(255,0,0,0.3)",
                    },
                  }}
                >
                  Report
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>

      {/* المودالات */}
      <RequestServiceModal
        open={isRequestModalOpen}
        onClose={handleCloseModal}
        providerId={userData?.id}
        providerName={userData?.userName}
      />

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onProfileUpdated={handleProfileUpdated} // ⬅️ مرر الدالة
      />
    </>
  );
}