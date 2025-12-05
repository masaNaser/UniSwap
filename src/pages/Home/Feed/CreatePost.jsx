import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Stack,
  IconButton,
  alpha,
  styled,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { Image, Close as CloseIcon, AttachFile } from "@mui/icons-material";
import CustomButton from "../../../components/CustomButton/CustomButton";
import DisabledCustomButton from "../../../components/CustomButton/DisabledCustomButton";
import { createPost as createPostApi } from "../../../services/postService";
import { getImageUrl } from "../../../utils/imageHelper";
import { useProfile } from "../../../Context/ProfileContext";
import { useCurrentUser } from "../../../Context/CurrentUserContext";
import { formatTime } from "../../../utils/timeHelper";
import { useTheme } from "@mui/material/styles";

const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor:theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
  margin: "40px auto",
  [theme.breakpoints.down("md")]: { maxWidth: "100%" },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    margin: "20px auto",
  },
}));

const CreatePost = ({ addPost, token }) => {

      const theme = useTheme(); // 🔥 ضيفي هاد السطر
  
  const { userData } = useProfile();
  const { currentUser } = useCurrentUser();

  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({ content: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const characterLimit = 500;

  const isPostDisabled = content.trim().length === 0;

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleContentChange = (event) => {
    if (event.target.value.length <= characterLimit)
      setContent(event.target.value);
    if (errors.content && event.target.value.trim() !== "")
      setErrors({ content: "" });
  };

  const handleTagInputChange = (event) => setTagInput(event.target.value);
  
  const handleTagKeyDown = (event) => {
    if ((event.key === "Enter" || event.key === ",") && tagInput.trim()) {
      event.preventDefault();
      const newTag = tagInput.trim();
      if (!selectedTags.includes(newTag) && selectedTags.length < 5) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput("");
    }
  };
  
  const handleTagDelete = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setSnackbar({
          open: true,
          message: "File size must be less than 10MB",
          severity: "error",
        });
        return;
      }

      setFile(selectedFile);
      
      // Create preview only for images
      if (selectedFile.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleDocumentChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setSnackbar({
          open: true,
          message: "File size must be less than 10MB",
          severity: "error",
        });
        return;
      }

      setFile(selectedFile);
      setImagePreview(null); // No preview for documents
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImagePreview(null);
    const imageInput = document.getElementById("upload-image");
    const docInput = document.getElementById("upload-document");
    if (imageInput) imageInput.value = "";
    if (docInput) docInput.value = "";
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  if (isPostDisabled) return;

  const formData = new FormData();
  formData.append("Content", content);
  formData.append("Tags", selectedTags);
  if (file) formData.append("File", file);

  try {
    const response = await createPostApi(formData, token);
    const postData = response.data;
    console.log("postData:", postData);
    
    // ✅ استخدام currentUser بدل postData.author
    const newPost = {
      id: postData.id,
      content: postData.content,
      selectedTags: postData.tags?.[0]?.split(",") || [],
      user: { 
        name: currentUser?.userName, // ✅
        avatar: getImageUrl(currentUser?.profilePicture, currentUser?.userName), // ✅
        id: currentUser?.id, // ✅
      },
      time: formatTime(postData.createdAt),
      likes: 0, // ✅ بوست جديد
      comments: 0, // ✅ بوست جديد
      fileUrl: postData.fileUrl
        ? `https://uni.runasp.net/${postData.fileUrl}`
        : null,
      isLiked: false,
      recentComments: [],
      isClosed: postData.postStatus === "Closed",
    };

    addPost(newPost);
    setContent("");
    setSelectedTags([]);
    setTagInput("");
    setErrors({ content: "" });
    setFile(null);
    setImagePreview(null);

    if (response.status === 201) {
      setSnackbar({
        open: true,
        message: "Post has been created successfully! 🎉",
        severity: "success",
      });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    setSnackbar({
      open: true,
      message: "Failed to create post. Please try again.",
      severity: "error",
    });
  }
};

  const iconHover = { "&:hover": { color: "primary.main" } };

  return (
    <>
      <FormWrapper component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Avatar
            src={getImageUrl(currentUser?.profilePicture, currentUser?.userName)}
            alt={currentUser?.userName || "User"}
          />
          <TextField
            multiline
            fullWidth
            variant="outlined"
            placeholder="What's on your mind? Share your thoughts..."
            value={content}
            onChange={handleContentChange}
            error={!!errors.content}
            helperText={
              errors.content || `${content.length}/${characterLimit} characters`
            }
            sx={{
              flexGrow: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                padding: 1.5,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7eadf8ff",
                  boxShadow: "0 0 0 2px rgba(59,130,246,0.2)",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha("#94A3B8", 0.5),
              },
            }}
            inputProps={{ style: { minHeight: "80px" } }}
          />
        </Box>

        <Stack direction="column" spacing={2}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              Tags (max 5)
            </Typography>
            <TextField
              placeholder="Enter tags and press Enter"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              fullWidth
              variant="outlined"
              size="small"
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onDelete={() => handleTagDelete(tag)}
                  color="primary"
                  sx={{ fontWeight: "bold", bgcolor: alpha("#0b62f0ff", 0.5) }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* File Preview Section */}
        {file && (
          <Box sx={{ position: "relative", mt: 2 }}>
            {imagePreview ? (
              // Image Preview
              <Box sx={{ display: "inline-block", position: "relative" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
                <IconButton
                  onClick={handleRemoveFile}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    bgcolor: "rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              // Document Preview
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  bgcolor: alpha("#0b62f0ff", 0.1),
                  borderRadius: "8px",
                  border: `1px solid ${alpha("#0b62f0ff", 0.3)}`,
                  maxWidth: "400px",
                }}
              >
                <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>
                  📎 {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </Typography>
                <IconButton onClick={handleRemoveFile} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={1} sx={{ color: "text.secondary" }}>
            {/* Image Upload */}
            <input
              accept="image/*"
              type="file"
              id="upload-image"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-image">
              <IconButton component="span" sx={iconHover} title="Upload Image">
                <Image />
              </IconButton>
            </label>

            {/* Document Upload */}
            <input
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
              type="file"
              id="upload-document"
              style={{ display: "none" }}
              onChange={handleDocumentChange}
            />
            <label htmlFor="upload-document">
              <IconButton component="span" sx={iconHover} title="Upload Document">
                <AttachFile />
              </IconButton>
            </label>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {isPostDisabled ? (
              <DisabledCustomButton
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  padding: "10px 30px",
                }}
              >
                Post
              </DisabledCustomButton>
            ) : (
              <CustomButton
                type="submit"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  padding: "10px 30px",
                }}
              >
                Post
              </CustomButton>
            )}
          </Stack>
        </Stack>
      </FormWrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            bgcolor: snackbar.severity === "success" ? "#3b82f6" : "#EF4444",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreatePost;