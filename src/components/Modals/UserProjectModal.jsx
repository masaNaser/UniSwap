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
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
  editData = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    tags: [],
    coverImage: null,
    projectFile: null,
  });
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [projectFilePreview, setProjectFilePreview] = useState(null);
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
      
      // ✅ تصحيح: اضافة ${} بشكل صحيح
      if (editData.coverImage) {
        setCoverImagePreview(`https://uni1swap.runasp.net/${editData.coverImage}`);
      }
      
      if (editData.projectFile) {
        setProjectFilePreview(editData.projectFile);
      }
    } else {
      setFormData({
        title: "",
        description: "",
        duration: "",
        tags: [],
        coverImage: null,
        projectFile: null,
      });
      setCoverImagePreview(null);
      setProjectFilePreview(null);
    }
    setTagInput("");
  }, [editData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      
      if (name === "coverImage") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
      
      if (name === "projectFile") {
        setProjectFilePreview(files[0].name);
      }
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
    // ✅ تصحيح: اضافة ${}
    setCoverImagePreview(editData?.coverImage ? `https://uni1swap.runasp.net/${editData.coverImage}` : null);
    const input = document.getElementById("coverImage-upload");
    if (input) input.value = "";
  };

  const handleRemoveProjectFile = () => {
    setFormData((prev) => ({ ...prev, projectFile: null }));
    setProjectFilePreview(editData?.projectFile || null);
    const input = document.getElementById("projectFile-upload");
    if (input) input.value = "";
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

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.duration.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setSnackbar({
        open: true,
        message: "Title, Description, and Duration are required!",
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
      if (formData.projectFile) data.append("ProjectFile", formData.projectFile);

      console.log("Submitting project with data:", formData);
      
      if (editData) {
        const response = await EditProject(token, data, editData.id);
        console.log("Edit project response:", response);
        setSnackbar({
          open: true,
          message: "Project updated successfully!",
          severity: "success",
        });
      } else {
        const response = await CreateProject(token, data);
        console.log("Create project response:", response);
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
      
      let errorMessage = "Failed to submit project. Try again!";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join(', ');
          errorMessage = errorMessages || errorMessage;
        } 
        else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
        else if (errorData.title) {
          errorMessage = errorData.title;
        }
      } 
      else if (err.message) {
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

  // ✅ دالة مساعدة لعرض اسم الملف
  const getFileName = (filePath) => {
    if (!filePath) return "";
    if (typeof filePath === 'string') {
      return filePath.split("/").pop();
    }
    return filePath;
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={editData ? "Edit Project" : "Create New Project"}
      icon={<WorkOutlineIcon color="primary" />}
      primaryButtonText={editData ? "Update" : "Create"}
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={!isFormValid()}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={() => setSnackbar(null)}
    >
      <Stack spacing={2.5}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          required
          value={formData.title}
          onChange={handleChange}
          helperText="Required field"
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          fullWidth
          required
          value={formData.description}
          onChange={handleChange}
          helperText="Required field"
        />
        <TextField
          label="Duration"
          name="duration"
          fullWidth
          required
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 3 months, 2 weeks"
          helperText="Required field"
        />

        {/* Cover Image Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cover Image
          </Typography>

          {coverImagePreview ? (
            <Card sx={{ position: "relative", maxWidth: 400 }}>
              <CardMedia
                component="img"
                height="200"
                image={coverImagePreview}
                alt="Cover preview"
                sx={{ objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={handleRemoveCoverImage}
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
            <label htmlFor="coverImage-upload">
              <input
                accept="image/*"
                id="coverImage-upload"
                name="coverImage"
                type="file"
                hidden
                onChange={handleFileChange}
              />
              <Button
                component="span"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{ textTransform: "none" }}
              >
                Upload Cover Image
              </Button>
            </label>
          )}
        </Box>

        {/* Project File Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Project File
          </Typography>

          {projectFilePreview ? (
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
              {formData.projectFile ? (
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {formData.projectFile.name}
                </Typography>
              ) : (
                // ✅ تصحيح: اضافة ${} واستخدام دالة مساعدة
                <Button
                  component="a"
                  href={`https://uni1swap.runasp.net/${projectFilePreview}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flex: 1, textTransform: "none", justifyContent: "flex-start" }}
                >
                  {getFileName(projectFilePreview)}
                </Button>
              )}
              <IconButton size="small" onClick={handleRemoveProjectFile}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <label htmlFor="projectFile-upload">
              <input
                id="projectFile-upload"
                name="projectFile"
                type="file"
                hidden
                onChange={handleFileChange}
              />
              <Button
                component="span"
                variant="outlined"
                startIcon={<FolderIcon />}
                sx={{ textTransform: "none" }}
              >
                Upload Project File
              </Button>
            </label>
          )}
        </Box>

        {/* Tags Input - للCreate Mode فقط */}
        {!editData && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add tag (e.g., React, Design)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                fullWidth
              />
              <IconButton color="primary" onClick={handleAddTag}>
                <AddIcon />
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
        )}

        {/* Tags Display - للEdit Mode فقط */}
        {editData && formData.tags.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Tags
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.tags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </GenericModal>
  );
}