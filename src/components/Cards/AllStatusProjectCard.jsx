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
  category,
  pointsOffered,
  progressPercentage,
  isProvider = true,
  createdAt,
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  const isLongDescription = description && description.length > 50;
  const displayedDescription = showFullDescription
    ? description
    : isLongDescription
    ? description.substring(0, 50) + "..."
    : description;

  const getStatusStyles = (status) => {
    const styles = {
      Active: { bg: "#ECFDF5", text: "#059669" },
      Completed: { bg: "#EFF6FF", text: "#0284C7" },
      Overdue: { bg: "#FEF2F2", text: "#DC2626" },
      Pending: { bg: "#FEF3C7", text: "#F59E0B" },
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
  const displayAvatar = isProvider ? clientAvatar : providerAvatar;
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
        category,
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
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        width: "350px",
        minHeight: "290px",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 3 },
        cursor: "pointer",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2.5,
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
          <Avatar
            src={displayAvatar}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#3b82f6",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {displayInitials}
          </Avatar>
          <Box flex={1}>
            <Typography variant="body2" fontWeight="bold" fontSize="14px">
              {displayName || "Unknown"}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize="11px">
              {displayRole}
            </Typography>
          </Box>
          <Chip
            label={projectStatus}
            size="small"
            sx={{
              bgcolor: statusStyles.bg,
              color: statusStyles.text,
              fontWeight: "bold",
              fontSize: "12px",
              height: "25px",
              width: "70px",
            }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={1}
          fontSize="16px"
          lineHeight={1.3}
        >
          {title}
        </Typography>

        {/* FIXED READ MORE (no navigation) */}
        <Box mb={1.5} flex={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize="13px"
            lineHeight={1.4}
            sx={{
              wordBreak: "break-word",
              overflowY: showFullDescription ? "auto" : "hidden",
              maxHeight: showFullDescription ? 80 : 40,
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
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={(e) => {
                e.stopPropagation(); // prevent card navigation
                setShowFullDescription(!showFullDescription);
              }}
            >
              {showFullDescription ? "Show less" : "Read more"}
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={0.5} mb={2}>
          <CalendarMonthIcon sx={{ fontSize: 15, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary" fontSize="12px">
            Due: {formattedDeadline}
          </Typography>
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2" fontWeight="600" fontSize="13px" color="#1F2937">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="600" fontSize="13px" color="#3B82F6">
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#E5E7EB",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: "#0EA5E9",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
