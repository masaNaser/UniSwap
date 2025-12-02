import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { formatTime } from "../../../utils/timeHelper";

export default function TaskCard({
  task,
  status,
  isProvider,
  onDragStart,
  onMenuOpen,
  onReviewClick,
  onViewReview,
}) {

  // ✅ Check if review due date has passed (for RequestProject)
  const isReviewOverdue = () => {
    if (!task.reviewDueAt || status !== "InReview") return false;

    const now = new Date();
    const reviewDue = new Date(task.reviewDueAt);

    return reviewDue < now;
  };

  const handleFileClick = () => {
    if (task.uploadFile) {
      if (task.uploadFile instanceof File) {
        const url = URL.createObjectURL(task.uploadFile);
        window.open(url, "_blank");
      } else if (typeof task.uploadFile === "string") {
        const fileUrl = task.uploadFile.startsWith("http")
          ? task.uploadFile
          : `https://uni.runasp.net/${task.uploadFile}`;
        window.open(fileUrl, "_blank");
      }
    }
  };

  const hasNotBeenReviewed =
    !task.lastClientDecision ||
    task.lastClientDecision.toLowerCase() === "pending";
  const showReviewButton =
    !isProvider && status === "InReview" && hasNotBeenReviewed;

  const isRejected = task.lastClientDecision?.toLowerCase() === "rejected";
  const showViewReviewButton = isProvider && isRejected;

  const handleViewReviewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewReview) {
      onViewReview(task);
    }
  };

  const reviewIsOverdue = isReviewOverdue();

  return (
    <Card
      draggable={isProvider}
      onDragStart={onDragStart}
      sx={{
        cursor: isProvider ? "grab" : "default",
        transition: "all 0.2s ease",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        position: "relative",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: isProvider ? "translateY(-2px)" : "none",
        },
        "&:active": {
          cursor: isProvider ? "grabbing" : "default",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            {isProvider && (
              <DragIndicatorIcon
                sx={{
                  fontSize: 18,
                  color: "#D1D5DB",
                  mb: 0.5,
                  display: "inline-block",
                  mr: 0.5,
                }}
              />
            )}
            <Typography
              fontWeight="bold"
              variant="body2"
              sx={{ mb: 0.5, lineHeight: 1.3 }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                {task.description}
              </Typography>
            )}

            {/* File Attachment */}
            {task.uploadFile && (
              <Button
                size="small"
                startIcon={<AttachFileIcon />}
                onClick={handleFileClick}
                sx={{
                  textTransform: "none",
                  fontSize: "11px",
                  mb: 1,
                  color: "#0284C7",
                  "&:hover": {
                    backgroundColor: "#F0F9FF",
                  },
                }}
              >
                View Attachment
              </Button>
            )}

            {/* Progress Bar */}
            <Box sx={{ mb: 1, mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontSize: "10px", color: "#6B7280", mt: 0.5 }}
                >
                  Progress
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "10px",
                    color: "#9CA3AF",
                    mt: 0.5,
                    display: "block",
                  }}
                >
                  {task.progressPercentage}%
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 4,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${task.progressPercentage}%`,
                    background: 'linear-gradient(to right, #00C8FF, #8B5FF6)',
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>

            {/* Review Button for Clients */}
            {showReviewButton && (
              <CustomButton
                fullWidth
                size="small"
                startIcon={<RateReviewIcon />}
                onClick={() => onReviewClick(task)}
                sx={{
                  textTransform: "none",
                  fontSize: "12px",
                  mt: 1,
                  py: 0.75,
                }}
              >
                Click for Review
              </CustomButton>
            )}

            {/* ✅ Review Due Date Display (for InReview tasks) */}
            {status === "InReview" && task.reviewDueAt && (
              <Box sx={{ mb: 1, mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <AccessTimeIcon
                    sx={{
                      fontSize: 14,
                      color: reviewIsOverdue ? "#DC2626" : "#6B7280",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "11px",
                      color: reviewIsOverdue ? "#DC2626" : "#6B7280",
                      fontWeight: 500,
                    }}
                  >
                    Review Due: {formatTime(task.reviewDueAt)}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* View Review Button */}
            {showViewReviewButton && (
              <Box sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  size="small"
                  startIcon={<ErrorOutlineIcon />}
                  onClick={handleViewReviewClick}
                  sx={{
                    textTransform: "none",
                    fontSize: "12px",
                    py: 0.75,
                    color: "#DC2626",
                    border: "1px solid #DC2626",
                    backgroundColor: "#FEE2E2",
                    "&:hover": {
                      backgroundColor: "#FCD5D5",
                      borderColor: "#B91C1C",
                    },
                  }}
                >
                  View Client Review
                </Button>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#DC2626",
                    fontSize: "10px",
                    mt: 0.5,
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Drag this task to In Progress
                </Typography>
              </Box>
            )}
          </Box>
          {isProvider && (
            <IconButton
              size="small"
              onClick={onMenuOpen}
              sx={{ mt: -1, mr: -1 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}