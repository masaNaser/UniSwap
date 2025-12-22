import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  Button,
  Card,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EditIcon from "@mui/icons-material/Edit";
import GenericModal from "./GenericModal";
import { CreateStudySupportSub } from "../../services/studySupportService";
import { editPublishProject } from "../../services/publishProjectServices";
import { getImageUrl } from "../../utils/imageHelper";

export default function StudyProjectModal({
  open,
  onClose,
  token,
  onSuccess,
  editData = null,
  parentSubServiceId,
  subServiceId,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    img: null,
    file: null,
  });
  
  const [imgPreview, setImgPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  // Load data when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        tags: editData.tags || [],
        img: null,
        file: null,
      });
      
      if (editData.img) {
        setImgPreview(getImageUrl(editData.img));
      }
      
      if (editData.filePath) {
        setFilePreview(editData.filePath);
      }
    } else {
      // Reset for create mode
      setFormData({
        title: "",
        description: "",
        tags: [],
        img: null,
        file: null,
      });
      setImgPreview(null);
      setFilePreview(null);
    }
    setTagInput("");
  }, [editData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setFilePreview(file.name);
    }
  };

  // Remove Image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, img: null }));
    setImgPreview(null);
    const input = document.getElementById("study-img-upload");
    if (input) input.value = "";
  };

  // Remove File
  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setFilePreview(null);
    const input = document.getElementById("study-file-upload");
    if (input) input.value = "";
  };

  // Add Tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Delete Tag
  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  // Validation
  const isFormValid = () => {
    return formData.title.trim() !== "" && formData.description.trim() !== "";
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setSnackbar({
        open: true,
        message: "Title and Description are required!",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();
      data.append("Title", formData.title);
      data.append("Description", formData.description);

      // Add IDs only for create mode
      if (!editData) {
        data.append("SubServiceId", parentSubServiceId);
        data.append("ParentSubServiceId", subServiceId);
      }

      // Add image if selected
      if (formData.img) {
        data.append("Img", formData.img);
      }

      // Add file if selected
      if (formData.file) {
        data.append("File", formData.file);
      }

      // Add tags
      formData.tags.forEach((tag) => data.append("Tags", tag));

      console.log("Submitting study project:", formData);

      if (editData) {
        // Edit mode
        const response = await editPublishProject(token, editData.id, data);
        console.log("Edit response:", response);
        setSnackbar({
          open: true,
          message: "Project updated successfully!",
          severity: "success",
        });
      } else {
        // Create mode
        const response = await CreateStudySupportSub(token, data);
        console.log("Create response:", response);
        setSnackbar({
          open: true,
          message: "Project published successfully!",
          severity: "success",
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);

      let errorMessage = "Failed to submit project. Try again!";

      if (err.response?.data) {
        const errorData = err.response.data;

        if (errorData.errors && typeof errorData.errors === "object") {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(", ");
          errorMessage = errorMessages || errorMessage;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileName = (filePath) => {
    if (!filePath) return "";
    if (typeof filePath === "string") {
      return filePath.split("/").pop();
    }
    return filePath;
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={editData ? "Edit Study Project" : "Publish Study Project"}
      icon={editData ? <EditIcon color="primary" /> : <SchoolIcon color="primary" />}
      primaryButtonText={editData ? "Save Changes" : "Publish"}
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={!isFormValid()}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={() => setSnackbar(null)}
    >
      <Stack spacing={2.5} sx={{mt:2}}>
        {/* Title */}
        <TextField
          label="Project Title"
          name="title"
          fullWidth
          required
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        {/* Description */}
        <TextField
          label="Description"
          name="description"
          multiline
          rows={4}
          fullWidth
          required
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        {/* Project Image Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Project Image {!editData && "*"}
          </Typography>

          {imgPreview ? (
            <Card sx={{ position: "relative", maxWidth: 400 }}>
              <CardMedia
                component="img"
                height="200"
                image={imgPreview}
                alt="Project preview"
                sx={{ objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "white",
                  "&:hover": { bgcolor: "grey.100" },
                  boxShadow: 2,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Card>
          ) : (
            <label htmlFor="study-img-upload">
              <input
                accept="image/*"
                id="study-img-upload"
                name="img"
                type="file"
                hidden
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              <Button
                component="span"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{ textTransform: "none" }}
                disabled={isSubmitting}
              >
                Upload Project Image
              </Button>
            </label>
          )}
          
          {editData && !formData.img && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Leave empty to keep current image
            </Typography>
          )}
        </Box>

        {/* Project File Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Project File {!editData && "*"}
          </Typography>

          {filePreview ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "grey.50",
              }}
            >
              <InsertDriveFileIcon color="primary" />
              {formData.file ? (
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {formData.file.name}
                </Typography>
              ) : (
                <Button
                  component="a"
                  href={`https://uni1swap.runasp.net/${filePreview}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    justifyContent: "flex-start",
                  }}
                >
                  {getFileName(filePreview)}
                </Button>
              )}
              <IconButton size="small" onClick={handleRemoveFile}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <label htmlFor="study-file-upload">
              <input
                id="study-file-upload"
                name="file"
                type="file"
                hidden
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <Button
                component="span"
                variant="outlined"
                startIcon={<FolderIcon />}
                sx={{ textTransform: "none" }}
                disabled={isSubmitting}
              >
                Upload Project File
              </Button>
            </label>
          )}
          
          {editData && !formData.file && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Leave empty to keep current file
            </Typography>
          )}
        </Box>

        {/* Tags Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Tags (Optional)
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              fullWidth
              disabled={isSubmitting}
            />
            <IconButton 
              color="primary" 
              onClick={handleAddTag}
              disabled={isSubmitting}
            >
              {/* <AddIcon /> */}
            </IconButton>
          </Box>
          <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData.tags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Stack>
    </GenericModal>
  );
}