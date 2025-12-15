import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../CustomButton/CustomButton";
import DisabledCustomButton from "../CustomButton/DisabledCustomButton";

const GenericModal = ({
  open,
  onClose,
  title,
  icon,
  headerInfo,
  children,
  primaryButtonText = "Submit",
  primaryButtonIcon,
  onPrimaryAction,
  isPrimaryDisabled = false,
  isSubmitting = false,
  secondaryButtonText = "Cancel",
  secondaryButtonSx, // ← إضافة prop جديد للـ secondary button styling
  snackbar,
  onSnackbarClose,
  maxWidth = "sm",
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: 1 }}>
          {headerInfo && (
            <Box
              sx={{
                mb: 2.5,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "rgba(59,130,246,0.08)",
              }}
            >
              {headerInfo}
            </Box>
          )}
          {children}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <CustomButton
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              minWidth: "100px",
              background: "white",
              color: "#3b82f6",
              border: "1px solid #3b82f6",
              ...secondaryButtonSx, // ← تطبيق الـ custom styling
            }}
          >
            {secondaryButtonText}
          </CustomButton>

          {isPrimaryDisabled ? (
            <DisabledCustomButton
              startIcon={primaryButtonIcon}
              sx={{ minWidth: "150px" }}
            >
              {primaryButtonText}
            </DisabledCustomButton>
          ) : (
            <CustomButton
              onClick={onPrimaryAction}
              disabled={isSubmitting}
              sx={{ minWidth: "150px" }}
              startIcon={!isSubmitting ? primaryButtonIcon : null}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : primaryButtonText}
            </CustomButton>
          )}
        </DialogActions>
      </Dialog>

      {snackbar && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={snackbar.autoHideDuration || 2000}
          onClose={onSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={onSnackbarClose}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              bgcolor: snackbar.severity === "success" ? "#3b82f6" : "#EF4444",
              color: "white",
              "& .MuiAlert-icon": { color: "white" },
            }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default GenericModal;