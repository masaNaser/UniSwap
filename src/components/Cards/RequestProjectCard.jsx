// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   Chip,
//   Stack,
//   Button,
// } from "@mui/material";

// export default function RequestProjectCard({
//   status = "Pending Request",
//   title,
//   clientInitials,
//   userName,
//   offeredPoints,
//   sentDate,
//   description,
//   isProvider = true, // جديد: يخبرنا إذا كان المستخدم provider
// }) {
//   return (
//     <Card
//       sx={{
//         borderRadius: "16px",
//         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
//         width: 350,
//         height: 310,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
//           <Box
//             sx={{
//               width: 8,
//               height: 8,
//               borderRadius: "50%",
//               backgroundColor: "#FBBF24",
//             }}
//           />
//           <Chip
//             label={status}
//             size="small"
//             sx={{
//               backgroundColor: "#FEF3C7",
//               color: "#D97706",
//               fontWeight: 600,
//               fontSize: "0.75rem",
//               height: 24,
//               borderRadius: "8px",
//               px: 1,
//             }}
//           />
//         </Stack>

//         <Typography
//           variant="h6"
//           component="div"
//           sx={{ fontWeight: 700, mb: 2, color: "#1F2937" }}
//         >
//           {title}
//         </Typography>

//         <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
//           <Avatar
//             sx={{
//               width: 48,
//               height: 48,
//               bgcolor: "#4299e1",
//               fontSize: "1rem",
//               fontWeight: 600,
//             }}
//           >
//             {clientInitials}
//           </Avatar>
//           <Box>
//             <Typography variant="body1" sx={{ fontWeight: 600 }}>
//               {userName}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Offered: {offeredPoints}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Sent: {sentDate}
//             </Typography>
//           </Box>
//         </Stack>

//         <Typography
//           variant="body2"
//           sx={{
//             color: "#4B5563",
//             mb: 2,
//             display: "-webkit-box",
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//           }}
//         >
//           {description}
//         </Typography>

//         <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: "auto" }}>
//           <Button
//             variant="outlined"
//             sx={{
//               borderColor: "#D1D5DB",
//               color: "#4B5563",
//               textTransform: "none",
//               borderRadius: "8px",
//               fontWeight: 600,
//               flexGrow: 1,
//             }}
//           >
//             View
//           </Button>

//           {isProvider && (
//             <>
//               <Button
//                 variant="outlined"
//                 sx={{
//                   borderColor: "#EF4444",
//                   color: "#EF4444",
//                   textTransform: "none",
//                   borderRadius: "8px",
//                   fontWeight: 600,
//                   flexGrow: 1,
//                 }}
//               >
//                 Reject
//               </Button>
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "#1976D2",
//                   "&:hover": {
//                     backgroundColor: "#1565C0",
//                   },
//                   color: "white",
//                   textTransform: "none",
//                   borderRadius: "8px",
//                   fontWeight: 600,
//                   boxShadow: "none",
//                   flexGrow: 1,
//                 }}
//               >
//                 Approve
//               </Button>
//             </>
//           )}
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }


import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Point from "../../assets/images/Point.svg";
import {
  approveCollaborationRequest,
  rejectCollaborationRequest,
} from "../../services/collaborationService";

export default function RequestProjectCard({
  id,
  title,
  description,
  clientName,
  clientInitials,
  clientImage,
  pointsOffered,
  deadline,
  category,
  isProvider, // true إذا أنا Provider و بستقبل Request
  onRequestHandled, // callback لما يقبل/يرفض
}) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveCollaborationRequest(token, id);
      alert("Request approved successfully! ✅");
      onRequestHandled?.(); // refresh الـ list
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await rejectCollaborationRequest(token, id);
      alert("Request rejected ❌");
      onRequestHandled?.();
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        {/* Header: Client Info */}
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Avatar
            src={clientImage}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#3b82f6",
              fontWeight: "bold",
            }}
          >
            {clientInitials}
          </Avatar>
          <Box flex={1}>
            <Typography variant="body2" fontWeight="bold">
              {clientName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Requesting {category}
            </Typography>
          </Box>
          <Chip
            label="Pending"
            size="small"
            sx={{
              bgcolor: "#FEF3C7",
              color: "#F59E0B",
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </Typography>

        {/* Points & Deadline */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <img src={Point} alt="points" style={{ width: 20, height: 20 }} />
            <Typography variant="body2" fontWeight="bold" color="#F59E0B">
              {pointsOffered} Points
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarMonthIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {deadline}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        {isProvider && (
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
              disabled={loading}
              onClick={handleApprove}
              sx={{
                bgcolor: "#10B981",
                "&:hover": { bgcolor: "#059669" },
              }}
            >
              Accept
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CancelIcon />}
              disabled={loading}
              onClick={handleReject}
              sx={{
                color: "#EF4444",
                borderColor: "#EF4444",
                "&:hover": {
                  bgcolor: "#FEE2E2",
                  borderColor: "#DC2626",
                },
              }}
            >
              Reject
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}