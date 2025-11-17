import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GenericModal from "../../components/Modals/GenericModal";
import {
  CreateProject,
  EditProject,
} from "../../services/profileService";

export default function UserProjectModal({
  open,
  onClose,
  token,
  onSuccess,
  editData = null, // إذا فيه بيانات المشروع للتعديل
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
     tags: [],
    coverImage: null,
    projectFile: null,
  });
   const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        duration: editData.duration || "",
         tags: editData.tags || [],
        coverImage: null,
        projectFile: null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        duration: "",
         tags: [],
        coverImage: null,
        projectFile: null,
      });
    }
     setTagInput("");
  }, [editData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.duration) {
      setSnackbar({
        open: true,
        message: "All fields are required!",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();
      data.append("Title", formData.title);
      data.append("Description", formData.description);
      data.append("Duration", formData.duration);
       formData.tags.forEach((tag) => data.append("Tags", tag));
      if (formData.coverImage) data.append("CoverImage", formData.coverImage);
      if (formData.projectFile)
        data.append("ProjectFile", formData.projectFile);
      console.log("Submitting project with data:", formData);
      if (editData) {
       const response =  await EditProject(token, data, editData.id);
       console.log("Edit project response:", response);
        setSnackbar({
          open: true,
          message: "Project updated successfully!",
          severity: "success",
        });
      } else {
       const respone =  await CreateProject(token, data);
       console.log("Create project response:", respone);
        setSnackbar({
          open: true,
          message: "Project created successfully!",
          severity: "success",
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to submit project. Try again!",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={editData ? "Edit Project" : "Create New Project"}
      icon={<WorkOutlineIcon color="primary" />}
      primaryButtonText={editData ? "Update" : "Create"}
      onPrimaryAction={handleSubmit}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={() => setSnackbar(null)}
    >
      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          fullWidth
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          label="Duration"
          name="duration"
          fullWidth
          value={formData.duration}
          onChange={handleChange}
        />

        {/* Upload Section */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <label htmlFor="coverImage-upload">
            <input
              accept="image/*"
              id="coverImage-upload"
              name="coverImage"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <IconButton component="span" color="primary">
              <PhotoCameraIcon />
            </IconButton>
            <Typography variant="caption">
              {formData.coverImage ? formData.coverImage.name : "Upload Cover"}
            </Typography>
          </label>

          <label htmlFor="projectFile-upload">
            <input
              id="projectFile-upload"
              name="projectFile"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <IconButton component="span" color="primary">
              <FolderIcon />
            </IconButton>
            <Typography variant="caption">
              {formData.projectFile ? formData.projectFile.name : "Upload File"}
            </Typography>
          </label>
        </Box>

        {/* Tags Input */}
       {/* Tags Input - بس اعرضها اذا مش Edit Mode */}
{!editData && (
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Tags
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        size="small"
        placeholder="Add tag"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
          }
        }}
      />
      <IconButton color="primary" onClick={handleAddTag}>
        <AddIcon />
      </IconButton>
    </Box>
    <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {formData.tags.map((tag, idx) => (
        <Chip
          key={idx}
          label={tag}
          onDelete={() => handleDeleteTag(tag)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  </Box>
)}

{/* اعرض التاجز بس للقراءة في وضع Edit */}
{editData && formData.tags.length > 0 && (
  <Box>
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      Tags
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {formData.tags.map((tag, idx) => (
        <Chip
          key={idx}
          label={tag}
          color="primary"
          variant="outlined"
          // بدون onDelete عشان ما يقدر يحذف
        />
      ))}
    </Box>
  </Box>
)}
      </Stack>
    </GenericModal>
  );
}
