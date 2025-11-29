import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useState, useEffect } from "react";
import { getImageUrl } from "../../../utils/imageHelper";
import CustomButton from "../../../components/CustomButton/CustomButton";
import ProgressSection from "./ProgressSection";
import ProjectCloseReviewDialog from "./ProjectCloseReviewDialog";
import ViewProjectReviewDialog from "./ViewProjectReviewDialog";
import { editCollaborationRequest } from "../../../services/collaborationService";
import {
  closeProjectByProvider,
  closeProjectByClient,
} from "../../../services/taskService";
import { getReviewByProject } from "../../../services/reviewService";

export default function TrackTasksHeader({
  cardData,
  projectDetails,
  isProvider,
  totalTasks,
  completedTasks,
  progressPercentage,
  onBack,
  onDeadlineUpdate,
  onProjectClosed,
}) {
  if (!cardData) return <div>Loading...</div>;

  const [isEditing, setIsEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState(() => {
    if (!cardData.deadline) return "";
    const d = new Date(cardData.deadline);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openViewReviewDialog, setOpenViewReviewDialog] = useState(false);
  const [closingProject, setClosingProject] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ FIXED: Display correct role and person info
  const displayRole = isProvider ? "Client" : "Service Provider";

  // ✅ FIXED: Get the correct name and avatar based on role
  // For PROVIDER: Show client info (from projectDetails for complete data) ✅
  // For CLIENT: Show provider info (from projectDetails) ✅
  const displayName = isProvider
    ? (projectDetails?.clientName || cardData.clientName)
    : (projectDetails?.providerName || "Service Provider");

  const displayRoleWithName = `${displayRole} : ${displayName}`;

  const displayAvatar = isProvider
    ? (projectDetails?.clientAvatar || cardData.clientAvatar)
    : projectDetails?.providerAvatar;

  const displayInitials = isProvider
    ? (projectDetails?.clientInitials || cardData.clientInitials || displayName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase())
    : displayName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const token = localStorage.getItem("accessToken");

  console.log("🏠 TrackTasksHeader - Component State:", {
    projectId: cardData.id,
    projectStatus: cardData.projectStatus,
    isProvider,
    displayName,
    displayAvatar,
    displayInitials,
    displayRole,
    reviewData,
  });

  console.log("🔍 Avatar Debug:", {
    isProvider,
    "cardData.clientAvatar": cardData.clientAvatar,
    "cardData.providerAvatar": cardData.providerAvatar,
    "projectDetails?.clientAvatar": projectDetails?.clientAvatar,
    "projectDetails?.providerAvatar": projectDetails?.providerAvatar,
    "Final displayAvatar": displayAvatar,
    "Final displayName": displayName,
    "Will generate avatar URL": getImageUrl(displayAvatar, displayName),
  });

  // Fetch review if project is completed
  useEffect(() => {
    const fetchReview = async () => {
      if (!isProvider || !cardData.id) {
        console.log("⏭️ Skipping review fetch - not provider or no project ID");
        return;
      }

      console.log("🔍 Checking if should fetch review:", {
        projectStatus: cardData.projectStatus,
        isCompleted: cardData.projectStatus === 'Completed',
        hasRejection: !!projectDetails?.rejectionReason,
      });

      if (cardData.projectStatus === 'Completed') {
        try {
          console.log("📡 Fetching review for project:", cardData.id);
          const response = await getReviewByProject(cardData.id, token);
          console.log("✅ Review fetch response:", response.data);
          setReviewData(response.data);
        } catch (error) {
          console.error('❌ Error fetching review:', error);
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
  }, [cardData.id, cardData.projectStatus, isProvider, token, projectDetails?.rejectionReason]);

  const isProjectOverdue = () => {
    if (!cardData.deadline) return false;
    const now = new Date();
    const deadline = new Date(cardData.deadline);
    return deadline < now && cardData.projectStatus === "Active";
  };

  const projectOverdue = isProjectOverdue();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateWithTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const minSelectableDate = (() => {
    const d = new Date(cardData.deadline);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const handleSaveDeadline = async () => {
    const chosen = new Date(newDeadline);
    const current = new Date(cardData.deadline);

    console.log("📅 Saving deadline:", {
      current: current.toISOString(),
      chosen: chosen.toISOString(),
    });

    if (chosen <= current) {
      console.warn("⚠️ Invalid deadline - must be after current");
      setSnackbar({
        open: true,
        message: "New deadline must be at least 1 day AFTER current deadline.",
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

      console.log("🔄 Updating deadline via API:", { collaborationId, newDeadline });
      const deadlineISO = new Date(newDeadline).toISOString();
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
      const d = new Date(cardData.deadline);
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      setNewDeadline(local.toISOString().split("T")[0]);
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

  // Show review button for provider if completed OR rejected
  const canViewReview = () => {
    if (!isProvider) return false;

    const isCompleted = cardData.projectStatus === 'Completed';
    const isActive = cardData.projectStatus === 'Active';
    const hasRejection = projectDetails?.rejectionReason;

    const result = isCompleted || (isActive && hasRejection);

    console.log("👁️ Can view review check:", {
      isProvider,
      isCompleted,
      isActive,
      hasRejection,
      result,
    });

    return result;
  };

  const handleCloseProjectClick = () => {
    console.log("🎯 Close project clicked:", { isProvider });
    if (isProvider) {
      setOpenCloseDialog(true);
    } else {
      setOpenReviewDialog(true);
    }
  };

  const handleProviderSubmit = async () => {
    console.log("📤 Provider submitting project for review:", cardData.id);
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

  // Handle client review submission (ONE-STEP: accept/reject WITH review)
  const handleClientReview = async (reviewData) => {
    console.log("📝 Client submitting review:", reviewData);

    try {
      setClosingProject(true);

      const closeRequestData = {
        isAccepted: reviewData.isAccepted,
        rejectionReason: reviewData.isAccepted ? undefined : reviewData.rejectionReason,
        rating: reviewData.isAccepted ? reviewData.rating : undefined,
        comment: reviewData.isAccepted ? reviewData.comment : undefined,
      };

      console.log('📤 Sending close request to backend:', closeRequestData);
      console.log('🔗 API endpoint:', `/api/Projects/${cardData.id}/close-by-client`);

      await closeProjectByClient(cardData.id, token, closeRequestData);

      console.log("✅ Project review submitted successfully");

      if (reviewData.isAccepted) {
        console.log("✅ Project accepted - rating and review saved");
        setSnackbar({
          open: true,
          message: "Project completed successfully! Rating and review submitted. Points transferred. ✅",
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

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleViewReview = () => {
    console.log("👁️ Opening review dialog:", {
      projectData: cardData,
      projectDetails,
      reviewData,
    });
    setOpenViewReviewDialog(true);
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 3,
        mb: 3,
        p: 3,
        pb: 0,
        border: projectOverdue ? "2px solid #DC2626" : "1px solid #E5E7EB",
        position: "relative",
      }}
    >
      {/* Project Overdue Warning Banner */}
      {projectOverdue && (
        <Box
          sx={{
            bgcolor: "#FEE2E2",
            borderLeft: "4px solid #DC2626",
            borderRadius: 1,
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <WarningAmberIcon sx={{ color: "#DC2626", fontSize: 28 }} />
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="#DC2626"
              sx={{ mb: 0.5 }}
            >
              ⚠️ PROJECT OVERDUE
            </Typography>
            <Typography variant="body2" color="#991B1B">
              This project passed its deadline on{" "}
              {formatDateWithTime(cardData.deadline)}.
              {!isProvider &&
                " You can extend the deadline by clicking the edit button."}
            </Typography>
          </Box>
        </Box>
      )}

      {/* EDIT BUTTON (CLIENT ONLY) */}
      {!isProvider && cardData.projectStatus === "Active" && (
        <IconButton
          onClick={handleOpenEdit}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          <EditIcon />
        </IconButton>
      )}

      {/* EDIT DEADLINE POPUP */}
      {isEditing && !isProvider && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            zIndex: 20,
            width: 260,
            boxShadow: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight="bold">Edit Deadline</Typography>
            <IconButton size="small" onClick={() => setIsEditing(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            label="New Deadline"
            type="date"
            fullWidth
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minSelectableDate }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveDeadline}
            disabled={loading}
            sx={{
              background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
              textTransform: "none",
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
          gap: 1,
        }}
      >
        <CustomButton
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            py: 0.75,
            px: 1.5,
          }}
        >
          Back to Projects
        </CustomButton>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* Provider: View Review Button */}
          {canViewReview() && (
            <CustomButton
              startIcon={<RateReviewIcon />}
              onClick={handleViewReview}
              sx={{
                textTransform: "none",
                fontSize: "14px",
                py: 0.75,
                px: 2,
                background: cardData.projectStatus === 'Completed'
                  ? 'linear-gradient(to right, #00C8FF, #8B5FF6)'
                  : 'linear-gradient(to right, #DC2626, #EF4444)',
              }}
            >
              View Client Review
            </CustomButton>
          )}

          {/* Submit Final Work / Review & Close Button */}
          {canCloseProject() && (
            <CustomButton
              startIcon={<CheckCircleIcon />}
              onClick={handleCloseProjectClick}
              sx={{
                textTransform: "none",
                fontSize: "14px",
                py: 0.75,
                px: 2,
              }}
            >
              {isProvider ? "Submit Final Work" : "Review & Close Project"}
            </CustomButton>
          )}
        </Box>
      </Box>

      {/* Title */}
      <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
        <Box flex={1}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 0.5, fontSize: "2rem" }}
          >
            {cardData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cardData.description}
          </Typography>

          {/* Rejection Reason Banner */}
          {projectDetails?.rejectionReason &&
            cardData.projectStatus === "Active" && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "#FEF2F2",
                  borderLeft: "4px solid #DC2626",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="600"
                  color="#DC2626"
                  sx={{ mb: 0.5 }}
                >
                  ⚠️ Project Rejected - Rework Required
                </Typography>
                <Typography variant="body2" color="#991B1B">
                  <strong>Reason:</strong> {projectDetails.rejectionReason}
                </Typography>
              </Box>
            )}
          <Box
            sx={{
              position: "absolute",
              top: 70,
              right: !isProvider && cardData.projectStatus === "Active" ? 56 : 16,
              width: "280px",
            }}
          >
            <ProgressSection
              progressPercentage={progressPercentage}
              projectPoints={projectDetails?.points || 0}
            />
          </Box>
        </Box>
      </Box>

      {/* ✅ FIXED: Client/Provider Info + Deadline */}
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        mb={3}
        sx={{ flexWrap: "wrap" }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            src={getImageUrl(displayAvatar, displayName)}
            sx={{ width: 36, height: 36 }}
          >
            {displayInitials}
          </Avatar>

          <Box>
            <Typography variant="body2" color="#334155" fontWeight="600">
              {displayRoleWithName}
            </Typography>

          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarMonthIcon
            sx={{
              fontSize: 16,
              color: projectOverdue ? "#DC2626" : "text.secondary",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: "12px",
              color: projectOverdue ? "#DC2626" : "text.secondary",
              fontWeight: projectOverdue ? 600 : 400,
            }}
          >
            {projectOverdue ? "Was due: " : "Due: "}
            {formatDate(cardData.deadline)}
          </Typography>
        </Box>

        {cardData.projectStatus && (
          <Chip
            label={
              projectOverdue
                ? "Overdue"
                : cardData.projectStatus === "SubmittedForFinalReview"
                  ? "In Review"
                  : cardData.projectStatus
            }
            size="small"
            sx={{
              fontWeight: "600",
              fontSize: "12px",
              height: "26px",
              px: 1.5,
              borderRadius: "6px",
              backgroundColor: (() => {
                if (projectOverdue) return "#FEE2E2";
                if (cardData.projectStatus === "Active") return "#D1FAE5";
                if (cardData.projectStatus === "Completed") return "#DBEAFE";
                if (cardData.projectStatus === "SubmittedForFinalReview")
                  return "#F3E8FF";
                return "#EFF6FF";
              })(),
              color: (() => {
                if (projectOverdue) return "#DC2626";
                if (cardData.projectStatus === "Active") return "#059669";
                if (cardData.projectStatus === "Completed") return "#0284C7";
                if (cardData.projectStatus === "SubmittedForFinalReview")
                  return "#A855F7";
                return "#0284C7";
              })(),
            }}
          />
        )}
      </Box>

      {/* Provider Submit Dialog */}
      <Dialog
        open={openCloseDialog}
        onClose={() => !closingProject && setOpenCloseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Submit Final Work
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to submit this project for final review? All
            tasks must be completed before submission.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenCloseDialog(false)}
            disabled={closingProject}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProviderSubmit}
            variant="contained"
            disabled={closingProject}
            sx={{
              textTransform: "none",
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

      {/* Client Review Dialog (ONE-STEP: Accept/Reject WITH Review) */}
      <ProjectCloseReviewDialog
        open={openReviewDialog}
        onClose={() => !closingProject && setOpenReviewDialog(false)}
        projectTitle={cardData.title}
        projectDescription={cardData.description}
        onSubmitReview={handleClientReview}
      />

      {/* View Project Review Dialog */}
      <ViewProjectReviewDialog
        open={openViewReviewDialog}
        onClose={() => setOpenViewReviewDialog(false)}
        projectData={cardData}
        projectDetails={projectDetails}
        reviewData={reviewData}
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