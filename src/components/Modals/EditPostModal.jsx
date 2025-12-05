import React from "react";
import {
  TextField,
  Box,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Image as ImageIcon,
  AttachFile,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import GenericModal from "../../components/Modals/GenericModal";

const EditPostModal = ({
  open,
  onClose,
  editDialog,
  setEditDialog,
  onSubmit,
  isUpdating,
  snackbar,
  onSnackbarClose,
}) => {
  const handleFileChange = (e, isImage = true) => {
    const file = e.target.files[0];
    if (file) {
      setEditDialog((prev) => ({
        ...prev,
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      }));
    }
  };

  const handleRemoveFile = () => {
    setEditDialog((prev) => ({
      ...prev,
      file: null,
      previewUrl: "",
      existingFileUrl: "",
    }));
    const imageInput = document.getElementById("edit-upload-image");
    const docInput = document.getElementById("edit-upload-document");
    if (imageInput) imageInput.value = "";
    if (docInput) docInput.value = "";
  };

  return (
    <GenericModal
  open={open}
  onClose={onClose}
  title="Edit Post"
  icon={<EditIcon sx={{ color: "#3B82F6" }} />}
  primaryButtonText="Save Changes"
  primaryButtonIcon={<EditIcon />}
  onPrimaryAction={onSubmit}
  isPrimaryDisabled={!editDialog.content?.trim()}
  isSubmitting={isUpdating}
  snackbar={snackbar}
  onSnackbarClose={onSnackbarClose}
  maxWidth="sm"
  sx={{ '& .MuiDialog-paper': { width: '500px', maxWidth: '90%' } }}
>
  {/* Content Field */}
  <TextField
    fullWidth
    multiline
    rows={5}
    label="Content"
    value={editDialog.content}
    onChange={(e) =>
      setEditDialog((prev) => ({ ...prev, content: e.target.value }))
    }
    sx={{ mb: 3, mt:2 }}
  />

  {/* Tags Field */}
  <TextField
    fullWidth
    label="Tags (comma separated)"
    value={editDialog.tags}
    onChange={(e) =>
      setEditDialog((prev) => ({ ...prev, tags: e.target.value }))
    }
    sx={{ mb: 3 }}
  />

  {/* Upload Buttons */}
  <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
    {/* Image Upload */}
    <Box>
      <input
        type="file"
        accept="image/*"
        id="edit-upload-image"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, true)}
      />
      <label htmlFor="edit-upload-image">
        <Button
          component="span"
          variant="outlined"
          startIcon={<ImageIcon />}
          sx={{ textTransform: "none" }}
        >
          Choose Image
        </Button>
      </label>
    </Box>

    {/* Document Upload */}
    <Box>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        id="edit-upload-document"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, false)}
      />
      <label htmlFor="edit-upload-document">
        <Button
          component="span"
          variant="outlined"
          startIcon={<AttachFile />}
          sx={{ textTransform: "none" }}
        >
          Choose Document
        </Button>
      </label>
    </Box>
  </Box>

  {/* Preview Section */}
  {/* Preview Section */}
  {(editDialog.file || editDialog.existingFileUrl) && (
    <Box sx={{ mt: 2, mb: 2 }}>
      {editDialog.previewUrl ? (
        <Box sx={{ display: "inline-block", position: "relative" }}>
          <img
            src={editDialog.previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              maxWidth: "300px",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <IconButton
            onClick={handleRemoveFile}
            size="small"
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          p: 2, 
          border: "1px solid #e0e0e0", 
          borderRadius: "8px",
          bgcolor: "#f5f5f5"
        }}>
          <AttachFile sx={{ color: "#3B82F6" }} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontWeight: 500, fontSize: "14px" }}>
              {editDialog.file ? editDialog.file.name : "Attached document"}
            </Box>
            {editDialog.file && (
              <Box sx={{ fontSize: "12px", color: "text.secondary" }}>
                {(editDialog.file.size / 1024).toFixed(2)} KB
              </Box>
            )}
          </Box>
          <IconButton 
            onClick={handleRemoveFile}
            size="small"
            sx={{ 
              color: "error.main",
              "&:hover": { bgcolor: "error.light" }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )}
</GenericModal>

  );
};

export default EditPostModal;