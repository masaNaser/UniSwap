import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  IconButton,
  Chip,
  Autocomplete,
} from "@mui/material";
import {
  Image as ImageIcon,
  AttachFile,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import GenericModal from "../../components/Modals/GenericModal";
import {getToken} from "../../utils/authHelpers"
import { RemoveImgInPost } from "../../services/postService"; // تأكد من المسار الصحيح
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
  // Autocomplete state for tags
  const [tags, setTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  // Initialize tags when modal opens or editDialog changes
  useEffect(() => {
    if (open && editDialog.tags) {
      const tagsArray = Array.isArray(editDialog.tags)
        ? editDialog.tags
        : typeof editDialog.tags === 'string' && editDialog.tags.trim()
          ? editDialog.tags.split(',').map(t => t.trim()).filter(Boolean)
          : [];
      setTags(tagsArray);
    } else if (open && !editDialog.tags) {
      setTags([]);
    }
    setTagInputValue("");
  }, [open, editDialog.tags]);

  // Sync tags back to editDialog
  useEffect(() => {
    setEditDialog((prev) => ({
      ...prev,
      tags: tags.join(","),
    }));
  }, [tags, setEditDialog]);

  const handleFileChange = (e, isImage = true) => {
    const file = e.target.files[0];
    if (file) {
      setEditDialog((prev) => ({
        ...prev,
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
        // Clear existing file when new file is selected
        existingFileUrl: "",
        removeFile: false, // Reset remove flag when selecting new file
      }));
    }
  };

const handleRemoveFile = async () => {
    // 1. إذا كان هناك ملف موجود مسبقاً على السيرفر، نقوم بحذفه عبر الـ API
    if (editDialog.existingFileUrl && editDialog.id) {
      try {
        const token = getToken(); // أو الطريقة التي تخزن بها التوكن
        await RemoveImgInPost(token, editDialog.id);
        
        // اختيارياً: يمكنك إظهار رسالة نجاح هنا عبر الـ snackbar
      } catch (error) {
        console.error("Failed to remove file from server:", error);
        // يمكنك التعامل مع الخطأ هنا (مثلاً عدم حذف الصورة من الواجهة إذا فشل الطلب)
        return; 
      }
    }

    // 2. تحديث الحالة المحلية لإخفاء الملف من المودال والبوست
    setEditDialog((prev) => ({
      ...prev,
      file: null,
      previewUrl: "",
      existingFileUrl: "",
      removeFile: true, 
    }));

    // 3. تنظيف قيم مدخلات الملفات (Inputs)
    const imageInput = document.getElementById("edit-upload-image");
    const docInput = document.getElementById("edit-upload-document");
    if (imageInput) imageInput.value = "";
    if (docInput) docInput.value = "";
  };

  // Helper function to check if file is an image
  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Get display file name from URL
  const getFileName = (url) => {
    if (!url) return "Attached document";
    try {
      const parts = url.split('/');
      return parts[parts.length - 1];
    } catch {
      return "Attached document";
    }
  };

  // Determine what to show in preview
  const hasNewFile = editDialog.file;
  const hasExistingFile = editDialog.existingFileUrl && !editDialog.removeFile;
  const showPreview = hasNewFile || hasExistingFile;

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
        sx={{ mb: 3, mt: 2 }}
      />

      {/* Tags Field with Autocomplete */}
      <Box sx={{ mb: 4 }}>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={tags}
          inputValue={tagInputValue}
          onInputChange={(event, newInputValue) => {
            setTagInputValue(newInputValue);
          }}
          onChange={(event, newValue) => {
            // Limit to 5 tags
            if (newValue.length > 5) {
              return;
            }
            setTags(newValue);
            setTagInputValue("");
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={`#${option}`}
                  variant="outlined"
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags (max 5)"
              placeholder={tags.length === 0 ? "Type a tag and press Enter" : ""}
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
        />
      </Box>

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
      {showPreview && (
        <Box sx={{ mt: 2, mb: 2 }}>
          {/* New file preview (from file input) */}
          {hasNewFile && editDialog.previewUrl ? (
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
          ) : hasNewFile && !editDialog.previewUrl ? (
            // New document (not image)
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
                  {editDialog.file.name}
                </Box>
                <Box sx={{ fontSize: "12px", color: "text.secondary" }}>
                  {(editDialog.file.size / 1024).toFixed(2)} KB
                </Box>
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
          ) : hasExistingFile && isImageFile(editDialog.existingFileUrl) ? (
            // Existing image
            <Box sx={{ display: "inline-block", position: "relative" }}>
              <img
                src={editDialog.existingFileUrl}
                alt="Current file"
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
          ) : hasExistingFile ? (
            // Existing document (not image)
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
                  {getFileName(editDialog.existingFileUrl)}
                </Box>
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
          ) : null}
        </Box>
      )}
    </GenericModal>
  );
};

export default EditPostModal;