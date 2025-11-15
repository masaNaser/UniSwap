import { Box, Typography, Avatar, Chip, LinearProgress } from "@mui/material";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Header({ cardData }) {
  if (!cardData) return <div>Loading...</div>;
  const displayRole = cardData.isProvider ? "Client" : "Service Provider";
  // Format deadline date
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

  const formattedDeadline = formatDate(cardData.deadline);
  return (
    <Box p={2} bgcolor="#f5f5f5" borderRadius={2} mb={2}>
      <Box display="flex" alignItems="center" gap={2} mb={1}>
        <Avatar src={cardData.clientAvatar} sx={{ width: 40, height: 40 }}>
          {cardData.clientInitials}
        </Avatar>
        <Box>
               {/* Title */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={1}
                      lineHeight={1.3}
                    >
                      {cardData.title}
                    </Typography>
        </Box>
        <Chip label={cardData.projectStatus} size="small" />
      </Box>
      <Typography variant="body2">{cardData.description}</Typography>

      <Box mt={2} display="flex" alignItems="center" gap={3}>
        <Typography color="text.secondary">
          {displayRole}: {cardData.clientName}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarMonthIcon sx={{ fontSize: 15, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary" fontSize="12px">
            Due: {formattedDeadline}
          </Typography>
        </Box>
      </Box>
      {/* Progress Section */}
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
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
            fontWeight="600"
            fontSize="13px"
            color="#3B82F6"
          >
            {Math.round(cardData.progressPercentage)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={cardData.progressPercentage}
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
    </Box>
  );
}
