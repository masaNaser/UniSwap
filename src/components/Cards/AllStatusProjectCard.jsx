import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageHelper";
import { formatDate } from "../../utils/timeHelper";
import { useTheme } from "@mui/material/styles";

export default function AllStatusProjectCard({
  id,
  projectStatus,
  title,
  description,
  clientInitials,
  clientName,
  clientAvatar,
  providerInitials,
  providerName,
  providerAvatar,
  deadline,
  pointsOffered,
  progressPercentage,
  isProvider = true,
  createdAt,
  projectType,
}) {

  const theme = useTheme(); // 🔥 ضيفي هاد السطر
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const navigate = useNavigate();
  console.log("in all : ", projectType);

  // ✅ نحسب إذا المشروع overdue
  const actualStatus = useMemo(() => {
    const isOverdue =
      new Date(deadline) < new Date() &&
      (projectStatus === "Active" || projectStatus === "Pending");
    return isOverdue ? "Overdue" : projectStatus;
  }, [deadline, projectStatus]);

  const isLongDescription = description && description.length > 100;
  const displayedDescription = showFullDescription
    ? description
    : isLongDescription
      ? description.substring(0, 100) + "..."
      : description;

  const getStatusStyles = (status) => {
    const styles = {
      Active: { bg: "#D1FAE5", text: "#059669" },
      Pending: { bg: "#FEF3C7", text: "#F59E0B" },
      Completed: { bg: "#DBEAFE", text: "#0284C7" },
      Overdue: { bg: "#FEE2E2", text: "#DC2626" },
      SubmittedForFinalReview: { bg: "#F3E8FF", text: "#A855F7" },
    };
    return styles[status] || styles.Active;
  };

  const statusStyles = getStatusStyles(actualStatus);

  const generateInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = isProvider ? clientName : providerName;
  const displayInitials = isProvider
    ? clientInitials || generateInitials(clientName)
    : providerInitials || generateInitials(providerName);

  const rawAvatar = isProvider ? clientAvatar : providerAvatar;
  const displayAvatar = getImageUrl(rawAvatar, displayName);

  const displayRole = isProvider ? "Client" : "Service Provider";

  const getStatusDisplayLabel = (status) => {
    if (status === "SubmittedForFinalReview") {
      return "In Review";
    }
    return status;
  };

  // ✅ منع البروفايدر من الدخول للمشاريع الـ overdue
  const handleCardClick = () => {
    if (isProvider && actualStatus === "Overdue") {
      setSnackbar({
        open: true,
        message: "⚠ This project is overdue. Please contact the client to extend the deadline.",
      });
      return;
    }

    navigate(`/app/TrackTasks/${id}`, {
      state: {
        id,
        title,
        description,
        clientName,
        clientInitials,
        clientAvatar,
        pointsOffered,
        deadline,
        isProvider,
        progressPercentage,
        projectStatus: actualStatus,
        projectType,
      },
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "" });
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          width: "368px",
          height: "380px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #F3F4F6",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
          },
          cursor: "pointer",
          bgcolor: "#FFFFFF",
          bgcolor: theme.palette.mode === 'dark' ? '#474646ff' : '#FFFFFF',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2.5,
            "&:last-child": { pb: 2.5 },
          }}
        >
          {/* Status Chip at Top */}
          <Box mb={1.5}>
            <Chip
              label={getStatusDisplayLabel(actualStatus)}
              size="small"
              sx={{
                bgcolor: statusStyles.bg,
                color: statusStyles.text,
                fontWeight: 600,
                fontSize: "12px",
                height: "26px",
                px: 1.5,
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            fontWeight="700"
            mb={1}
            fontSize="18px"
            lineHeight={1.3}
            color={theme.palette.mode === 'dark' ? '#1F2937' : 'black'}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>

          {/* Description with Read More and Scroll */}
          <Box mb={1.5}>
            {!showFullDescription ? (
              <Typography
                variant="body2"
                color={theme.palette.mode === 'dark' ? '#FFFFFF' : '#6B7280'}
                fontSize="13px"
                lineHeight={1.5}
                sx={{
                  wordBreak: "break-word",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {displayedDescription}
              </Typography>
            ) : (
              <Box
                sx={{
                  maxHeight: "70px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 0.5,
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#F3F4F6",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#D1D5DB",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#9CA3AF",
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="#6B7280"
                  fontSize="13px"
                  lineHeight={1.5}
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {description}
                </Typography>
              </Box>
            )}
            {isLongDescription && (
              <Typography
                variant="caption"
                sx={{
                  color: "#3B82F6",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "11px",
                  mt: 0.5,
                  display: "inline-block",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(!showFullDescription);
                }}
              >
                {showFullDescription ? "Show less" : "Read more"}
              </Typography>
            )}
          </Box>

          {/* Client/Provider Info */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Avatar
              src={displayAvatar}
              sx={{
                width: 42,
                height: 42,
                bgcolor: "#3B82F6",
                fontWeight: "bold",
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              {!displayAvatar && displayInitials}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography
                variant="body2"
                fontWeight="700"
                fontSize="14px"
                color="#1F2937"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName || "Unknown"}
              </Typography>
              <Typography
                variant="caption"
                // color="#6B7280"
                color={theme.palette.mode === 'dark' ? '#fff' : '#6B7280'}
                fontSize="12px"
                fontWeight="400"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayRole}
              </Typography>
            </Box>
          </Box>

          {/* Progress Section */}
          <Box mb={1.5}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0.75}
            >
              <Typography
                variant="body2"
                fontWeight="600"
                fontSize="13px"
                color="#1F2937"
              >
                Progress
              </Typography>
              <Typography
                variant="body2"
                fontWeight="700"
                fontSize="15px"
                color="#1F2937"
              >
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  backgroundColor: "#3B82F6",
                },
              }}
            />
          </Box>

          {/* Footer: Due Date */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pt={1.5}
            borderTop="1px solid #F3F4F6"
          >
            <Box display="flex" alignItems="center" gap={0.75}>
              <CalendarMonthIcon sx={{ fontSize: 17, color: theme.palette.mode === 'dark' ? '#fff' : '#6B7280' }} />
              <Typography
                variant="caption"
                // color="#6B7280"
                color={theme.palette.mode === 'dark' ? '#fff' : '#6B7280'}
                fontSize="12px"
                fontWeight="500"
              >
                Due: {formatDate(deadline)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ✅ Snackbar للتحذير */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{
            width: "100%",
            bgcolor: "#F59E0B",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
