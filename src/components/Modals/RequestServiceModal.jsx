import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import GenericModal from "../Modals/GenericModal";
import {
  createCollaborationRequest,
  editCollaborationRequest,
} from "../../services/collaborationService";
import { useCurrentUser } from "../../Context/CurrentUserContext";

const RequestServiceModal = ({
  open,
  onClose,
  providerId,
  projectTitle,
  projectId,
  providerName,
  pointsBudget: initialPoints,
  isEditMode = false,
  editData = null,
}) => {
  const { updateCurrentUser } = useCurrentUser();

  const [serviceTitle, setServiceTitle] = useState(projectTitle || "");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Project"); // ✅ دايماً Project
  const [pointsBudget, setPointsBudget] = useState(initialPoints || "");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [clientAcceptPublished, setClientAcceptPublished] = useState(false);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isRequestFormValid =
    serviceTitle.trim() !== "" &&
    serviceDescription.trim() !== "" &&
    pointsBudget !== "" &&
    deadline !== ""; // ✅ الـ deadline دايماً مطلوب

  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        console.log("📝 Edit Data received:", editData);

        setServiceTitle(editData.title || "");
        setServiceDescription(editData.description || "");
        setPointsBudget(editData.pointsOffered || "");
        setClientAcceptPublished(editData.clientAcceptPublished || false);

        if (editData.deadline) {
          const date = new Date(editData.deadline);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          setDeadline(`${year}-${month}-${day}`);
        }

        setServiceCategory("Project"); // ✅ دايماً Project
      } else {
        setServiceTitle(projectTitle || "");
        setServiceDescription("");
        setServiceCategory("Project"); // ✅ دايماً Project
        setPointsBudget(initialPoints || "");
        setDeadline("");
        setClientAcceptPublished(false);
      }
    }
  }, [open, projectTitle, initialPoints, isEditMode, editData]);

  const handlePreSubmit = () => {
    if (!isEditMode) {
      setIsConfirmDialogOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (isConfirmDialogOpen) {
      setIsConfirmDialogOpen(false);
    }

    if (!isEditMode && !providerId) {
      setSnackbar({
        open: true,
        message: "Provider ID is missing!",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData = {
        title: serviceTitle,
        description: serviceDescription,
        pointsOffered: parseInt(pointsBudget),
      };

      if (!isEditMode) {
        requestData.type = "Project"; // ✅ دايماً Project
        requestData.providerId = providerId;
        requestData.deadline = deadline;
        requestData.clientAcceptPublished = clientAcceptPublished;
      } else {
        if (deadline) {
          let originalDeadline = null;

          if (editData.deadline) {
            try {
              const date = new Date(editData.deadline);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              originalDeadline = `${year}-${month}-${day}`;
            } catch {
              originalDeadline = "";
            }
          }

          if (deadline !== originalDeadline) {
            requestData.deadline = deadline;
          }
        }

        requestData.clientAcceptPublished = clientAcceptPublished;
      }

      console.log(
        isEditMode ? "✏️ Editing request data:" : "➕ Creating request data:",
        requestData
      );

      if (!token) {
        setSnackbar({
          open: true,
          message: "You need to login first!",
          severity: "error",
        });
        setIsSubmitting(false);
        return;
      }

      let response;
      if (isEditMode) {
        response = await editCollaborationRequest(
          token,
          editData.id,
          requestData
        );
        console.log("✅ Request edited successfully:", response);
      } else {
        response = await createCollaborationRequest(token, requestData);
        console.log("✅ Request created successfully:", response);
      }

      setSnackbar({
        open: true,
        message: isEditMode
          ? "Request updated successfully!"
          : "Request sent successfully!",
        severity: "success",
      });

      await updateCurrentUser();
      console.log("✅ Points updated in Navbar!");

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error(
        isEditMode ? "❌ Error editing request:" : "❌ Error creating request:",
        error
      );

      if (error.response) {
        console.error("📛 Server Error Response:", error.response.data);
        console.error("📛 Status Code:", error.response.status);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data ||
        error.message ||
        `Failed to ${
          isEditMode ? "update" : "send"
        } request. Please try again.`;

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });

      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsConfirmDialogOpen(false);
    setServiceTitle(projectTitle || "");
    setServiceDescription("");
    setServiceCategory("Project");
    setPointsBudget(initialPoints || "");
    setDeadline("");
    setIsSubmitting(false);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const headerInfo = providerName && (
    <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e40af" }}>
      {isEditMode
        ? `Editing request sent to ${providerName}`
        : `You're sending a request to ${providerName}`}
    </Typography>
  );

return (
  <>
    <GenericModal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Request" : "Request Service"}
      icon={
        isEditMode ? (
          <EditIcon sx={{ color: "#3b82f6" }} />
        ) : (
          <DescriptionIcon sx={{ color: "#3b82f6" }} />
        )
      }
      headerInfo={headerInfo}
      primaryButtonText={isEditMode ? "Update Request" : "Send Request"}
      primaryButtonIcon={isEditMode ? <EditIcon /> : <SendIcon />}
      onPrimaryAction={handlePreSubmit}
      isPrimaryDisabled={!isRequestFormValid || isSubmitting}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={handleSnackbarClose}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {/* Service Title */}
        <TextField
          fullWidth
          label="Service Title"
          placeholder="What service do you need?"
          value={serviceTitle}
          onChange={(e) => setServiceTitle(e.target.value)}
          disabled={isSubmitting}
          required
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          placeholder="Describe your project in detail..."
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          disabled={isSubmitting}
          required
        />

        {/* Points Budget - بدون Request Type */}
        <TextField
          fullWidth
          label="Points Budget"
          type="number"
          placeholder="e.g., 150"
          value={pointsBudget}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseInt(value) > 0) {
              setPointsBudget(value);
            }
          }}
          disabled={isSubmitting}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
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
              </InputAdornment>
            ),
            inputProps: {
              min: 1,
            },
          }}
          sx={{
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
            "& input[type=number]::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          }}
        />

        {/* Deadline */}
        <TextField
          fullWidth
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isSubmitting}
          required
                inputProps={{
  min: new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0],
}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon
                  sx={{ color: "text.secondary", fontSize: 20 }}
                />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: true, // ✅ عشان الـ label ما يتداخل مع التاريخ
          }}
        />

        {/* Checkbox للـ Published */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <input
            type="checkbox"
            checked={clientAcceptPublished}
            onChange={(e) => setClientAcceptPublished(e.target.checked)}
            disabled={isSubmitting}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: "medium", color: "text.primary" }}
          >
            Do you agree to allow this project to be published on the Browse
            page?
          </Typography>
        </Box>
      </Box>
    </GenericModal>

    {/* Dialog التأكيد */}
    {!isEditMode && (
      <Dialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Confirm Project Request
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Your points will be temporarily frozen and transferred to{" "}
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              {providerName}
            </Typography>{" "}
            once the collaboration is completed. Do you agree?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsConfirmDialogOpen(false)}
            disabled={isSubmitting}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
              "&:hover": {
                background: "linear-gradient(to right, #8B5FF6, #00C8FF)",
              },
            }}
          >
            {isSubmitting ? "Processing..." : "I Agree"}
          </Button>
        </DialogActions>
      </Dialog>
    )}
  </>
);
};

export default RequestServiceModal;