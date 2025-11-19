import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CustomButton from "../../../components/CustomButton/CustomButton";

export default function TaskCard({
  task,
  status,
  isProvider,
  onDragStart,
  onMenuOpen,
  onReviewClick,
  onViewReview,
}) {
  const getProgressColor = (percentage) => {
    if (percentage === 100) return "#059669";
    if (percentage >= 75) return "#0284C7";
    if (percentage >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const handleFileClick = () => {
    if (task.uploadFile) {
      // إذا كان File object
      if (task.uploadFile instanceof File) {
        const url = URL.createObjectURL(task.uploadFile);
        window.open(url, "_blank");
      }
      // إذا كان رابط من الـ API
      else if (typeof task.uploadFile === "string") {
        const fileUrl = task.uploadFile.startsWith("http")
          ? task.uploadFile
          : `https://uni.runasp.net/${task.uploadFile}`;
        window.open(fileUrl, "_blank");
      }
    }
  };

  // Show review button only for clients (non-providers) in InReview status
  const showReviewButton = !isProvider && status === 'InReview';

  console.log("Rendering TaskCard for task:", task);

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
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: "10px", color: "#6B7280", mt: 0.5 }}>
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
                    backgroundColor: "#3B82F6",
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

            {/* View Review Button - Show for providers when task has been reviewed */}
            {isProvider && task.lastClientDecision && (status === 'InProgress' || status === 'Done') && (
              <Button
                fullWidth
                size="small"
                startIcon={task.lastClientDecision === 'Accepted' ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
                onClick={() => onViewReview && onViewReview(task)}
                sx={{
                  textTransform: "none",
                  fontSize: "12px",
                  mt: 1,
                  py: 0.75,
                  color: task.lastClientDecision === 'Accepted' ? '#059669' : '#DC2626',
                  borderColor: task.lastClientDecision === 'Accepted' ? '#059669' : '#DC2626',
                  backgroundColor: task.lastClientDecision === 'Accepted' ? '#ECFDF5' : '#FEE2E2',
                  '&:hover': {
                    backgroundColor: task.lastClientDecision === 'Accepted' ? '#D1FAE5' : '#FEE2E2',
                  },
                }}
              >
                View Client Review
              </Button>
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