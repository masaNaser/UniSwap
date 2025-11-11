import React, { useState } from "react";
import { Box, Avatar, Typography, Button, Stack, Chip, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from '@mui/icons-material/Report';
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../Context/ProfileContext";
import RequestServiceModal from "../../components/Modals/RequestServiceModal";
import EditProfileModal from "../../components/Modals/EditProfileModal";
import { getImageUrl } from "../../components/utils/imageHelper";

export default function ProfileHeader() {
  const { userData, isMyProfile, fetchUserData } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleProfileUpdated = async () => {
    console.log("🔄 Refreshing profile data...");
    await fetchUserData();
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
          borderRadius: { xs: "12px", md: "20px" },
          overflow: "hidden",
          color: "white",
          mt: { xs: 2, md: 5 },
        }}
      >
        {/* الغلاف */}
        <Box
          sx={{
            width: "100%",
            height: { xs: 200, sm: 220, md: 260 },
            backgroundImage: `url(${
              getImageUrl(userData?.coverImg) ||
              "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            p: { xs: 2, md: 3 },
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
            <>
              {/* للشاشات الكبيرة */}
              <Button
                variant="contained"
                onClick={() => setIsEditModalOpen(true)}
                startIcon={<EditIcon sx={{ color: "rgba(255,255,255,0.9)" }} />}
                sx={{
                  display: { xs: "none", sm: "flex" },
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

              {/* للموبايل - أيقونة فقط */}
              <IconButton
                onClick={() => setIsEditModalOpen(true)}
                sx={{
                  display: { xs: "flex", sm: "none" },
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: "center", sm: "flex-end" }}
            justifyContent="space-between"
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
            }}
          >
            {/* الصورة والمعلومات */}
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={{ xs: 1, sm: 2 }} 
              alignItems={{ xs: "center", sm: "flex-end" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={
                    getImageUrl(userData?.profilePicture) ||
                    "https://randomuser.me/api/portraits/men/75.jpg"
                  }
                  alt={userData?.userName}
                  sx={{
                    width: { xs: 70, sm: 80, md: 90 },
                    height: { xs: 70, sm: 80, md: 90 },
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
                    left: { xs: 48, sm: 58, md: 65 },
                    fontWeight: "bold",
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  }}
                />
              </Box>

              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" } }}
                >
                  {userData?.userName}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" } }}
                >
                  {userData?.universityMajor}
                </Typography>

                <Stack 
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0.5, sm: 2 }}
                  mt={1} 
                  alignItems="center"
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ fontSize: { xs: 16, md: 18 }, color: "#FFD700" }} />
                    <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                      {userData?.averageRating} ({userData?.ratingCount} reviews)
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CalendarMonthIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                      Joined
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            {/* الأزرار */}
            {!isMyProfile && (
              <>
                {/* للشاشات الكبيرة والمتوسطة */}
                <Stack 
                  direction="row" 
                  spacing={1}
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
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

                {/* للموبايل - أيقونات فقط */}
                <Stack 
                  direction="row" 
                  spacing={1}
                  sx={{ display: { xs: "flex", md: "none" } }}
                >
                  <IconButton
                    onClick={handleMessageClick}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleRequestService}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <HandshakeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {/* هون حط الفنكشن تبع الريبورت */}}
                    sx={{
                      backgroundColor: "rgba(255,0,0,0.2)",
                      color: "white",
                      backdropFilter: "blur(4px)",
                      "&:hover": {
                        backgroundColor: "rgba(255,0,0,0.3)",
                      },
                    }}
                  >
                    <ReportIcon />
                  </IconButton>
                </Stack>
              </>
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
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
}