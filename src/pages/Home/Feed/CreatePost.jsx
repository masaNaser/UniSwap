// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Typography,
// //   Avatar,
// //   TextField,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Chip,
// //   Button,
// //   IconButton,
// //   Stack,
// //   alpha,
// //   styled,
// //   FormHelperText,
// // } from '@mui/material';
// // import { Image, InsertDriveFile, Link, MoreHoriz } from '@mui/icons-material';
// // import ProfilePic from '../../../assets/images/ProfilePic.jpg';
// // import CustomButton from '../../../components/CustomButton/CustomButton';

// // const FormWrapper = styled(Box)(({ theme }) => ({
// //   backgroundColor: 'white',
// //   padding: theme.spacing(3),
// //   borderRadius: '12px',
// //   boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
// //   display: 'flex',
// //   flexDirection: 'column',
// //   gap: theme.spacing(2),
// //    width: '100%',
// //   // maxWidth: '990px',
// //   margin: '40px auto',

// //   [theme.breakpoints.down('md')]: {   // أقل من 900px
// //     maxWidth: '100%',
// //   },
// //   [theme.breakpoints.down('sm')]: {   // أقل من 600px (موبايل)
// //     padding: theme.spacing(2),
// //     margin: '20px auto',
// //   },
// // }));



// // const userAvatar = ProfilePic;
// // const categories = ['Web Development', 'Graphic Design', 'Data Analysis', 'Writing & Translation'];
// // const tags = ['WebDevelopment', 'UIUXDesign', 'DataScience', 'StudyGroup', 'Collaboration', 'Programming'];

// // const CreatePost = () => {
// //   const [content, setContent] = useState('');
// //   const [category, setCategory] = useState('');
// //   const [selectedTags, setSelectedTags] = useState([]);
// //   const [errors, setErrors] = useState({ content: '', category: '' });
// //   const characterLimit = 500;

// //   const handleContentChange = (event) => {
// //     if (event.target.value.length <= characterLimit) {
// //       setContent(event.target.value);
// //     }
// //     if (errors.content && event.target.value.trim() !== '') {
// //       setErrors((prev) => ({ ...prev, content: '' }));
// //     }
// //   };

// //   const handleCategoryChange = (event) => {
// //     setCategory(event.target.value);
// //     if (errors.category && event.target.value) {
// //       setErrors((prev) => ({ ...prev, category: '' }));
// //     }
// //   };

// //   const handleTagClick = (tag) => {
// //     if (selectedTags.includes(tag)) {
// //       setSelectedTags(selectedTags.filter((t) => t !== tag));
// //     } else if (selectedTags.length < 5) {
// //       setSelectedTags([...selectedTags, tag]);
// //     }
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     let newErrors = { content: '', category: '' };
// //     let hasError = false;

// //     if (!content.trim()) {
// //       newErrors.content = 'Please enter post content';
// //       hasError = true;
// //     }
// //     if (!category) {
// //       newErrors.category = 'Please select a category';
// //       hasError = true;
// //     }

// //     if (hasError) {
// //       setErrors(newErrors);
// //       return;
// //     }

// //     console.log('Submitting post:', { content, category, selectedTags });

// //     setContent('');
// //     setCategory('');
// //     setSelectedTags([]);
// //     setErrors({ content: '', category: '' });
// //   };

// //   const iconHover = { '&:hover': { color: 'primary.main' } };

// //   return (
// //     <FormWrapper component="form" onSubmit={handleSubmit}>
// //       <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
// //         <Avatar src={userAvatar} alt="User Avatar" />
// //         <TextField
// //           multiline
// //           fullWidth
// //           variant="outlined"
// //           placeholder="What's on your mind? Share your thoughts, achievements, or ask for help..."
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
// //                 borderColor: '#3B82F6',
// //                 boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
// //               },
// //             },
// //             '& .MuiOutlinedInput-notchedOutline': {
// //               borderColor: alpha('#94A3B8', 0.5),
// //             },
// //           }}
// //           inputProps={{ style: { minHeight: '80px' } }}
// //         />
// //       </Box>

// //       <Stack direction="column" spacing={2} >
// //         <Box>
// //           <Typography variant="body1"  sx={{ fontWeight: 'bold', mb: 1 }}>
// //             Category
// //           </Typography>
// //           <FormControl fullWidth size="small"  sx={{ backgroundColor: '#FFF', borderRadius: 1 }} error={!!errors.category}>
// //             <InputLabel id="category-label">Select category</InputLabel>
// //             <Select
// //               labelId="category-label"
// //               value={category}
// //               label="Select category"
// //               onChange={handleCategoryChange}
// //               sx={{
// //                 backgroundColor: '#F9FAFB',
// //                 borderRadius: 2,
// //                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
// //                   borderColor: '#3B82F6',
// //                   boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
// //                 },
// //               }}
// //             >
// //               <MenuItem value="" bgcolor="red">
// //                 <em>None</em>
// //               </MenuItem>
// //               {categories.map((cat) => (
// //                 <MenuItem key={cat} value={cat}>
// //                   {cat}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //             <FormHelperText>{errors.category}</FormHelperText>
// //           </FormControl>
// //         </Box>

// //         <Box>
// //           <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
// //             Tags (max 5)
// //           </Typography>
// //           <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ '& > *': { mb: 1 } }}>
// //             {tags.map((tag) => (
// //               <Chip
// //                 key={tag}
// //                 label={`#${tag}`}
// //                 variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
// //                 color={selectedTags.includes(tag) ? 'primary' : 'default'}
// //                 onClick={() => handleTagClick(tag)}
// //                 sx={{
// //                   cursor: 'pointer',
// //                   fontWeight: 'bold',
// //                   bgcolor: selectedTags.includes(tag) ? alpha('#3b82f6', 0.15) : alpha('#fff'),
// //                 }}
// //               />
// //             ))}
// //           </Stack>
// //         </Box>
// //       </Stack>

// //       <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">

// //         <Stack direction="row" spacing={1} sx={{ color: 'text.secondary' }}>
// //           <IconButton sx={iconHover} aria-label="add photo"><Image /></IconButton>
// //           <IconButton sx={iconHover} aria-label="add file"><InsertDriveFile /></IconButton>
// //           <IconButton sx={iconHover} aria-label="add link"><Link /></IconButton>
// //           <IconButton sx={iconHover} aria-label="more options"><MoreHoriz /></IconButton>
          
// //         </Stack>
// //        {/*  Save Draft */}
// //         <Stack  direction={{ xs: "column", sm: "row" }} spacing={2}>
// //          <CustomButton sx={{ width: { xs: "100%", sm: "auto" } }}>Save Draft</CustomButton>
// //          <CustomButton type="submit" sx={{ width: { xs: "100%", sm: "auto" } }}>Post</CustomButton>
// //            {/* <Button 
// //          variant="outlined"
// //          sx={{ borderRadius: 8,
// //           borderColor: '#3b82f6',
// //           color: '#3b82f6',
// //           textTransform: "none",
// //             }}>
// //             Save Draft
// //         </Button> */}
// //       {/* <Button
// //          type="submit"
// //         variant="contained"
// //     sx={{
// //       borderRadius: 8,
// //       background: 'linear-gradient( #00C8FF , #8B5FF6)',
// //       color: 'white',
// //       transition: '0.2s',
// //       textTransform: "none",
// //       '&:hover': { filter: 'brightness(1.05)' },
// //     }}
// //   >
// //     Post
// //   </Button> */}
// //         </Stack>

// //       </Stack>
// //     </FormWrapper>
// //   );
// // };

// // export default CreatePost;


// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Avatar,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Stack,
//   IconButton,
//   alpha,
//   styled,
//   FormHelperText,
// } from '@mui/material';
// import { Image, InsertDriveFile, Link, MoreHoriz } from '@mui/icons-material';
// import ProfilePic from '../../../assets/images/ProfilePic.jpg';
// import CustomButton from '../../../components/CustomButton/CustomButton';


// //  تصميم الفورم باستخدام styled
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

// const userAvatar = ProfilePic;
// const categories = ['Web Development', 'Graphic Design', 'Data Analysis', 'Writing & Translation'];
// const tags = ['WebDevelopment', 'UIUXDesign', 'DataScience', 'StudyGroup', 'Collaboration', 'Programming'];

// const CreatePost = ({ addPost }) => {
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState('');
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [errors, setErrors] = useState({ content: '', category: '' });
//   const characterLimit = 500;

//   const handleContentChange = (event) => {
//     if (event.target.value.length <= characterLimit) setContent(event.target.value);
//     if (errors.content && event.target.value.trim() !== '') setErrors((prev) => ({ ...prev, content: '' }));
//   };

//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//     if (errors.category && event.target.value) setErrors((prev) => ({ ...prev, category: '' }));
//   };

//   const handleTagClick = (tag) => {
//     if (selectedTags.includes(tag)) {
//       setSelectedTags(selectedTags.filter((t) => t !== tag));
//     } else if (selectedTags.length < 5) {
//       setSelectedTags([...selectedTags, tag]);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     let newErrors = { content: '', category: '' };
//     let hasError = false;

//     if (!content.trim()) {
//       newErrors.content = 'Please enter post content';
//       hasError = true;
//     }
//     if (!category) {
//       newErrors.category = 'Please select a category';
//       hasError = true;
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       return;
//     }

//     const newPost = { content, category, selectedTags };

//     addPost(newPost); // نضيف البوست للـ Feed

//     setContent('');
//     setCategory('');
//     setSelectedTags([]);
//     setErrors({ content: '', category: '' });
//   };

//   const iconHover = { '&:hover': { color: 'primary.main' } };

//   return (
//     <FormWrapper component="form" onSubmit={handleSubmit}>
//       <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
//         <Avatar src={userAvatar} alt="User Avatar" />
//         <TextField
//           multiline
//           fullWidth
//           variant="outlined"
//           placeholder="What's on your mind? Share your thoughts, achievements, or ask for help..."
//           value={content}
//           onChange={handleContentChange}
//           error={!!errors.content}
//           helperText={errors.content || `${content.length}/${characterLimit} characters`}
//           sx={{
//             flexGrow: 1,
//             backgroundColor: '#FFF',
//             borderRadius: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 3,
//               padding: 1.5,
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3B82F6',
//                 boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
//               },
//             },
//             '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#94A3B8', 0.5) },
//           }}
//           inputProps={{ style: { minHeight: '80px' } }}
//         />
//       </Box>

//       <Stack direction="column" spacing={2}>
//         <Box>
//           <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Category</Typography>
//           <FormControl fullWidth size="small" sx={{ backgroundColor: '#FFF', borderRadius: 1 }} error={!!errors.category}>
//             <InputLabel id="category-label">Select category</InputLabel>
//             <Select
//               labelId="category-label"
//               value={category}
//               label="Select category"
//               onChange={handleCategoryChange}
//               sx={{
//                 backgroundColor: '#F9FAFB',
//                 borderRadius: 2,
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#3B82F6',
//                   boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
//                 },
//               }}
//             >
//               <MenuItem value="">
//                 <em>None</em>
//               </MenuItem>
//               {categories.map((cat) => (
//                 <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//               ))}
//             </Select>
//             <FormHelperText>{errors.category}</FormHelperText>
//           </FormControl>
//         </Box>

//         <Box>
//           <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Tags (max 5)</Typography>
//           <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ '& > *': { mb: 1 } }}>
//             {tags.map((tag) => (
//               <Chip
//                 key={tag}
//                 label={`#${tag}`}
//                 variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
//                 color={selectedTags.includes(tag) ? 'primary' : 'default'}
//                 onClick={() => handleTagClick(tag)}
//                 sx={{
//                   cursor: 'pointer',
//                   fontWeight: 'bold',
//                   bgcolor: selectedTags.includes(tag) ? alpha('#3b82f6', 0.15) : alpha('#fff'),
//                 }}
//               />
//             ))}
//           </Stack>
//         </Box>
//       </Stack>

//       <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
//         <Stack direction="row" spacing={1} sx={{ color: 'text.secondary' }}>
//           <IconButton sx={iconHover} aria-label="add photo"><Image /></IconButton>
//           <IconButton sx={iconHover} aria-label="add file"><InsertDriveFile /></IconButton>
//           <IconButton sx={iconHover} aria-label="add link"><Link /></IconButton>
//           <IconButton sx={iconHover} aria-label="more options"><MoreHoriz /></IconButton>
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

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  alpha,
  styled,
  FormHelperText,
} from '@mui/material';
import { Image, InsertDriveFile, Link, MoreHoriz } from '@mui/icons-material';
import ProfilePic from '../../../assets/images/ProfilePic.jpg';
import CustomButton from '../../../components/CustomButton/CustomButton';

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

const categories = ['Web Development', 'Graphic Design', 'Data Analysis', 'Writing & Translation'];
const tags = ['WebDevelopment', 'UIUXDesign', 'DataScience', 'StudyGroup', 'Collaboration', 'Programming'];

const CreatePost = ({ addPost }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({ content: '', category: '' });
  const [media, setMedia] = useState({ image: null, file: null, link: '' });

  const characterLimit = 500;

  const handleContentChange = (event) => {
    if (event.target.value.length <= characterLimit) setContent(event.target.value);
    if (errors.content && event.target.value.trim() !== '') setErrors((prev) => ({ ...prev, content: '' }));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (errors.category && event.target.value) setErrors((prev) => ({ ...prev, category: '' }));
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let newErrors = { content: '', category: '' };
    let hasError = false;

    if (!content.trim()) {
      newErrors.content = 'Please enter post content';
      hasError = true;
    }
    if (!category) {
      newErrors.category = 'Please select a category';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

const newPost = {
  user: { name: "John Doe", avatar: ProfilePic, field: "Developer" },
  time: new Date().toLocaleTimeString(),
  likes: 0,
  comments: 0,
  shares: 0,
  content,
  category,
  selectedTags,
  ...media
};
    addPost(newPost);

    // Reset form
    setContent('');
    setCategory('');
    setSelectedTags([]);
    setErrors({ content: '', category: '' });
    setMedia({ image: null, file: null, link: '' });
  };

  const iconHover = { '&:hover': { color: 'primary.main' } };

  return (
    <FormWrapper component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar src={ProfilePic} alt="User Avatar" />
        <TextField
          multiline
          fullWidth
          variant="outlined"
          placeholder="What's on your mind? Share your thoughts, achievements, or ask for help..."
          value={content}
          onChange={handleContentChange}
          error={!!errors.content}
          helperText={errors.content || `${content.length}/${characterLimit} characters`}
          sx={{
            flexGrow: 1,
            backgroundColor: '#FFF',
            borderRadius: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              padding: 1.5,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3B82F6',
                boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#94A3B8', 0.5) },
          }}
          inputProps={{ style: { minHeight: '80px' } }}
        />
      </Box>

      <Stack direction="column" spacing={2}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Category</Typography>
          <FormControl fullWidth size="small" sx={{ backgroundColor: '#FFF', borderRadius: 1 }} error={!!errors.category}>
            <InputLabel id="category-label">Select category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Select category"
              onChange={handleCategoryChange}
              sx={{
                backgroundColor: '#F9FAFB',
                borderRadius: 2,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3B82F6',
                  boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.category}</FormHelperText>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Tags (max 5)</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ '& > *': { mb: 1 } }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                onClick={() => handleTagClick(tag)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  bgcolor: selectedTags.includes(tag) ? alpha('#3b82f6', 0.15) : alpha('#fff'),
                }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Stack direction="row" spacing={1} sx={{ color: 'text.secondary' }}>
          {/* صورة */}
          <input
            accept="image/*"
            type="file"
            id="upload-image"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setMedia((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
            }}
          />
          <label htmlFor="upload-image">
            <IconButton component="span" sx={iconHover}><Image /></IconButton>
          </label>

          {/* ملف */}
          <input
            type="file"
            id="upload-file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setMedia((prev) => ({ ...prev, file }));
            }}
          />
          <label htmlFor="upload-file">
            <IconButton component="span" sx={iconHover}><InsertDriveFile /></IconButton>
          </label>

          {/* لينك */}
          <IconButton
            sx={iconHover}
            aria-label="add link"
            onClick={() => {
              const url = prompt('Enter a link:');
              if (url) setMedia((prev) => ({ ...prev, link: url }));
            }}
          >
            <Link />
          </IconButton>

          {/* <IconButton sx={iconHover} aria-label="more options"><MoreHoriz /></IconButton> */}
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
