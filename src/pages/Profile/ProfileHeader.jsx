import React from "react";
import { Box, Avatar, Typography, Button, Stack, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../Context/ProfileContext";
import RequestServiceModal from "../../components/Modals/RequestServiceModal"
export default function ProfileHeader() {
  //  const[userData,setUserData] = useState(null);
  const { userData, isMyProfile } = useProfile();
  const navigate = useNavigate();
  const[isRequestModalOpen,setIsRequestModalOpen] = useState(false);
  const handleMessageClick = () => {
    if (!userData?.id) return;

    // روح مباشرة على صفحة الشات
    navigate("/chat", {
      state: {
        convId: null, // ما نعرف إذا في محادثة ولا لأ
        receiverId: userData.id,
        receiverName: userData.userName,
        receiverImage: userData.profilePicture,
        autoOpen: true, // ⬅️ علامة إننا جايين من profile
      },
    });
  };
  
  
    // دالة لفتح المودال
  const handleRequestService = () => {
    setIsRequestModalOpen(true);
  };

    // دالة لإغلاق المودال
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
        height: "100vh",
      }}
    >
      {/* الغلاف */}
      <Box
        sx={{
          width: "100%",
          height: 260,
          backgroundImage: `url(${
            userData?.coverImg ||
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
        {/* فلتر غامق خفيف */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
          }}
        />

        {/* زر تعديل البروفايل*/}
        {isMyProfile ? (
          <Button
            variant="contained"
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
        ) : (
          ""
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
                  userData?.profilePicture ||
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
                {/*  <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{user.location}</Typography>
                </Stack> */}

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

          {/* الأزرار على اليمين */}
          {!isMyProfile ? (
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
                onClick={handleRequestService} //  عشان نستدعي المودال
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
            </Stack>
          ) : (
            ""
          )}
        </Stack>
      </Box>
    </Box>




      {/* المودال */}
      <RequestServiceModal
        open={isRequestModalOpen}
        onClose={handleCloseModal}
        providerId={userData?.id} // ⬅️ مهم: ID اليوزر اللي بدك تطلب منه
          providerName={userData?.userName}

      />
    </>
  );
}
