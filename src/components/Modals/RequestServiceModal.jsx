import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
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
  const [serviceTitle, setServiceTitle] = useState(projectTitle || "");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [pointsBudget, setPointsBudget] = useState(initialPoints || "");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("accessToken");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isRequestFormValid =
    serviceTitle.trim() !== "" &&
    serviceDescription.trim() !== "" &&
    serviceCategory !== "" &&
    pointsBudget !== "" &&
    deadline !== "";

  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        console.log("📝 Edit Data received:", editData);

        setServiceTitle(editData.title || "");
        setServiceDescription(editData.description || "");
        setPointsBudget(editData.pointsOffered || "");

        if (editData.deadline) {
          let formattedDate;
          if (editData.deadline.includes("/")) {
            const parts = editData.deadline.split("/");
            const month = parts[0].padStart(2, "0");
            const day = parts[1].padStart(2, "0");
            const year = parts[2];
            formattedDate = `${year}-${month}-${day}`;
          } else {
            const date = new Date(editData.deadline);
            formattedDate = date.toISOString().split("T")[0];
          }
          console.log(" Formatted date:", formattedDate);
          setDeadline(formattedDate);
        }

        let categoryValue = "";
        if (editData.category) {
          categoryValue = editData.category.replace("Request", "");
          console.log(" Category from editData.category:", categoryValue);
        } else if (editData.type) {
          categoryValue = editData.type.replace("Request", "");
          console.log(" Category extracted from type:", categoryValue);
        }

        console.log(" Final category value:", categoryValue);
        setServiceCategory(categoryValue);
      } else {
        if (projectTitle) setServiceTitle(projectTitle);
        if (initialPoints) setPointsBudget(initialPoints);
      }
    }
  }, [open, projectTitle, initialPoints, isEditMode, editData]);

  const handleSubmit = async () => {
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
        deadline: deadline,
        type: serviceCategory === "Project" ? "RequestProject" : "Course",
      };

      if (!isEditMode) {
        requestData.providerId = providerId;
      }

      console.log(
        isEditMode ? "Editing request data:" : "Creating request data:",
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
        console.log(" Request edited successfully:", response);
      } else {
        response = await createCollaborationRequest(token, requestData);
        console.log(" Request created successfully:", response);
      }

      setSnackbar({
        open: true,
        message: isEditMode
          ? "Request updated successfully!"
          : "Request sent successfully!",
        severity: "success",
      });

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
        error.response?.data?.title ||
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
    setServiceTitle(projectTitle || "");
    setServiceDescription("");
    setServiceCategory("");
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
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={!isRequestFormValid}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={handleSnackbarClose}
    >
      {/* Service Title */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
        >
          Service Title <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          placeholder="What service do you need?"
          value={serviceTitle}
          onChange={(e) => setServiceTitle(e.target.value)}
          disabled={isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              height: "46px",
            },
          }}
        />
      </Box>

      {/* Description */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
        >
          Description <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Describe your project in detail..."
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          disabled={isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Category & Points Budget */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            Request Type <span style={{ color: "red" }}>*</span>
          </Typography>
          <FormControl fullWidth>
            <Select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              displayEmpty
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                height: "46px",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Request Type
              </MenuItem>
              <MenuItem value="Project">Project</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            Points Budget <span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="e.g., 150"
            value={pointsBudget}
            onChange={(e) => setPointsBudget(e.target.value)}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#3B82F6", // لون الخلفية
                      borderRadius: "50%", // دائري
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
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "46px",
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Deadline */}
     {serviceCategory === "Project" && (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="body2"
      sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
    >
      Deadline <span style={{ color: "red" }}>*</span>
    </Typography>
    <TextField
      fullWidth
      type="date"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      disabled={isSubmitting}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CalendarTodayIcon
              sx={{ color: "text.secondary", fontSize: 20 }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          height: "46px",
        },
      }}
    />
  </Box>
)}

    </GenericModal>
  );
};

export default RequestServiceModal;
