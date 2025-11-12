import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Stack, Button, Box } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import GenericModal from "./GenericModal";
import { CreateReport } from "../../services/report";

const ReportModal = ({ open, onClose, userId, userName }) => {
  const token = localStorage.getItem("accessToken");
  const [reason, setReason] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isFormValid = reason.trim() !== "";

  // إنشاء preview للصورة عند اختيارها
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("ReportedUserId", userId);
      formData.append("Reason", reason);
      if (imageFile) formData.append("Img", imageFile);

      await CreateReport(token, formData);

      setSnackbar({
        open: true,
        message: "Report submitted successfully!",
        severity: "success",
      });

      setTimeout(() => {
        onClose();
        setReason("");
        setImageFile(null);
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit report",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title="Report User"
      icon={<FlagIcon sx={{ color: "#EF4444" }} />}
      headerInfo={
        <span style={{ fontWeight: 500, color: "#DC2626" }}>
          You are reporting {userName}
        </span>
      }
      primaryButtonText="Submit Report"
      primaryButtonIcon={<FlagIcon />}
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={!isFormValid}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={handleSnackbarClose}
    >
      <Stack spacing={2}>
        <TextField
        //   select
          label="Reason for Report"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
        >
          {/* <MenuItem value="spam">Spam</MenuItem>
          <MenuItem value="harassment">Harassment</MenuItem>
          <MenuItem value="inappropriate">Inappropriate Content</MenuItem>
          <MenuItem value="scam">Scam</MenuItem>
          <MenuItem value="other">Other</MenuItem> */}
        </TextField>

        <Button
          variant="contained"
          component="label"
          sx={{ textTransform: "none" }}
        >
          Upload Image (Optional)
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Button>

        {imagePreview && (
          <Box
            component="img"
            src={imagePreview}
            alt="Preview"
            sx={{ width: "100%", maxHeight: 200, objectFit: "contain", mt: 1, borderRadius: 1 }}
          />
        )}
      </Stack>
    </GenericModal>
  );
};

export default ReportModal;
