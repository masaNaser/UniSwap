import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EditIcon from "@mui/icons-material/Edit";
import {GetFullProfile} from "../../services/profileService"
import {sendMessage} from "../../services/chatService"
import  { useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader() {
    const navigate = useNavigate();

 const[userData,setUserData] = useState(null);
  const currentUserId = localStorage.getItem("userId");

  const user = {
    name: "John Doe",
    title: "Full-Stack Developer & Mentor",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 47,
    joined: "September 2021",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    cover:
      "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1000&q=80",
    role: "Expert",
  }; 
   const token = localStorage.getItem("accessToken");
     // جلب بيانات البروفايل

      const profile = async () => {
      try {
        const response = await GetFullProfile(token);
        console.log('Profile data:', response);
        setUserData(response.data);
  if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", response.data.id);
      }}
      catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }
     useEffect(() => {
     profile();
    }, []);

      // عند الضغط على زر Message
  const handleMessageClick = async () => {
    if (!userData.id) return;

    const receiverId = userData.id;

    try {
      // إرسال رسالة فاضية لإنشاء المحادثة إذا ما كانت موجودة
      const newConv = await sendMessage(receiverId, "", null,[]);

      // نمرر البيانات للـ ChatPage/ChatWindow لفتح المحادثة
          navigate("/chat", {
        state: {
          convId: newConv.conversationId || newConv.id,
          receiverId: userData.id,
          receiverName: userData.userName,
          receiverImage: userData.profilePicture,
        },
      });
    } catch (err) {
      console.error("فشل فتح المحادثة:", err);
    }
  };
  return (
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
          backgroundImage: `url(${user.cover|| userData?.coverImg})`,
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
                 src={userData?.profilePicture || "https://randomuser.me/api/portraits/men/75.jpg"}
                 alt={userData?.userName}
                sx={{
                  width: 90,
                  height: 90,
                  border: "3px solid white",
                }}
              />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold">
                {userData?.userName}
              </Typography>
              {/* <Typography variant="body1">{user.title}</Typography> */}
              <Typography variant="body1">{userData?.universityMajor}</Typography>

              <Stack direction="row" spacing={2} mt={1} alignItems="center">
                {/* <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{user.location}</Typography>
                </Stack> */}

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <StarIcon sx={{ fontSize: 18, color: "#FFD700" }} />
                  <Typography variant="body2">
                    {userData?.averageRating} ({userData?.ratingCount} reviews)
                    {/* ({user.reviews} reviews) */}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarMonthIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    Joined {user.joined}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* الأزرار على اليمين */}
          <Stack direction="row" spacing={1}>
            <Button
              onClick={handleMessageClick}
              variant="contained"
              startIcon={<ChatBubbleOutlineIcon />}
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
        </Stack>
      </Box>
    </Box>
  );
}


 {/* زر تعديل البروفايل */}
          {/* <Box sx={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              startIcon={<EditIcon sx={{color:"rgba(255,255,255,0.9)"}}/>}
              sx={{
                color: "rgba(255,255,255,0.9)",
                textTransform: "none",
                backgroundColor: "none",
              }}
            >
              Edit Profile
            </Button>
          </Box> */}