// import React from "react";
// import {
//   Card,
//   CardContent,
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Chip,
// } from "@mui/material";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import RateReviewIcon from "@mui/icons-material/RateReview";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CustomButton from "../../../components/CustomButton/CustomButton";
// import { formatDateTime } from "../../../utils/timeHelper";
// import { useTheme } from "@mui/material/styles";

// export default function TaskCard({
//   task,
//   status,
//   isProvider,
//   onDragStart,
//   onMenuOpen,
//   onReviewClick,
//   onViewReview,
// }) {
//   const theme = useTheme();


//   const handleFileClick = () => {
//     if (task.uploadFile) {
//       if (task.uploadFile instanceof File) {
//         const url = URL.createObjectURL(task.uploadFile);
//         window.open(url, "_blank");
//       } else if (typeof task.uploadFile === "string") {
//         const fileUrl = task.uploadFile.startsWith("http")
//           ? task.uploadFile
//           : `https://uni1swap.runasp.net/${task.uploadFile}`;
//         window.open(fileUrl, "_blank");
//       }
//     }
//   };

// const lastDecision = task.lastClientDecision
//   ? String(task.lastClientDecision).toLowerCase()
//   : null;

// const hasNotBeenReviewed = !lastDecision || lastDecision === "pending";
// const showReviewButton =
//   !isProvider && status === "InReview" && hasNotBeenReviewed;

// const isRejected = lastDecision === "rejected";
// const showViewReviewButton = isProvider && isRejected;


//   const handleViewReviewClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onViewReview) {
//       onViewReview(task);
//     }
//   };

//   return (
//     <Card
//       draggable={isProvider}
//       onDragStart={onDragStart}
//       sx={{
//         cursor: isProvider ? "grab" : "default",
//         transition: "all 0.2s ease",
//         // backgroundColor: "#FFFFFF",
//         backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#FFFFFF",
//         border: "1px solid #E5E7EB",
//         position: "relative",
//         "&:hover": {
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           transform: isProvider ? "translateY(-2px)" : "none",
//         },
//         "&:active": {
//           cursor: isProvider ? "grabbing" : "default",
//         },
//       }}
//     >
//       <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
//         {isProvider && (
//           <IconButton
//             size="small"
//             onClick={onMenuOpen}
//             sx={{
//               position: "absolute",
//               top: 8,
//               right: 8,
//               zIndex: 1,
//             }}
//           >
//             <MoreVertIcon fontSize="small" />
//           </IconButton>
//         )}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             width: "100%",
//           }}
//         >
//           <Box sx={{ flex: 1 }}>
//             {isProvider && (
//               <DragIndicatorIcon
//                 sx={{
//                   fontSize: 18,
//                   color: "#D1D5DB",
//                   mb: 0.5,
//                   display: "inline-block",
//                   mr: 0.5,
//                 }}
//               />
//             )}
//             <Typography
//               fontWeight="bold"
//               variant="body2"
//               sx={{ mb: 0.5, lineHeight: 1.3 }}
//             >
//               {task.title}
//             </Typography>

//             {task.description && (
//               <Box
//                 sx={{
//                   maxHeight: 60,
//                   overflowY: "auto",
//                   overflowX: "hidden",
//                   pr: 0.5,
//                   mb: 1,
//                   "&::-webkit-scrollbar": {
//                     width: "4px",
//                   },
//                   "&::-webkit-scrollbar-track": {
//                     background: "#F3F4F6",
//                     borderRadius: "4px",
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     background: "#D1D5DB",
//                     borderRadius: "4px",
//                     "&:hover": {
//                       background: "#9CA3AF",
//                     },
//                   },
//                 }}
//               >
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   sx={{
//                     wordBreak: "break-word",
//                     fontSize: "14px",
//                     lineHeight: 1.4,
//                   }}
//                 >
//                   {task.description}
//                 </Typography>
//               </Box>
//             )}

//             {/* File Attachment */}
//             {task.uploadFile && (
//               <Box>
//                 <Button
//                   size="small"
//                   startIcon={<AttachFileIcon />}
//                   onClick={handleFileClick}
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "11px",
//                     mb: 1,
//                     color: "#0284C7",
//                     "&:hover": {
//                       backgroundColor: "#F0F9FF",
//                     },
//                   }}
//                 >
//                   View Attachment
//                 </Button>
//               </Box>
//             )}

//             {/* Progress Bar */}
//             <Box sx={{ mb: 1, mt: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   mb: 0.5,
//                 }}
//               >
//                 <Typography
//                   variant="caption"
//                   sx={{ fontSize: "10px", color: "#6B7280", mt: 0.5 }}
//                 >
//                   Progress
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     fontSize: "10px",
//                     color: "#9CA3AF",
//                     mt: 0.5,
//                     display: "block",
//                   }}
//                 >
//                   {task.progressPercentage}%
//                 </Typography>
//               </Box>
//               <Box
//                 sx={{
//                   height: 4,
//                   backgroundColor: "#E5E7EB",
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     height: "100%",
//                     width: `${task.progressPercentage}%`,
//                     background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
//                     transition: "width 0.3s ease",
//                   }}
//                 />
//               </Box>
//             </Box>

//             {/* Review Button for Clients */}
//             {showReviewButton && (
//               <CustomButton
//                 fullWidth
//                 size="small"
//                 startIcon={<RateReviewIcon />}
//                 onClick={() => onReviewClick(task)}
//                 sx={{
//                   textTransform: "none",
//                   fontSize: "12px",
//                   mt: 1,
//                   py: 0.75,
//                 }}
//               >
//                 Click for Review
//               </CustomButton>
//             )}

//             {/* ✅ Review Due Date Display (for InReview tasks) */}
//             {status === "InReview" && task.reviewDueAt && (
//               <Box sx={{ mb: 1, mt: 2 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center", // يضمن محاذاة الأيقونة والنص
//                     gap: 0.5,
//                     justifyContent: "center",
//                   }}
//                 >
//                   <AccessTimeIcon
//                     sx={{
//                       fontSize: 14,
//                       color: "#6B7280",
//                       verticalAlign: "middle", // هذا مهم لتصحيح المحاذاة
//                     }}
//                   />
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       fontSize: "11px",
//                       color: "#6B7280",
//                       fontWeight: 500,
//                       lineHeight: "14px", // نفس حجم الأيقونة
//                       display: "inline-flex",
//                       alignItems: "center",
//                       mt: 1,
//                     }}
//                   >
//                     Review Due: {formatDateTime(task.reviewDueAt)}
//                   </Typography>
//                 </Box>
//               </Box>
//             )}

//             {/* View Review Button */}
//             {showViewReviewButton && (
//               <Box sx={{ mt: 1 }}>
//                 <Button
//                   fullWidth
//                   size="small"
//                   startIcon={<ErrorOutlineIcon />}
//                   onClick={handleViewReviewClick}
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "12px",
//                     py: 0.75,
//                     color: "#DC2626",
//                     border: "1px solid #DC2626",
//                     backgroundColor: "#FEE2E2",
//                     "&:hover": {
//                       backgroundColor: "#FCD5D5",
//                       borderColor: "#B91C1C",
//                     },
//                   }}
//                 >
//                   View Client Review
//                 </Button>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     color: "#DC2626",
//                     fontSize: "10px",
//                     mt: 0.5,
//                     textAlign: "center",
//                     display: "block",
//                   }}
//                 >
//                   Drag this task to In Progress
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { formatDateTime } from "../../../utils/timeHelper";
import { renderContentWithLinks } from "../../../utils/textHelper";
import { useTheme } from "@mui/material/styles";

// ✅ استيراد الـ BASE_URL من environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://uni1swap.runasp.net/api";
const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || "https://uni1swap.runasp.net";

export default function TaskCard({
  task,
  status,
  isProvider,
  onDragStart,
  onMenuOpen,
  onReviewClick,
  onViewReview,
}) {
  const theme = useTheme();

  const handleFileClick = () => {
    if (!task.uploadFile) return;

    try {
      let fileUrl;

      if (task.uploadFile instanceof File) {
        fileUrl = URL.createObjectURL(task.uploadFile);
      } else if (typeof task.uploadFile === "string") {
        if (task.uploadFile.startsWith("http")) {
          fileUrl = task.uploadFile;
        } else {
          const baseUrl = FILE_BASE_URL.replace(/\/$/, '');
          const filePath = task.uploadFile.replace(/^\/+/, '');
          fileUrl = `${baseUrl}/${filePath}`;
        }
        console.log('Opening file URL:', fileUrl);
      }

      if (fileUrl) {
        window.open(fileUrl, "_blank");
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  // ✅ تحسين منطق التحقق من Decision
  const lastDecision = task.lastClientDecision
    ? String(task.lastClientDecision).toLowerCase()
    : null;

  const hasNotBeenReviewed = !lastDecision || lastDecision === "pending";
  const showReviewButton = !isProvider && status === "InReview" && hasNotBeenReviewed;

  const isRejected = lastDecision === "rejected";
  const showViewReviewButton = isProvider && isRejected;

  const handleViewReviewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewReview) {
      onViewReview(task);
    }
  };

  return (
    <Card
      draggable={isProvider}
      onDragStart={onDragStart}
      sx={{
        cursor: isProvider ? "grab" : "default",
        transition: "all 0.2s ease",
        backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#FFFFFF",
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
        {/* Menu Button for Provider */}
        {isProvider && (
          <IconButton
            size="small"
            onClick={onMenuOpen}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box sx={{ flex: 1 }}>
            {/* Drag Indicator */}
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

            {/* Task Title */}
            <Typography
              fontWeight="bold"
              variant="body2"
              sx={{ mb: 0.5, lineHeight: 1.3 }}
            >
              {task.title}
            </Typography>

            {/* Task Description */}
            {task.description && (
              <Box
                sx={{
                  maxHeight: 60,
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 0.5,
                  mb: 1,
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
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    wordBreak: "break-word",
                    fontSize: "14px",
                    lineHeight: 1.4,
                  }}
                >
                  {renderContentWithLinks(task.description)}
                </Typography>
              </Box>
            )}

            {/* File Attachment */}
            {task.uploadFile && (
              <Box>
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
              </Box>
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
                  {task.progressPercentage || 0}%
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
                    width: `${task.progressPercentage || 0}%`,
                    background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
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

            {/* Review Due Date Display */}
            {status === "InReview" && task.reviewDueAt && (
              <Box sx={{ mb: 1, mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    justifyContent: "center",
                  }}
                >
                  <AccessTimeIcon
                    sx={{
                      fontSize: 14,
                      color: "#6B7280",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "11px",
                      color: "#6B7280",
                      fontWeight: 500,
                      lineHeight: "14px",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    Review Due: {formatDateTime(task.reviewDueAt)}
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
        </Box>
      </CardContent>
    </Card>
  );
}