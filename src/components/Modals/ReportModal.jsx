import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Stack, 
  Button, 
  Box, 
  IconButton, 
  Typography, 
  Tooltip 
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericModal from "./GenericModal";
import { CreateReport } from "../../services/adminService";
import { getToken } from "../../utils/authHelpers";

const ReportModal = ({ open, onClose, userId, userName }) => {
  const token = getToken();
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

  // إدارة معاينة الصورة وتنظيف الذاكرة
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    // إنشاء رابط مؤقت للمعاينة
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    // تنظيف الرابط عند تغيير الصورة أو إغلاق المكون
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // دالة لإعادة ضبط النموذج
  const resetForm = () => {
    setReason("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

      // إغلاق بعد نجاح العملية
      setTimeout(() => {
        handleClose();
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

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  return (
    <GenericModal
      open={open}
      onClose={handleClose}
      title={`Report ${userName || "User"}`}
      icon={<FlagIcon sx={{ color: "#EF4444" }} />}
      primaryButtonText="Submit Report"
      primaryButtonIcon={<FlagIcon />}
      onPrimaryAction={handleSubmit}
      onSecondaryAction={handleClose}
      secondaryButtonText="Cancel"
      isPrimaryDisabled={!isFormValid}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={handleSnackbarClose}
    >
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        <TextField
          label="Reason for Report"
          // placeholder="Please describe why you are reporting this user..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
        />

        <Box>
          {!imagePreview ? (
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ 
                textTransform: "none", 
                borderStyle: 'dashed',
                py: 1.5,
                borderColor: '#ccc',
                '&:hover': { borderStyle: 'dashed' }
              }}
            >
              Upload (Optional)
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) setImageFile(e.target.files[0]);
                }}
              />
            </Button>
          ) : (
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{ 
                  width: "100%", 
                  maxHeight: 200, 
                  objectFit: "contain", 
                  borderRadius: 2,
                  bgcolor: '#f9f9f9',
                  border: '1px solid #eee'
                }}
              />
              <Tooltip title="Remove image">
                <IconButton 
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    boxShadow: 1,
                    '&:hover': { backgroundColor: '#fff' }
                  }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
           
            </Box>
          )}
        </Box>
      </Stack>
    </GenericModal>
  );
};

export default ReportModal;