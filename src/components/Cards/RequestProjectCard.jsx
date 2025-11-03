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
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Point from "../../assets/images/Point.svg";
import {
  approveCollaborationRequest,
  rejectCollaborationRequest,
  cancelCollaborationRequest,
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
  isProvider, // true = Provider view (can Accept/Reject), false = Client view (can Edit/Cancel)
  onRequestHandled, // callback when Accept/Reject/Cancel happens
  onEditRequest, // callback when Edit is clicked
  sentDate, // جديد: تاريخ إرسال الطلب
}) {
  const [loading, setLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const token = localStorage.getItem("accessToken");

  // تحديد إذا كان الوصف طويل (أكثر من 100 حرف)
  const isLongDescription = description && description.length > 50;
  const displayedDescription = showFullDescription 
    ? description 
    : isLongDescription 
      ? description.substring(0, 50) + "..." 
      : description;

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveCollaborationRequest(token, id);
      alert("Request approved successfully! ✅");
      onRequestHandled?.();
    } catch (error) {
      console.error("Error approving request:", error);
      alert(error.response?.data?.message || "Failed to approve request");
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
      alert(error.response?.data?.message || "Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    try {
      setLoading(true);
      await cancelCollaborationRequest(token, id);
      alert("Request cancelled successfully ❌");
      onRequestHandled?.();
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert(error.response?.data?.message || "Failed to cancel request");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Pass the request data to parent component to open edit modal
    const requestData = {
      id,
      title,
      description,
      pointsOffered,
      deadline,
      category, // ⚠️ هذا هو الـ category الأصلي
      type: category, // إضافة type أيضاً للتأكد
      providerName: clientName,
    };
    console.log("🔵 Sending to edit modal:", requestData);
    onEditRequest?.(requestData);
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        width: "350px",
        height: "350px",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent sx={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        p: 2.5,
        "&:last-child": { pb: 2.5 }
      }}>
        {/* Header: Client/Provider Info */}
        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
          <Avatar
            src={clientImage}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#3b82f6",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {clientInitials}
          </Avatar>
          <Box flex={1}>
            <Typography variant="body2" fontWeight="bold" fontSize="14px">
              {clientName}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize="11px">
              {isProvider
                ? `Requesting ${category?.replace("Request", "")}`
                : `Providing ${category?.replace("Request", "")}`}
            </Typography>
            {/* تاريخ الارسال */}
            {sentDate && (
              <Typography variant="caption" color="text.secondary" fontSize="10px" display="block">
                Sent: {sentDate}
              </Typography>
            )}
          </Box>
          <Chip
            label="Pending"
            size="small"
            sx={{
              bgcolor: "#FEF3C7",
              color: "#F59E0B",
              fontWeight: "bold",
              fontSize: "12px",
              height: "25px",
              width: "70px",
            }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" mb={1} fontSize="16px" lineHeight={1.3}>
          {title}
        </Typography>

        {/* Description with Read More */}
        <Box mb={1.5} flex={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontSize="13px"
            lineHeight={1.4}
            sx={{
              wordBreak: "break-word",
              overflowY: showFullDescription ? "auto" : "hidden", 
              maxHeight: showFullDescription ? 60 : "auto",
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
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Show less" : "Read more"}
            </Typography>
          )}
        </Box>

        {/* Points & Deadline */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <img src={Point} alt="points" style={{ width: 18, height: 18 }} />
            <Typography variant="body2" fontWeight="bold" color="#F59E0B" fontSize="13px">
              {pointsOffered} Points
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarMonthIcon sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" fontSize="12px">
              Due: {deadline}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons - For Provider (Accept/Reject) */}
        {isProvider && (
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CheckCircleIcon />
                )
              }
              disabled={loading}
              onClick={handleApprove}
              sx={{
                bgcolor: "#3B82F6",
                "&:hover": { bgcolor: "#2563EB" },
                textTransform: "none",
                fontSize: "13px",
                height: "36px",
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
                textTransform: "none",
                fontSize: "13px",
                height: "36px",
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

        {/* Action Buttons - For Client (Edit/Cancel) */}
        {!isProvider && (
          <>
            <Stack direction="row" spacing={1} mb={1.5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                disabled={loading}
                onClick={handleEdit}
                sx={{
                  bgcolor: "#3B82F6",
                  "&:hover": { bgcolor: "#2563EB" },
                  textTransform: "none",
                  fontSize: "13px",
                  height: "36px",
                }}
              >
                Edit
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CancelIcon />
                  )
                }
                disabled={loading}
                onClick={handleCancel}
                sx={{
                  color: "#EF4444",
                  borderColor: "#EF4444",
                  textTransform: "none",
                  fontSize: "13px",
                  height: "36px",
                  "&:hover": {
                    bgcolor: "#FEE2E2",
                    borderColor: "#DC2626",
                  },
                }}
              >
                Cancel
              </Button>
            </Stack>

            {/* Info for Client - they're waiting for response */}
            <Box
              sx={{
                bgcolor: "#EFF6FF",
                p: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,
              }}
            >
              <HourglassEmptyIcon sx={{ color: "#3B82F6", fontSize: 18 }} />
              <Typography variant="body2" color="#3B82F6" fontWeight="500" fontSize="12px">
                Waiting for {clientName} to respond
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}