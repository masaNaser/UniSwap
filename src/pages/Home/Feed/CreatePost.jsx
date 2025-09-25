// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Typography,
// //   Avatar,
// //   TextField,
// //   Stack,
// //   IconButton,
// //   alpha,
// //   styled,
// //   Chip,
// // } from '@mui/material';
// // import { Image, InsertDriveFile } from '@mui/icons-material';
// // import ProfilePic from '../../../assets/images/ProfilePic.jpg';
// // import CustomButton from "../../../shared/CustomButton/CustomButton";
// // import { createPost as createPostApi } from "../../../services/postService";
// // import Swal from "sweetalert2";
// // import "sweetalert2/dist/sweetalert2.min.css";
// // const FormWrapper = styled(Box)(({ theme }) => ({
// //   backgroundColor: 'white',
// //   padding: theme.spacing(3),
// //   borderRadius: '12px',
// //   boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
// //   display: 'flex',
// //   flexDirection: 'column',
// //   gap: theme.spacing(2),
// //   width: '100%',
// //   margin: '40px auto',
// //   [theme.breakpoints.down('md')]: { maxWidth: '100%' },
// //   [theme.breakpoints.down('sm')]: { padding: theme.spacing(2), margin: '20px auto' },
// // }));

// // const CreatePost = ({ addPost, token }) => {
// //   const [content, setContent] = useState('');
// //   const [tagInput, setTagInput] = useState('');
// //   const [selectedTags, setSelectedTags] = useState([]);
// //   const [errors, setErrors] = useState({ content: '' });
// //   const [media, setMedia] = useState({ image: null, file: null });

// //   const characterLimit = 500;

// //   const handleContentChange = (event) => {
// //     if (event.target.value.length <= characterLimit) setContent(event.target.value);
// //     if (errors.content && event.target.value.trim() !== '') setErrors((prev) => ({ ...prev, content: '' }));
// //   };

// //   const handleTagInputChange = (event) => setTagInput(event.target.value);

// //   const handleTagKeyDown = (event) => {
// //     if ((event.key === 'Enter' || event.key === ',') && tagInput.trim()) {
// //       event.preventDefault();
// //       const newTag = tagInput.trim();
// //       if (!selectedTags.includes(newTag) && selectedTags.length < 5) {
// //         setSelectedTags([...selectedTags, newTag]);
// //       }
// //       setTagInput('');
// //     }
// //   };

// //   const handleTagDelete = (tagToDelete) => {
// //     setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
// //   };

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();

// //     if (!content.trim()) {
// //       setErrors({ content: 'Please enter post content' });
// //       return;
// //     }

// //     // إعداد FormData
// //     const formData = new FormData();
// //     formData.append('Content', content);
// //     formData.append('Tags', selectedTags); // نفصلهم بفاصلة
// //     if (media.file) formData.append('File', media.file);

// //     try {
// //       const response = await createPostApi(formData, token);
// //      console.log(response);
// //      //أخذ بيانات البوست الجديد
// //       const postData = response.data;

// //       // إضافة البوست الجديد في الواجهة
// //       const newPost = {
// //         user: {name:response.data.author.userName, avatar: ProfilePic},
// //         time: new Date().toLocaleTimeString(),
// //         likes: postData.likesCount || 0,
// //         comments: postData.commentsCount || 0,
// //         shares: 0,
// //         content: postData.content,
// //         selectedTags:postData.tags,
// //         image: media.image || postData.fileUrl || null, // هنا
// //         id: postData.id,
// //       };
// //       addPost(newPost);

// //       // Reset form
// //       //بعد إنشاء البوست، الفورم يرجع لحالته الابتدائية (فارغ وجاهز لبوست جديد).
// //       setContent('');
// //       setSelectedTags([]);
// //       setTagInput('');
// //       setErrors({ content: '' });
// //       setMedia({ image: null, file: null });

// //         if (response.status === 201) {
// //             Swal.fire({
// //               title: "Post has been create successfully.",
// //               icon: "success",
// //               draggable: true,
// //               timer: 3000,
// //             });}
// //     } catch (error) {
// //       console.error('Error creating post:', error);
// //       Swal.fire({
// //               icon: "error",
// //               title: "Error creating post",
// //               text: 'Failed to create post. Please try again.',
// //               timer: 3000,
// //             });
// //     }
// //   };

// //   const iconHover = { '&:hover': { color: 'primary.main' } };

// //   return (
// //     <FormWrapper component="form" onSubmit={handleSubmit}>
// //       <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
// //         <Avatar src={ProfilePic} alt="User Avatar" />
// //         <TextField
// //           multiline
// //           fullWidth
// //           variant="outlined"
// //           placeholder="What's on your mind? Share your thoughts..."
// //           value={content}
// //           onChange={handleContentChange}
// //           error={!!errors.content}
// //           helperText={errors.content || `${content.length}/${characterLimit} characters`}
// //           sx={{
// //             flexGrow: 1,
// //             backgroundColor: '#FFF',
// //             borderRadius: 3,
// //             '& .MuiOutlinedInput-root': {
// //               borderRadius: 3,
// //               padding: 1.5,
// //               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
// //                 borderColor: '#7eadf8ff',
// //                 boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
// //               },
// //             },
// //             '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#94A3B8', 0.5) },
// //           }}
// //           inputProps={{ style: { minHeight: '80px' } }}
// //         />
// //       </Box>

// //       <Stack direction="column" spacing={2}>
// //         <Box>
// //           <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Tags (max 5)</Typography>
// //           <TextField
// //             placeholder="Enter tags and press Enter"
// //             value={tagInput}
// //             onChange={handleTagInputChange}
// //             onKeyDown={handleTagKeyDown}
// //             fullWidth
// //             variant="outlined"
// //             size="small"
// //           />
// //           <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
// //             {selectedTags.map((tag) => (
// //               <Chip
// //                 key={tag}
// //                 label={`#${tag}`}
// //                 onDelete={() => handleTagDelete(tag)}
// //                 color="primary"
// //                 sx={{ fontWeight: 'bold', bgcolor: alpha('#0b62f0ff', 0.5) }}
// //               />
// //             ))}
// //           </Stack>
// //         </Box>
// //       </Stack>

// //       <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
// //         <Stack direction="row" spacing={1} sx={{ color: 'text.secondary' }}>
// //           <input
// //             accept="image/*"
// //             type="file"
// //             id="upload-image"
// //             style={{ display: 'none' }}
// //             onChange={(e) => {
// //               const file = e.target.files[0];
// //               if (file) setMedia((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
// //             }}
// //           />
// //           <label htmlFor="upload-image">
// //             <IconButton component="span" sx={iconHover}><Image /></IconButton>
// //           </label>

// //           <input
// //             type="file"
// //             id="upload-file"
// //             style={{ display: 'none' }}
// //             onChange={(e) => {
// //               const file = e.target.files[0];
// //               if (file) setMedia((prev) => ({ ...prev, file }));
// //             }}
// //           />
// //           <label htmlFor="upload-file">
// //             <IconButton component="span" sx={iconHover}><InsertDriveFile /></IconButton>
// //           </label>
// //         </Stack>

// //         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
// //           <CustomButton sx={{ width: { xs: "100%", sm: "auto" } }}>Save Draft</CustomButton>
// //           <CustomButton type="submit" sx={{ width: { xs: "100%", sm: "auto" } }}>Post</CustomButton>
// //         </Stack>
// //       </Stack>
// //     </FormWrapper>
// //   );
// // };

// // export default CreatePost;

 import React, { useState } from 'react';
import {
  Box, Typography, Avatar, TextField, Stack, IconButton, alpha, styled, Chip
} from '@mui/material';
import { Image, InsertDriveFile } from '@mui/icons-material';
import ProfilePic from '../../../assets/images/ProfilePic.jpg';
import CustomButton from "../../../shared/CustomButton/CustomButton";
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
  // const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const characterLimit = 500;

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
      setFile(selectedFile); // للإرسال للـ API
      setImagePreview(URL.createObjectURL(selectedFile)); // للمعاينة فقط
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setErrors({ content: 'Please enter post content' });
      return;
    }

    const formData = new FormData();
    formData.append('Content', content);
    formData.append('Tags', selectedTags);
    if (file) formData.append('File', file);

    try {
      const response = await createPostApi(formData, token);
      const postData = response.data;
     console.log("postData:",postData);
      const newPost = {
        id: postData.id,
        content: postData.content,
        selectedTags: postData.tags?.[0]?.split(',') || [],
        user: { name: postData.author.userName, avatar: ProfilePic },
        time: new Date(postData.createdAt || Date.now()).toLocaleTimeString(),
        likes: postData.likesCount,
        comments: postData.commentsCount,
        shares: 0,
        fileUrl: postData.fileUrl ? `https://uniswap.runasp.net/${postData.fileUrl}` : null,
      };

      addPost(newPost);

      // Reset form
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
          {/* عرض الصورة قبل الإرسال */}
      {imagePreview && (
        <Box sx={{ mt: 2 }}>
          <img src={imagePreview} alt="Preview" style={{ width: '150px', borderRadius: '8px' }} />
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
          <CustomButton sx={{ width: { xs: "100%", sm: "auto" } }}>Save Draft</CustomButton>
          <CustomButton type="submit" sx={{ width: { xs: "100%", sm: "auto" } }}>Post</CustomButton>
        </Stack>
      </Stack>
    </FormWrapper>
  );
};

export default CreatePost;


// import React, { useState } from 'react';
// import {
//   Box, Typography, Avatar, TextField, Stack, IconButton, alpha, styled, Chip
// } from '@mui/material';
// import { Image, InsertDriveFile } from '@mui/icons-material';
// import ProfilePic from '../../../assets/images/ProfilePic.jpg';
// import CustomButton from "../../../shared/CustomButton/CustomButton";
// import { createPost as createPostApi } from "../../../services/postService";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";

// const FormWrapper = styled(Box)(({ theme }) => ({
//   backgroundColor: 'white',
//   padding: theme.spacing(3),
//   borderRadius: '12px',
//   boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: theme.spacing(2),
//   width: '100%',
//   margin: '40px auto',
//   [theme.breakpoints.down('md')]: { maxWidth: '100%' },
//   [theme.breakpoints.down('sm')]: { padding: theme.spacing(2), margin: '20px auto' },
// }));

// const CreatePost = ({ addPost, token }) => {
//   const [content, setContent] = useState('');
//   const [tagInput, setTagInput] = useState('');
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [errors, setErrors] = useState({ content: '' });
//   const [image, setImage] = useState(null); // رابط العرض المؤقت
//   const [file, setFile] = useState(null);   // الملف الحقيقي للرفع

//   const characterLimit = 500;

//   const handleContentChange = (event) => {
//     if (event.target.value.length <= characterLimit) setContent(event.target.value);
//     if (errors.content && event.target.value.trim() !== '') setErrors({ content: '' });
//   };

//   const handleTagInputChange = (event) => setTagInput(event.target.value);
//   const handleTagKeyDown = (event) => {
//     if ((event.key === 'Enter' || event.key === ',') && tagInput.trim()) {
//       event.preventDefault();
//       const newTag = tagInput.trim();
//       if (!selectedTags.includes(newTag) && selectedTags.length < 5) {
//         setSelectedTags([...selectedTags, newTag]);
//       }
//       setTagInput('');
//     }
//   };
//   const handleTagDelete = (tagToDelete) => {
//     setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!content.trim()) {
//       setErrors({ content: 'Please enter post content' });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('Content', content);
//     formData.append('Tags', selectedTags);
//     if (file) formData.append('File', file);

//     try {
//       const response = await createPostApi(formData, token);
//       const postData = response.data;

//       const newPost = {
//         id: postData.id,
//         content: postData.content,
//         selectedTags: postData.tags?.[0]?.split(',') || [],
//         user: { name: postData.author.userName, avatar: ProfilePic },
//         time: new Date(postData.createdAt || Date.now()).toLocaleTimeString(),
//         likes: postData.likesCount || 0,
//         comments: postData.commentsCount || 0,
//         shares: 0,
//         image: postData.fileUrl || null, // عرض الصورة المؤقت إذا موجود
//       };

//       addPost(newPost);

//       // Reset form
//       setContent('');
//       setSelectedTags([]);
//       setTagInput('');
//       setErrors({ content: '' });
//       setImage(null);
//       setFile(null);

//       if (response.status === 201) {
//         Swal.fire({ title: "Post has been created successfully.", icon: "success", timer: 3000 });
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//       Swal.fire({ icon: "error", title: "Error creating post", text: 'Failed to create post. Please try again.', timer: 3000 });
//     }
//   };

//   const iconHover = { '&:hover': { color: 'primary.main' } };

//   return (
//     <FormWrapper component="form" onSubmit={handleSubmit}>
//       <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
//         <Avatar src={ProfilePic} alt="User Avatar" />
//         <TextField
//           multiline fullWidth variant="outlined"
//           placeholder="What's on your mind? Share your thoughts..."
//           value={content} onChange={handleContentChange}
//           error={!!errors.content}
//           helperText={errors.content || `${content.length}/${characterLimit} characters`}
//           sx={{
//             flexGrow: 1,
//             backgroundColor: '#FFF',
//             borderRadius: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 3,
//               padding: 1.5,
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7eadf8ff', boxShadow: '0 0 0 2px rgba(59,130,246,0.2)' },
//             },
//             '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#94A3B8', 0.5) },
//           }}
//           inputProps={{ style: { minHeight: '80px' } }}
//         />
//       </Box>

//       <Stack direction="column" spacing={2}>
//         <Box>
//           <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Tags (max 5)</Typography>
//           <TextField
//             placeholder="Enter tags and press Enter"
//             value={tagInput}
//             onChange={handleTagInputChange}
//             onKeyDown={handleTagKeyDown}
//             fullWidth
//             variant="outlined"
//             size="small"
//           />
//           <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
//             {selectedTags.map((tag) => (
//               <Chip key={tag} label={`#${tag}`} onDelete={() => handleTagDelete(tag)} color="primary" sx={{ fontWeight: 'bold', bgcolor: alpha('#0b62f0ff', 0.5) }} />
//             ))}
//           </Stack>
//         </Box>
//       </Stack>

//       {/* عرض الصورة قبل الإرسال */}
//       {image && (
//         <Box sx={{ mt: 2 }}>
//           <img src={image} alt="Preview" style={{ width: '150px', borderRadius: '8px' }} />
//         </Box>
//       )}

//       <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
//         <Stack direction="row" spacing={1} sx={{ color: 'text.secondary' }}>
//           <input accept="image/*" type="file" id="upload-image" style={{ display: 'none' }}
//             onChange={(e) => {
//               const selectedFile = e.target.files[0];
//               if (selectedFile) {
//                 setFile(selectedFile); // الملف للرفع
//                 setImage(URL.createObjectURL(selectedFile)); // رابط العرض
//               }
//             }}
//           />
//           <label htmlFor="upload-image">
//             <IconButton component="span" sx={iconHover}><Image /></IconButton>
//           </label>
//         </Stack>

//         <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//           <CustomButton sx={{ width: { xs: "100%", sm: "auto" } }}>Save Draft</CustomButton>
//           <CustomButton type="submit" sx={{ width: { xs: "100%", sm: "auto" } }}>Post</CustomButton>
//         </Stack>
//       </Stack>
//     </FormWrapper>
//   );
// };

// export default CreatePost;
