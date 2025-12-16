import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PublishIcon from "@mui/icons-material/Publish";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../../utils/imageHelper";
import CustomButton from "../../../components/CustomButton/CustomButton";
import ProgressSection from "./ProgressSection";
import ProjectCloseReviewDialog from "./ProjectCloseReviewDialog";
import ViewProjectReviewDialog from "./ViewProjectReviewDialog";
import OverdueDecisionDialog from "./OverdueDecisionDialog";
import PublishProjectModal from "../../../components/Modals/PublishProjectModal";
import { editCollaborationRequest } from "../../../services/collaborationService";
import {
  closeProjectByProvider,
  closeProjectByClient,
  handleOverdueDecision,
} from "../../../services/taskService";
import { getReviewByProject } from "../../../services/reviewService";
import { formatDateTime } from "../../../utils/timeHelper";

import { useCurrentUser } from "../../../Context/CurrentUserContext";

export default function TrackTasksHeader({
  cardData,
  projectDetails,
  isProvider,
  progressPercentage,
  onBack,
  onDeadlineUpdate,
  onProjectClosed,
}) {
  const { updateCurrentUser, startTemporaryPolling } = useCurrentUser();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (!cardData) return <div>Loading...</div>;

  const [isEditing, setIsEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openViewReviewDialog, setOpenViewReviewDialog] = useState(false);
  const [openOverdueDialog, setOpenOverdueDialog] = useState(false);
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [closingProject, setClosingProject] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const displayRole = isProvider ? "Client" : "Service Provider";

  const displayName = isProvider
    ? projectDetails?.clientName || cardData.clientName
    : projectDetails?.providerName || "Service Provider";

  const displayRoleWithName = `${displayRole} : ${displayName}`;

  const displayAvatar = isProvider
    ? projectDetails?.clientAvatar || cardData.clientAvatar
    : projectDetails?.providerAvatar;

  const displayInitials = isProvider
    ? projectDetails?.clientInitials ||
      cardData.clientInitials ||
      displayName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : displayName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

  const token = localStorage.getItem("accessToken");

  const isOverdue = cardData.projectStatus === "Overdue";

  const hasRejection =
    projectDetails?.rejectionReason && cardData.projectStatus === "Active";

  useEffect(() => {
    const fetchReview = async () => {
      if (!isProvider || !cardData.id) {
        console.log("⏭️ Skipping review fetch - not provider or no project ID");
        return;
      }

      console.log("🔍 Checking if should fetch review:", {
        projectStatus: cardData.projectStatus,
        isCompleted: cardData.projectStatus === "Completed",
        hasRejection: !!projectDetails?.rejectionReason,
      });

      if (cardData.projectStatus === "Completed") {
        try {
          console.log("📡 Fetching review for project:", cardData.id);
          const response = await getReviewByProject(cardData.id, token);
          console.log("✅ Review fetch response:", response.data);
          setReviewData(response.data);
        } catch (error) {
          console.error("❌ Error fetching review:", error);
          console.log("📋 Error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
          setReviewData(null);
        }
      }
    };

    fetchReview();
  }, [
    cardData.id,
    cardData.projectStatus,
    isProvider,
    token,
    projectDetails?.rejectionReason,
  ]);

  const canPublishProject = () => {
    if (!isProvider) return false;

    const isCompleted = cardData.projectStatus === "Completed";
    const isPublished = projectDetails?.isPublished || false;
    const clientAcceptedPublishing =
      projectDetails?.clientAcceptPublished || false;

    console.log("📢 Can publish check:", {
      isProvider,
      isCompleted,
      isPublished,
      clientAcceptedPublishing,
    });

    return isCompleted && !isPublished && clientAcceptedPublishing;
  };

  const handlePublishSuccess = (publishedData) => {
    console.log("✅ Project published:", publishedData);

    if (onProjectClosed) {
      onProjectClosed(true);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return minDate.toISOString().slice(0, 16);
  };

  const handleSaveDeadline = async () => {
    if (!newDeadline) {
      setSnackbar({
        open: true,
        message: "Please select a deadline.",
        severity: "error",
      });
      return;
    }

    const newDeadlineDateTime = new Date(newDeadline);
    const now = new Date();
    const minDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (newDeadlineDateTime <= minDeadline) {
      setSnackbar({
        open: true,
        message: "New deadline must be at least 24 hours from now.",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const collaborationId = projectDetails?.collaborationRequestId;

      if (!collaborationId) {
        throw new Error("Collaboration Request ID is missing.");
      }

      const deadlineISO = newDeadlineDateTime.toISOString();
      console.log("🔄 Updating deadline via API:", {
        collaborationId,
        deadlineISO,
      });
      await editCollaborationRequest(token, collaborationId, {
        deadline: deadlineISO,
      });

      console.log("✅ Deadline updated successfully");
      if (onDeadlineUpdate) {
        onDeadlineUpdate(deadlineISO);
      }

      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Deadline updated successfully! ⏰",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Error updating deadline:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update deadline.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    if (cardData.deadline) {
      const date = new Date(cardData.deadline);
      const localDateTime = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      setNewDeadline(localDateTime);
    } else {
      setNewDeadline("");
    }

    setIsEditing(true);
  };

  const canCloseProject = () => {
    const result = isProvider
      ? cardData.projectStatus === "Active" && progressPercentage === 100
      : cardData.projectStatus === "SubmittedForFinalReview";

    console.log("🔒 Can close project check:", {
      isProvider,
      projectStatus: cardData.projectStatus,
      progressPercentage,
      result,
    });

    return result;
  };

  const canViewReview = () => {
    if (!isProvider) return false;

    const isCompleted = cardData.projectStatus === "Completed";
    const isActive = cardData.projectStatus === "Active";
    const hasRejection = projectDetails?.rejectionReason;

    const result = isCompleted || (isActive && hasRejection);

    return result;
  };

  const canHandleOverdue = () => {
    return !isProvider && isOverdue;
  };

  const handleCloseProjectClick = () => {
    if (isProvider) {
      setOpenCloseDialog(true);
    } else {
      setOpenReviewDialog(true);
    }
  };

  const handleProviderSubmit = async () => {
    try {
      setClosingProject(true);
      await closeProjectByProvider(cardData.id, token);
      console.log("✅ Project submitted successfully");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSnackbar({
        open: true,
        message: "Project submitted for final review successfully! ✅",
        severity: "success",
      });
      setOpenCloseDialog(false);

      if (onProjectClosed) {
        console.log("🔄 Calling onProjectClosed callback");
        await onProjectClosed();
      }
    } catch (err) {
      console.error("❌ Error submitting project:", err);
      console.log("📋 Error details:", {
        status: err.response?.status,
        data: err.response?.data,
      });

      let errorMessage = "Failed to submit project.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setClosingProject(false);
    }
  };

  const handleClientReview = async (reviewData) => {
    try {
      setClosingProject(true);

      const closeRequestData = {
        isAccepted: reviewData.isAccepted,
        rejectionReason: reviewData.isAccepted
          ? undefined
          : reviewData.rejectionReason,
        rating: reviewData.isAccepted ? reviewData.rating : undefined,
        comment: reviewData.isAccepted ? reviewData.comment : undefined,
      };

      console.log("📤 Sending close request to backend:", closeRequestData);
      console.log(
        "🔗 API endpoint:",
        `/api/Projects/${cardData.id}/close-by-client`
      );

      await closeProjectByClient(cardData.id, token, closeRequestData);

      console.log("✅ Project review submitted successfully");

      // 🔥 فعّل الـ polling لمدة 10 ثواني
      startTemporaryPolling(2000);
      console.log("🚀 Polling started for points update");

      if (reviewData.isAccepted) {
        console.log("✅ Project accepted - rating and review saved");
        setSnackbar({
          open: true,
          message:
            "Project completed successfully! Rating and review submitted. Points transferred. ✅",
          severity: "success",
        });
      } else {
        console.log("❌ Project rejected - returned to Active");
        setSnackbar({
          open: true,
          message: "Project rejected and returned to Active status for rework.",
          severity: "info",
        });
      }

      setOpenReviewDialog(false);

      if (onProjectClosed) {
        console.log("🔄 Calling onProjectClosed callback");
        await onProjectClosed();
      }
    } catch (err) {
      console.error("❌ Error reviewing project:", err);
      console.log("📋 Full error object:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      let errorMessage = "Failed to review project.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.message) {
        errorMessage = err.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setClosingProject(false);
    }
  };

  const handleOverdueSubmit = async (decisionData) => {
    try {
      console.log("📤 Submitting overdue decision:", decisionData);

      const response = await handleOverdueDecision(
        cardData.id,
        token,
        decisionData
      );

      console.log("✅ Overdue decision submitted successfully");
      console.log("📊 Server response:", response.data);
     // 🔥 إذا كان cancel (reject extend) - فعّل الـ polling
    if (!decisionData.acceptExtend) {
      startTemporaryPolling(2000);
      console.log("🚀 Polling started for points refund");

      // رسالة النجاح تختلف حسب القرار المتخذ
      const successMessage = decisionData.acceptExtend
        ? "Project deadline extended successfully! The project is now Active. ⏰"
        : "Project cancelled successfully! Points have been refunded to your account. 💰";

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      setOpenOverdueDialog(false);

      if (onProjectClosed) {
        console.log("🔄 Calling onProjectClosed callback");
        await onProjectClosed();
      }
    }} catch (err) {
      console.error("❌ Error handling overdue decision:", err);
      console.log("📋 Error details:", {
        status: err.response?.status,
        data: err.response?.data,
      });

      let errorMessage = "Failed to process your request.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  }


  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleViewReview = () => {
    setOpenViewReviewDialog(true);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        borderRadius: { xs: 2, sm: 3 },
        mb: 3,
        p: { xs: 2, sm: 3 },
        pb: 0,
        border:
          isOverdue || hasRejection ? "2px solid #DC2626" : "1px solid #E5E7EB",
        position: "relative",
      }}
    >
      {/* EDIT BUTTON (CLIENT ONLY) */}
      {!isProvider && cardData.projectStatus === "Active" && !isOverdue && (
        <IconButton
          onClick={handleOpenEdit}
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 16 },
            right: { xs: 8, sm: 16 },
            zIndex: 10,
          }}
        >
          <EditIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      )}

      {/* EDIT DEADLINE POPUP */}
      {isEditing && !isProvider && (
        <Box
          sx={{
            position: { xs: "fixed", sm: "absolute" },
            top: { xs: "50%", sm: 10 },
            left: { xs: "50%", sm: "auto" },
            right: { xs: "auto", sm: 10 },
            transform: { xs: "translate(-50%, -50%)", sm: "none" },
            bgcolor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            zIndex: 1300,
            width: { xs: "90%", sm: 260 },
            maxWidth: { xs: "400px", sm: "260px" },
            boxShadow: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Edit Deadline
            </Typography>
            <IconButton size="small" onClick={() => setIsEditing(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            label="New Deadline"
            type="datetime-local"
            fullWidth
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getMinDateTime() }}
            size={isMobile ? "small" : "medium"}
            helperText="Must be at least 24 hours from now"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3B82F6",
                },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveDeadline}
            disabled={loading}
            sx={{
              background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              "&:hover": {
                background: "linear-gradient(to right, #8B5FF6, #00C8FF)",
              },
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}

      {/* Back Button + Action Buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: { xs: 1.5, sm: 1 },
        }}
      >
        <IconButton
          onClick={onBack}
          sx={{
            color: "#6B7280",
            p: 1,
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {canPublishProject() && (
            <CustomButton
              startIcon={<PublishIcon />}
              onClick={() => setOpenPublishModal(true)}
              sx={{
                textTransform: "none",
                fontSize: { xs: "11px", sm: "14px" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 2 },
                whiteSpace: "nowrap",
                background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
              }}
            >
              {isMobile ? "Publish" : "Publish Project"}
            </CustomButton>
          )}

          {canHandleOverdue() && (
            <CustomButton
              startIcon={
                <WarningAmberIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              }
              onClick={() => setOpenOverdueDialog(true)}
              sx={{
                textTransform: "none",
                fontSize: { xs: "11px", sm: "14px" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 2 },
                background: "linear-gradient(to right, #DC2626, #EF4444)",
                whiteSpace: "nowrap",
              }}
            >
              {isMobile ? "Handle" : "Handle Overdue"}
            </CustomButton>
          )}

          {canViewReview() && (
            <CustomButton
              startIcon={
                <RateReviewIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              }
              onClick={handleViewReview}
              sx={{
                textTransform: "none",
                fontSize: { xs: "11px", sm: "14px" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 2 },
                background:
                  cardData.projectStatus === "Completed"
                    ? "linear-gradient(to right, #00C8FF, #8B5FF6)"
                    : "linear-gradient(to right, #DC2626, #EF4444)",
                whiteSpace: "nowrap",
              }}
            >
              {isMobile ? "Review" : "View Client Review"}
            </CustomButton>
          )}

          {canCloseProject() && (
            <CustomButton
              startIcon={
                <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              }
              onClick={handleCloseProjectClick}
              sx={{
                textTransform: "none",
                fontSize: { xs: "11px", sm: "14px" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1, sm: 2 },
                whiteSpace: "nowrap",
              }}
            >
              {isMobile
                ? isProvider
                  ? "Submit"
                  : "Review"
                : isProvider
                ? "Submit Final Work"
                : "Review & Close Project"}
            </CustomButton>
          )}
        </Box>
      </Box>

      {/* Title and Progress Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 0 },
          mb: 2,
        }}
      >
        <Box flex={1} sx={{ pr: { xs: 0, md: "320px" } }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              pr: { xs: 0, md: 2 },
            }}
          >
            {cardData.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {cardData.description}
          </Typography>
        </Box>

        {/* Progress Section - Responsive positioning */}
        <Box
          sx={{
            position: { xs: "static", md: "absolute" },
            top: { md: 80 },
            right: {
              md:
                !isProvider && cardData.projectStatus === "Active" && !isOverdue
                  ? 56
                  : 16,
            },
            width: { xs: "100%", sm: "100%", md: "280px" },
          }}
        >
          <ProgressSection
            progressPercentage={progressPercentage}
            projectPoints={projectDetails?.points || 0}
          />
        </Box>
      </Box>

      {/* Client/Provider Info + Deadline + Status */}
      <Box
        display="flex"
        alignItems="center"
        gap={{ xs: 1.5, sm: 3 }}
        mb={1}
        sx={{ flexWrap: "wrap" }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            src={getImageUrl(displayAvatar, displayName)}
            sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}
          >
            {displayInitials}
          </Avatar>

          <Box>
            <Typography
              variant="body2"
              color={theme.palette.mode === "dark" ? "#fff" : "#334155"}
              fontWeight="600"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {isMobile ? displayName : displayRoleWithName}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarMonthIcon
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: isOverdue ? "#DC2626" : "text.secondary",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: "0.7rem", sm: "12px" },
              color: isOverdue ? "#DC2626" : "text.secondary",
              fontWeight: isOverdue ? 600 : 400,
            }}
          >
            {isOverdue ? "Was due: " : "Due: "}
            {formatDateTime(cardData.deadline)}
          </Typography>
        </Box>

        {cardData.projectStatus && (
          <Chip
            label={
              cardData.projectStatus === "SubmittedForFinalReview"
                ? "In Review"
                : cardData.projectStatus
            }
            size="small"
            sx={{
              fontWeight: "600",
              fontSize: { xs: "10px", sm: "12px" },
              height: { xs: "22px", sm: "26px" },
              px: { xs: 1, sm: 1.5 },
              borderRadius: "6px",
              backgroundColor: (() => {
                if (cardData.projectStatus === "Overdue") return "#FEE2E2";
                if (cardData.projectStatus === "Active") return "#D1FAE5";
                if (cardData.projectStatus === "Completed") return "#DBEAFE";
                if (cardData.projectStatus === "SubmittedForFinalReview")
                  return "#F3E8FF";
                if (cardData.projectStatus === "Cancelled") return "#F3F4F6";
                return "#EFF6FF";
              })(),
              color: (() => {
                if (cardData.projectStatus === "Overdue") return "#DC2626";
                if (cardData.projectStatus === "Active") return "#059669";
                if (cardData.projectStatus === "Completed") return "#0284C7";
                if (cardData.projectStatus === "SubmittedForFinalReview")
                  return "#A855F7";
                if (cardData.projectStatus === "Cancelled") return "#6B7280";
                return "#0284C7";
              })(),
            }}
          />
        )}
      </Box>

      {/* Project Overdue Warning Banner */}
      {isOverdue && (
        <Box
          sx={{
            bgcolor: "#FEE2E2",
            borderLeft: "4px solid #DC2626",
            borderRadius: 1,
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 1 },
            mt: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "flex-start",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <WarningAmberIcon
            sx={{
              color: "#DC2626",
              fontSize: { xs: 24, sm: 28 },
              mt: { xs: 0, sm: 0 },
            }}
          />
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="#DC2626"
              sx={{ mb: 0.5, fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
            >
              ⚠️ PROJECT OVERDUE
            </Typography>
            <Typography
              variant="body2"
              color="#991B1B"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              This project passed its deadline on{" "}
              {formatDateTime(cardData.deadline)}.
              {!isProvider &&
                " Please use the 'Handle Overdue' button above to extend the deadline or cancel the project."}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Rejection Reason Banner */}
      {hasRejection && (
        <Box
          sx={{
            bgcolor: "#FEF2F2",
            borderLeft: "4px solid #DC2626",
            borderRadius: 1,
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 1 },
            mt: { xs: 2, sm: 3 },
            display: "flex",
            alignItems: "flex-start",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <WarningAmberIcon
            sx={{
              color: "#DC2626",
              fontSize: { xs: 24, sm: 28 },
              mt: { xs: 0, sm: 0 },
            }}
          />
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="#DC2626"
              sx={{ mb: 0.5, fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
            >
              ⚠️ PROJECT REJECTED - REWORK REQUIRED
            </Typography>
            <Typography
              variant="body2"
              color="#991B1B"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <strong>Reason:</strong> {projectDetails.rejectionReason}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Provider Submit Dialog */}
      <Dialog
        open={openCloseDialog}
        onClose={() => !closingProject && setOpenCloseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: { xs: 0.5, sm: 1 },
            m: { xs: 2, sm: 3 },
            maxWidth: { xs: "calc(100% - 32px)", sm: "600px" },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            pb: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Submit Final Work
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
            Are you sure you want to submit this project for final review? All
            tasks must be completed before submission.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            onClick={() => setOpenCloseDialog(false)}
            disabled={closingProject}
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProviderSubmit}
            variant="contained"
            disabled={closingProject}
            sx={{
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
              "&:hover": {
                background: "linear-gradient(to right, #8B5FF6, #00C8FF)",
              },
            }}
          >
            {closingProject ? "Submitting..." : "Confirm Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Client Review Dialog */}
      <ProjectCloseReviewDialog
        open={openReviewDialog}
        onClose={() => !closingProject && setOpenReviewDialog(false)}
        projectTitle={cardData.title}
        projectDescription={cardData.description}
        onSubmitReview={handleClientReview}
      />

      <OverdueDecisionDialog
        open={openOverdueDialog}
        onClose={() => setOpenOverdueDialog(false)}
        projectTitle={cardData.title}
        projectDescription={cardData.description}
        currentDeadline={cardData.deadline}
        onSubmit={handleOverdueSubmit}
      />

      {/* View Project Review Dialog */}
      <ViewProjectReviewDialog
        open={openViewReviewDialog}
        onClose={() => setOpenViewReviewDialog(false)}
        projectData={cardData}
        projectDetails={projectDetails}
        reviewData={reviewData}
      />

      {/* Publish Project Modal */}
      <PublishProjectModal
        open={openPublishModal}
        onClose={() => setOpenPublishModal(false)}
        projectId={cardData.id}
        projectTitle={cardData.title}
        projectDescription={cardData.description}
        projectPoints={projectDetails?.points}
        onPublishSuccess={handlePublishSuccess}
      />

      {/* Snackbar */}
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
            fontSize: { xs: "0.875rem", sm: "1rem" },
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
    </Box>
  );
}
