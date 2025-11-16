import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageHelper"; // ✅ استيراد الـ helper

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
}) {

  
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  const isLongDescription = description && description.length > 100;
  const displayedDescription = showFullDescription
    ? description
    : isLongDescription
      ? description.substring(0, 100) + "..."
      : description;

  const getStatusStyles = (status) => {
    const styles = {
      Active: { bg: "#DBEAFE", text: "#2563EB" },
      Completed: { bg: "#D1FAE5", text: "#059669" },
      Overdue: { bg: "#FEE2E2", text: "#DC2626" },
      Pending: { bg: "#FEF3C7", text: "#F59E0B" },
      Requesting: { bg: "#DBEAFE", text: "#2563EB" },
    };
    return styles[status] || styles.Active;
  };

  const statusStyles = getStatusStyles(projectStatus);

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
  
  // ✅ استخدام getImageUrl بدل الصورة المباشرة
  const rawAvatar = isProvider ? clientAvatar : providerAvatar;
  const displayAvatar = getImageUrl(rawAvatar, displayName);
  
  const displayRole = isProvider ? "Client" : "Service Provider";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formattedDeadline = formatDate(deadline);
  
  const formatCreatedAt = (dateString) => {
    if (!dateString || dateString.startsWith("0001-01-01")) return "";
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return "";
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return "";
    }
  };

  const formattedCreatedAt = formatCreatedAt(createdAt);

  const handleCardClick = () => {
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
      },
    });
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        width: "320px",
        height: "420px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #F3F4F6",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
        },
        cursor: "pointer",
        bgcolor: "#FFFFFF",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 3,
          "&:last-child": { pb: 3 },
        }}
      >
        {/* Status Chip at Top */}
        <Box mb={2}>
          <Chip
            label={projectStatus}
            size="small"
            sx={{
              bgcolor: statusStyles.bg,
              color: statusStyles.text,
              fontWeight: 600,
              fontSize: "12px",
              height: "28px",
              px: 1.5,
              borderRadius: "6px",
              textTransform: "capitalize",
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="700"
          mb={1.5}
          fontSize="20px"
          lineHeight={1.3}
          color="#1F2937"
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

        {/* Description with Read More */}
        <Box mb={2.5}>
          <Typography
            variant="body2"
            color="#6B7280"
            fontSize="14px"
            lineHeight={1.6}
            sx={{
              wordBreak: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              maxHeight: showFullDescription ? "none" : "63px",
            }}
          >
            {displayedDescription}
          </Typography>
          {isLongDescription && (
            <Typography
              variant="caption"
              sx={{
                color: "#3B82F6",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "12px",
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
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Avatar
            src={displayAvatar} // ✅ هون رح تظهر الصورة الحقيقية أو الـ fallback
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#3B82F6",
              fontWeight: "bold",
              fontSize: "16px",
              flexShrink: 0,
            }}
          >
            {/* ✅ الـ initials رح تظهر بس إذا الصورة ما اشتغلت */}
            {!displayAvatar && displayInitials}
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography
              variant="body2"
              fontWeight="700"
              fontSize="15px"
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
              color="#6B7280"
              fontSize="13px"
              fontWeight="400"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayRole}{formattedCreatedAt && ` • ${formattedCreatedAt}`}
            </Typography>
          </Box>
        </Box>

        {/* Progress Section */}
        <Box mb={2.5}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              fontSize="14px"
              color="#1F2937"
            >
              Progress
            </Typography>
            <Typography
              variant="body2"
              fontWeight="700"
              fontSize="16px"
              color="#1F2937"
            >
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 10,
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
          pt={2}
          borderTop="1px solid #F3F4F6"
        >
          <Box display="flex" alignItems="center" gap={0.75}>
            <CalendarMonthIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
            <Typography
              variant="caption"
              color="#6B7280"
              fontSize="13px"
              fontWeight="500"
            >
              Due: {formattedDeadline}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}