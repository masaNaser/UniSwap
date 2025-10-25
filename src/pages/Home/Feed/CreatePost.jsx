import React, { useState } from 'react';
import {
  Box, Typography, Avatar, TextField, Stack, IconButton, alpha, styled, Chip
} from '@mui/material';
import { Image, Close as CloseIcon } from '@mui/icons-material';
import ProfilePic from '../../../assets/images/ProfilePic.jpg';
import CustomButton from "../../../components/CustomButton/CustomButton";
import DisabledCustomButton from "../../../components/CustomButton/DisabledCustomButton";
import { createPost as createPostApi } from "../../../services/postService";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  margin: '40px auto',
  [theme.breakpoints.down('md')]: { maxWidth: '100%' },
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(2), margin: '20px auto' },
}));

const CreatePost = ({ addPost, token }) => {
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({ content: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const characterLimit = 500;

  // 💡 Condition to disable the post button
  const isPostDisabled = content.trim().length === 0;

  const handleContentChange = (event) => {
    if (event.target.value.length <= characterLimit) setContent(event.target.value);
    if (errors.content && event.target.value.trim() !== '') setErrors({ content: '' });
  };

  const handleTagInputChange = (event) => setTagInput(event.target.value);
  const handleTagKeyDown = (event) => {
    if ((event.key === 'Enter' || event.key === ',') && tagInput.trim()) {
      event.preventDefault();
      const newTag = tagInput.trim();
      if (!selectedTags.includes(newTag) && selectedTags.length < 5) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput('');
    }
  };
  const handleTagDelete = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('upload-image');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Since the button is disabled if content is empty, we don't need a content check here.
    if (isPostDisabled) return;

    const formData = new FormData();
    formData.append('Content', content);
    formData.append('Tags', selectedTags);
    if (file) formData.append('File', file);

    try {
      const response = await createPostApi(formData, token);
      const postData = response.data;
      console.log("postData:", postData);
      const newPost = {
        id: postData.id,
        content: postData.content,
        selectedTags: postData.tags?.[0]?.split(',') || [],
        user: { name: postData.author.userName, avatar: ProfilePic },
        time: new Date(postData.createdAt || Date.now()).toLocaleTimeString(),
        likes: postData.likesCount,
        comments: postData.commentsCount,
        shares: 0,
        fileUrl: postData.fileUrl ? `https://uni.runasp.net/${postData.fileUrl}` : null,
      };

      addPost(newPost);
      setContent('');
      setSelectedTags([]);
      setTagInput('');
      setErrors({ content: '' });
      setFile(null);
      setImagePreview(null);

      if (response.status === 201) {
        Swal.fire({ title: "Post has been created successfully.", icon: "success", timer: 3000 });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Swal.fire({ icon: "error", title: "Error creating post", text: 'Failed to create post. Please try again.', timer: 3000 });
    }
  };

  const iconHover = { '&:hover': { color: 'primary.main' } };

  return (
    <FormWrapper component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar src={ProfilePic} alt="User Avatar" />
        <TextField
          multiline fullWidth variant="outlined"
          placeholder="What's on your mind? Share your thoughts..."
          value={content} onChange={handleContentChange}
          error={!!errors.content}
          helperText={errors.content || `${content.length}/${characterLimit} characters`}
          sx={{
            flexGrow: 1,
            backgroundColor: '#FFF',
            borderRadius: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              padding: 1.5,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7eadf8ff', boxShadow: '0 0 0 2px rgba(59,130,246,0.2)' },
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#94A3B8', 0.5) },
          }}
          inputProps={{ style: { minHeight: '80px' } }}
        />
      </Box>

      <Stack direction="column" spacing={2}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Tags (max 5)</Typography>
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
              <Chip key={tag} label={`#${tag}`} onDelete={() => handleTagDelete(tag)} color="primary" sx={{ fontWeight: 'bold', bgcolor: alpha('#0b62f0ff', 0.5) }} />
            ))}
          </Stack>
        </Box>
      </Stack>

      {imagePreview && (
        <Box sx={{ position: "relative", display: "inline-block", mt: 2 }}>
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
      )}

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Stack direction="row" spacing={1} sx={{ color: 'text.secondary' }}>
          <input accept="image/*" type="file" id="upload-image" style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="upload-image">
            <IconButton component="span" sx={iconHover}><Image /></IconButton>
          </label>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          {/* Conditional Component Rendering based on post content */}
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
  );
};

export default CreatePost;