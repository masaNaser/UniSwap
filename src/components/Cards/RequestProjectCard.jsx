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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  approveCollaborationRequest,
  rejectCollaborationRequest,
  cancelCollaborationRequest,
} from "../../services/collaborationService";
import { getImageUrl } from "../../utils/imageHelper";

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
  isProvider,
  onRequestHandled,
  onEditRequest,
  sentDate,
}) {
  const [loading, setLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const token = localStorage.getItem("accessToken");
  console.log("clientImage:", clientImage);

  const isLongDescription = description && description.length > 100;
  const displayedDescription = showFullDescription
    ? description
    : isLongDescription
      ? description.substring(0, 100) + "..."
      : description;

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openConfirmDialog = (type) => {
    const dialogConfig = {
      cancel: {
        title: "Cancel Request",
        message:
          "Are you sure you want to cancel this request? This action cannot be undone.",
      },
      reject: {
        title: "Reject Request",
        message: `Are you sure you want to reject this request from ${clientName}?`,
      },
      approve: {
        title: "Approve Request",
        message: `Are you sure you want to approve this request from ${clientName}?`,
      },
    };

    setConfirmDialog({
      open: true,
      type,
      ...dialogConfig[type],
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleConfirmAction = async () => {
    closeConfirmDialog();

    try {
      setLoading(true);

      switch (confirmDialog.type) {
        case "approve":
          await approveCollaborationRequest(token, id);
          setSnackbar({
            open: true,
            message: "Request approved successfully! ✅",
            severity: "success",
          });
          break;

        case "reject":
          await rejectCollaborationRequest(token, id);
          setSnackbar({
            open: true,
            message: "Request rejected ❌",
            severity: "info",
          });
          break;

        case "cancel":
          await cancelCollaborationRequest(token, id);
          setSnackbar({
            open: true,
            message: "Request cancelled successfully ❌",
            severity: "info",
          });
          break;

        default:
          break;
      }

      onRequestHandled?.();
    } catch (error) {
      console.error(`Error ${confirmDialog.type}ing request:`, error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          `Failed to ${confirmDialog.type} request`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    const requestData = {
      id,
      title,
      description,
      pointsOffered,
      deadline,
      category,
      type: category,
      providerName: clientName,
    };
    console.log("🔵 Sending to edit modal:", requestData);
    onEditRequest?.(requestData);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          width: "320px",
          height: "380px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #F3F4F6",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
          },
          bgcolor: "#FFFFFF",
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
              label="Pending"
              size="small"
              sx={{
                bgcolor: "#FEF3C7",
                color: "#F59E0B",
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

          {/* Description with Read More and Scroll */}
          <Box mb={1.5}>
            {!showFullDescription ? (
              <Typography
                variant="body2"
                color="#6B7280"
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
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Show less" : "Read more"}
              </Typography>
            )}
          </Box>

          {/* Client/Provider Info */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Avatar
              src={getImageUrl(clientImage, clientName)}
              sx={{
                width: 42,
                height: 42,
                bgcolor: "#3B82F6",
                fontWeight: "bold",
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              {!clientImage && clientInitials}
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
                {clientName || "Unknown"}
              </Typography>
              <Typography
                variant="caption"
                color="#6B7280"
                fontSize="12px"
                fontWeight="400"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {isProvider
                  ? `Requesting ${category?.replace("Request", "")}`
                  : `Providing ${category?.replace("Request", "")}`}

                {sentDate && (
                  <Typography
                    variant="caption"
                    color="#6B7280"
                    fontSize="12px"
                    fontWeight="400"
                    sx={{ display: "block", mt: 0.3 }}
                  >
                    Sent: {sentDate}
                  </Typography>
                )}

              </Typography>
            </Box>
          </Box>

          {/* Points & Deadline */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
            pb={1.5}
            borderBottom="1px solid #F3F4F6"
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#3B82F6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255, 255, 255, 1)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="8" r="6"></circle>
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                  <path d="M7 6h1v4"></path>
                  <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                </svg>
              </Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="#F59E0B"
                fontSize="13px"
              >
                {pointsOffered} Points
              </Typography>
            </Box>
            {deadline &&
              !category?.toLowerCase().includes("request") &&
              new Date(deadline).getFullYear() > 1970 && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CalendarMonthIcon sx={{ fontSize: 17, color: "#9CA3AF" }} />
                  <Typography
                    variant="caption"
                    color="#6B7280"
                    fontSize="12px"
                    fontWeight="500"
                  >
                    Due: {deadline}
                  </Typography>
                </Box>
              )}
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
                onClick={() => openConfirmDialog("approve")}
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
                onClick={() => openConfirmDialog("reject")}
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
                  onClick={() => openConfirmDialog("cancel")}
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
                <Typography
                  variant="body2"
                  color="#3B82F6"
                  fontWeight="500"
                  fontSize="12px"
                >
                  Waiting for {clientName} to respond
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#F59E0B" }} />
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeConfirmDialog}
            sx={{
              color: "#6B7280",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              bgcolor: confirmDialog.type === "approve" ? "#3B82F6" : "#EF4444",
              textTransform: "none",
              "&:hover": {
                bgcolor:
                  confirmDialog.type === "approve" ? "#2563EB" : "#DC2626",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            bgcolor:
              snackbar.severity === "success"
                ? "#3b82f6"
                : snackbar.severity === "info"
                  ? "#3b82f6"
                  : "#EF4444",
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