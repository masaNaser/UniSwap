import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import MessegeIcon from "../../assets/images/MessegeIcon.svg";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../Context/ProfileContext";
import { useCurrentUser } from "../../Context/CurrentUserContext"; // ⬅️ أضف هذا
import RequestServiceModal from "../../components/Modals/RequestServiceModal";
import EditProfileModal from "../../components/Modals/EditProfileModal";
import { getImageUrl } from "../../utils/imageHelper";
import ReportModal from "../../components/Modals/ReportModal";

export default function ProfileHeader() {
  const { userData, isMyProfile, fetchUserData } = useProfile();
  const { setCurrentUser } = useCurrentUser(); // ⬅️ أضف هذا
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleProfileUpdated = async () => {
    console.log("🔄 Refreshing profile data...");

    // انتظر قليلاً للسماح للسيرفر بمعالجة الصور
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedData = await fetchUserData();
    console.log("✅ Profile refreshed with new data:", updatedData);

    // ⬇️ إذا كان هذا بروفايلي، حدّث CurrentUser كمان
    if (isMyProfile) {
      console.log("🔄 Syncing CurrentUser context...");
      setCurrentUser(updatedData);
    }

    return updatedData;
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

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRequestModalOpen(false);
    setIsReportModalOpen(false);
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
            backgroundImage: `url(${getImageUrl(userData?.coverImg)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
            }}
          />

          {isMyProfile && (
            <>
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
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
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
            <Stack
              direction={"row"}
              spacing={{ xs: 1, sm: 3 }}
              alignItems={{ xs: "center", sm: "flex-end" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={getImageUrl(
                    userData?.profilePicture,
                    userData?.userName
                  )}
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
                    top: -8,
                    left: { xs: 48, sm: 58, md: 65 },
                    width: "fit-content",
                    maxWidth: "none",
                    fontWeight: "bold",
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  }}
                />
              </Box>

              <Box
                sx={{
                  textAlign: { xs: "center", sm: "left" },
                  position: "relative",
                  top: 8,
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", sm: "1.4rem", md: "1.5rem" } }}
                >
                  {userData?.userName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                  }}
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
                    <StarIcon
                      sx={{ fontSize: { xs: 16, md: 18 }, color: "#FFD700" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                    >
                      {userData?.averageRating} ({userData?.ratingCount}{" "}
                      reviews)
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            {!isMyProfile && (
              <>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    mt: { md: "-174px" },
                    ml: { md: "-124px" },
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: "white" }}
                      >
                        <path
                          d="M5.75016 15.0062C7.34064 15.8221 9.17023 16.0431 10.9092 15.6294C12.6482 15.2156 14.1823 14.1944 15.235 12.7497C16.2876 11.305 16.7897 9.53181 16.6506 7.74969C16.5116 5.96757 15.7406 4.2937 14.4767 3.02972C13.2127 1.76574 11.5388 0.994767 9.7567 0.855738C7.97457 0.716708 6.20139 1.21876 4.75668 2.27143C3.31197 3.3241 2.29074 4.85815 1.87702 6.59715C1.46329 8.33615 1.68428 10.1657 2.50016 11.7562L0.833496 16.6729L5.75016 15.0062Z"
                          stroke="currentColor"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
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
                    onClick={handleReport}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "rgb(214 12 12 / 71%)",
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
                    onClick={handleReport}
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

      <ReportModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userId={userData?.id}
        userName={userData?.userName}
      />
    </>
  );
}
