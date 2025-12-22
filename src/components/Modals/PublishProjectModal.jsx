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
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import GenericModal from "../Modals/GenericModal";
import {
  publishFromCompletedProject,
  editPublishProject,
} from "../../services/publishProjectServices";
import { getServices } from "../../services/servicesService";
import { getSubServices } from "../../services/subServiceServices";
import { getToken } from "../../utils/authHelpers";
const PublishProjectModal = ({
  open,
  onClose,
  projectId,
  projectTitle,
  projectDescription,
  projectPoints,
  onPublishSuccess,
  publishProjectId,
  existingProject,
  isEditMode = false,
  onEditSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [subServiceId, setSubServiceId] = useState("");
  const [points, setPoints] = useState("");
  const [deliveryTimeInDays, setDeliveryTimeInDays] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSubServices, setLoadingSubServices] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

const token = getToken();
  // Initialize form with existing project data if in edit mode
  useEffect(() => {
    if (open) {
      if (isEditMode && existingProject) {
        setTitle(existingProject.title || "");
        setDescription(existingProject.description || "");
        setServiceId(existingProject.serviceId || "");
        setSubServiceId(existingProject.subServiceId || "");
        setPoints(existingProject.points?.toString() || "");
        setDeliveryTimeInDays(
          existingProject.deliveryTimeInDays?.toString() || ""
        );
        setTags(existingProject.tags || []);

        // Set existing image preview
        if (existingProject.img) {
          setImagePreview(`https://uni1swap.runasp.net/${existingProject.img}`);
        }

        // Set existing file name
        if (existingProject.filePath) {
          setFileName(existingProject.filePath.split("/").pop());
        }
      } else {
        setTitle(projectTitle || "");
        setDescription(projectDescription || "");
        setPoints(projectPoints?.toString() || "0");
      }
      fetchServices();
    }
  }, [
    open,
    isEditMode,
    existingProject,
    projectTitle,
    projectDescription,
    projectPoints,
  ]);

  useEffect(() => {
    if (serviceId) {
      fetchSubServices(serviceId);
    } else {
      setSubServices([]);
      if (!isEditMode) {
        setSubServiceId("");
      }
    }
  }, [serviceId]);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await getServices(token);
      console.log("📦 Services fetched:", response.data);
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Error fetching services:", error);
      setSnackbar({
        open: true,
        message: "Failed to load services",
        severity: "error",
      });
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchSubServices = async (serviceId) => {
    try {
      setLoadingSubServices(true);
      const response = await getSubServices(token, serviceId);
      console.log("📦 SubServices fetched:", response.data);
      setSubServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Error fetching subservices:", error);
      setSnackbar({
        open: true,
        message: "Failed to load subservices",
        severity: "error",
      });
      setSubServices([]);
    } finally {
      setLoadingSubServices(false);
    }
  };

  const handleServiceChange = (e) => {
    const selectedServiceId = e.target.value;
    setServiceId(selectedServiceId);
    if (!isEditMode) {
      setSubServiceId("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "File size should be less than 10MB",
          severity: "error",
        });
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
  };

  // For edit mode, image is optional if already exists
  const isFormValid = isEditMode
    ? title.trim() !== "" &&
      description.trim() !== "" &&
      subServiceId !== "" &&
      points !== "" &&
      deliveryTimeInDays !== ""
    : title.trim() !== "" &&
      description.trim() !== "" &&
      serviceId !== "" &&
      subServiceId !== "" &&
      points !== "" &&
      deliveryTimeInDays !== "" &&
      image !== null;

  const handleSubmit = async () => {
    if (!isFormValid) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("SubServiceId", subServiceId);
      formData.append("Points", parseInt(points));
      formData.append("DeliveryTimeInDays", parseInt(deliveryTimeInDays));

      if (image) {
        formData.append("Img", image);
      }

      if (file) {
        formData.append("File", file);
      }

      if (tags.length > 0) {
        tags.forEach((tag) => {
          formData.append("Tags", tag);
        });
      }

      let response;
      if (isEditMode) {
        console.log("📤 Editing published project:", publishProjectId);
        response = await editPublishProject(token, publishProjectId, formData);
        console.log("✅ Project updated successfully:", response);

        setSnackbar({
          open: true,
          message: "Project updated successfully! 🎉",
          severity: "success",
        });

        setTimeout(() => {
          handleClose();
          if (onEditSuccess) {
            onEditSuccess(response.data);
          }
        }, 1500);
      } else {
        console.log("📤 Publishing project:", {
          projectId,
          serviceId,
          subServiceId,
        });
        response = await publishFromCompletedProject(
          token,
          projectId,
          formData
        );
        console.log("✅ Project published successfully:", response);

        setSnackbar({
          open: true,
          message: "Project published successfully! 🎉",
          severity: "success",
        });

        setTimeout(() => {
          handleClose();
          if (onPublishSuccess) {
            onPublishSuccess(response.data);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        `Failed to ${
          isEditMode ? "update" : "publish"
        } project. Please try again.`;

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setServiceId("");
    setSubServiceId("");
    setPoints("");
    setDeliveryTimeInDays("");
    setImage(null);
    setImagePreview(null);
    setFile(null);
    setFileName("");
    setTags([]);
    setCurrentTag("");
    setIsSubmitting(false);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <GenericModal
      open={open}
      onClose={handleClose}
      title={
        isEditMode ? "Edit Published Project" : "Publish Project to Browse"
      }
      icon={
        isEditMode ? (
          <EditIcon sx={{ color: "#3b82f6" }} />
        ) : (
          <PublishIcon sx={{ color: "#3b82f6" }} />
        )
      }
      headerInfo={
        <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
          {isEditMode
            ? "Update your published project details"
            : "Share your completed project with others on the Browse page"}
        </Typography>
      }
      primaryButtonText={isEditMode ? "Update Project" : "Publish Project"}
      primaryButtonIcon={isEditMode ? <EditIcon /> : <PublishIcon />}
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={!isFormValid || isSubmitting}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={handleSnackbarClose}
    >
      {/* Project Title */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
        >
          Project Title
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter a catchy title for your project"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          Description
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Describe what makes this project special..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Service & SubService Selection */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Service Selection */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            Service Category
          </Typography>
          <FormControl fullWidth>
            <Select
              value={serviceId}
              onChange={handleServiceChange}
              displayEmpty
              disabled={isSubmitting || loadingServices || isEditMode}
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
                {loadingServices ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <span>Loading services...</span>
                  </Box>
                ) : (
                  "Select Service"
                )}
              </MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* SubService Selection */}
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            SubService
          </Typography>
          <FormControl fullWidth>
            <Select
              value={subServiceId}
              onChange={(e) => setSubServiceId(e.target.value)}
              displayEmpty
              disabled={
                !serviceId || isSubmitting || loadingSubServices || isEditMode
              }
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
                {!serviceId ? (
                  "Select a service first"
                ) : loadingSubServices ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <span>Loading...</span>
                  </Box>
                ) : (
                  "Select SubService"
                )}
              </MenuItem>
              {subServices.map((subService) => (
                <MenuItem key={subService.id} value={subService.id}>
                  {subService.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Points & Delivery Time */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            Price (Points)
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="e.g., 150"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            disabled={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#3B82F6",
                      borderRadius: "50%",
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
        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            Delivery Time (Days)
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="e.g., 7"
            value={deliveryTimeInDays}
            onChange={(e) => {
              const value = Number(e.target.value);

              if (value < 1) return;

              setDeliveryTimeInDays(value);
            }}
            disabled={isSubmitting}
            inputProps={{ min: 1 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "46px",
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Helper text for delivery time */}
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: "11px",
          mt: -1.5,
          mb: 2,
          display: "block",
        }}
      >
        Estimated delivery time for similar projects
      </Typography>

      {/* Image Upload */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
        >
          Project Image{" "}
          {isEditMode ? "(Optional - leave blank to keep current)" : "*"}
        </Typography>
        {!imagePreview ? (
          <Box
            sx={{
              border: "2px dashed #E5E7EB",
              borderRadius: "8px",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#3B82F6",
                bgcolor: "#F0F9FF",
              },
            }}
            onClick={() => document.getElementById("image-upload").click()}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <ImageIcon sx={{ fontSize: 48, color: "#9CA3AF", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Click to upload project image
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PNG, JPG, GIF up to 5MB
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                },
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* File Upload (Optional) */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
        >
          Additional File (Optional)
        </Typography>
        {!file && !fileName ? (
          <Button
            variant="outlined"
            startIcon={<AttachFileIcon />}
            fullWidth
            onClick={() => document.getElementById("file-upload").click()}
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              height: "46px",
              borderStyle: "dashed",
            }}
          >
            Upload File
            <input
              id="file-upload"
              type="file"
              hidden
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          </Button>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              bgcolor: "#F3F4F6",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachFileIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body2">{fileName}</Typography>
            </Box>
            <IconButton size="small" onClick={handleRemoveFile}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Tags */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
        >
          Tags (Optional)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            placeholder="Add tags (e.g., React, Design, Modern)"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "46px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddTag}
            disabled={!currentTag.trim() || isSubmitting}
            sx={{
              minWidth: "46px",
              width: "46px",
              height: "46px",
              p: 0,
              background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        {tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                sx={{ bgcolor: "rgb(0 0 0 / 6%)" }}
              />
            ))}
          </Box>
        )}
      </Box>
    </GenericModal>
  );
};

export default PublishProjectModal;
