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
  Autocomplete,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GenericModal from "../../components/Modals/GenericModal";
import { CreateProject, EditProject } from "../../services/profileService";

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
    coverImage: null,
    projectFile: null,
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [projectFilePreview, setProjectFilePreview] = useState(null);

  // Autocomplete state for tags
  const [tags, setTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        duration: editData.duration || "",
        coverImage: null,
        projectFile: null,
      });

      // Initialize tags
      setTags(editData.tags || []);

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
        coverImage: null,
        projectFile: null,
      });
      setTags([]);
      setCoverImagePreview(null);
      setProjectFilePreview(null);
    }
    setTagInputValue("");
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
    setCoverImagePreview(null);
    const input = document.getElementById("coverImage-upload");
    if (input) input.value = "";
  };

  const handleRemoveProjectFile = () => {
    setFormData((prev) => ({ ...prev, projectFile: null }));
    setProjectFilePreview(null);
    const input = document.getElementById("projectFile-upload");
    if (input) input.value = "";
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.duration.trim() !== "" &&
      (coverImagePreview !== null || editData)
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setSnackbar({
        open: true,
        message: "Title, Description, Duration, and Cover Image are required!",
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

      // Use tags from state
      tags.forEach((tag) => data.append("Tags", tag));

      if (formData.coverImage) data.append("CoverImage", formData.coverImage);
      if (formData.projectFile) data.append("ProjectFile", formData.projectFile);

      console.log("Submitting project with tags:", tags);

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
      <Stack spacing={2.5} sx={{ mt: 1 }}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          required
          value={formData.title}
          onChange={handleChange}
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
        />
        <TextField
          label="Duration"
          name="duration"
          fullWidth
          required
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 3 months, 2 weeks"
        />

        {/* Cover Image Section */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Cover Image *
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

        {/* Tags Section with Autocomplete */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Tags
          </Typography>
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
              setTags(newValue);
              setTagInputValue("");
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    variant="outlined"
                    label={option}
                    size="small"
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={tags.length === 0 ? "Type a tag and press Enter" : ""}
                size="small"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        </Box>
      </Stack>
    </GenericModal>
  );
}