// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Stack,
//   IconButton,
//   Divider,
//   Chip,
//   CardMedia,
//   Menu,
//   MenuItem
// } from "@mui/material";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

// const PostCard = ({ post, onDelete, onEdit }) => {
//   // حالة القائمة المنسدلة
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDelete = () => {
//     handleMenuClose();
//     if(onDelete) onDelete(post.id); // لاحقاً API حذف
//   };

//   const handleEdit = () => {
//     handleMenuClose();
//     if(onEdit) onEdit(post.id); // لاحقاً API تعديل
//   };

//   return (
//     <Card sx={{ borderRadius: "12px", boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", mb: 3 }}>
//       <CardContent>
//         {/* Header */}
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Avatar src={post.user.avatar} alt="User Avatar" />
//             <Box>
//               <Typography variant="subtitle1" fontWeight="bold">{post.user.name}</Typography>
//               <Typography variant="caption" color="text.secondary"> {post.time}</Typography>
//             </Box>
//           </Stack>
//           <IconButton onClick={handleMenuOpen}>
//             <MoreHorizIcon />
//           </IconButton>
//           {/* Menu */}
//           <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//             <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
//             <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
//           </Menu>
//         </Stack>

//         {/* Content */}
//         <Box mt={2}>
//           <Typography variant="body1">{post.content}</Typography>
//         </Box>

//         {/* Tags */}
//         <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
//           {post.selectedTags.map((tag, index) => (
//             <Chip key={index} label={`#${tag}`} variant="outlined" size="small" />
//           ))}
//         </Stack>

//         {/* Media preview */}
//         {post.image && <CardMedia component="img" height="200" image={post.image} alt="Post media" sx={{ borderRadius: "8px", mt: 2 }} />}
//         {post.file && (
//           <Typography variant="body2" color="primary" sx={{ mt: 1, cursor: "pointer" }} onClick={() => window.open(URL.createObjectURL(post.file))}>
//              {post.file.name}
//           </Typography>
//         )}
//         {post.link && (
//           <Typography variant="body2" color="primary" sx={{ mt: 1 }} component="a" href={post.link} target="_blank" rel="noopener noreferrer">
//              {post.link}
//           </Typography>
//         )}
//       </CardContent>

//       <Divider />

//       {/* Footer Actions */}
//       <Stack direction="row" justifyContent="space-around" alignItems="center" py={1}>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <FavoriteBorderIcon fontSize="small" />
//           <Typography variant="body2">{post.likes} likes</Typography>
//         </Stack>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <ChatBubbleOutlineIcon fontSize="small" />
//           <Typography variant="body2">{post.comments} comments</Typography>
//         </Stack>
//         <Stack direction="row" spacing={1} alignItems="center">
//           <ShareOutlinedIcon fontSize="small" />
//           <Typography variant="body2">{post.shares} shares</Typography>
//         </Stack>
//       </Stack>
//     </Card>
//   );
// };

// export default PostCard;

import React, { useState } from "react";
import {
  Avatar, Box, Typography, Card, CardContent, Stack, IconButton,
  Divider, Chip, CardMedia, Menu, MenuItem
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

const PostCard = ({ post, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDelete = () => { handleMenuClose(); if(onDelete) onDelete(post.id); };
  const handleEdit = () => { handleMenuClose(); if(onEdit) onEdit(post.id); };
  console.log("image",post.image);
  return (
    <Card sx={{ borderRadius: "12px", boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", mb: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={post.user.avatar} alt="User Avatar" />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">{post.user.name}</Typography>
              <Typography variant="caption" color="text.secondary"> {post.time}</Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleMenuOpen}><MoreHorizIcon /></IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
            <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
          </Menu>
        </Stack>

        <Box mt={2}><Typography variant="body1">{post.content}</Typography></Box>

        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {post.selectedTags.map((tag, index) => (<Chip key={index} label={`#${tag}`} variant="outlined" size="small" />))}
        </Stack>

        {post.fileUrl && <CardMedia component="img" height="200" image={post.fileUrl} alt="Post media" sx={{ borderRadius: "8px", mt: 2 }} />}
      </CardContent>

      <Divider />
      <Stack direction="row" justifyContent="space-around" alignItems="center" py={1}>
        <Stack direction="row" spacing={1} alignItems="center"><FavoriteBorderIcon fontSize="small" /><Typography variant="body2">{post.likes} likes</Typography></Stack>
        <Stack direction="row" spacing={1} alignItems="center"><ChatBubbleOutlineIcon fontSize="small" /><Typography variant="body2">{post.comments} comments</Typography></Stack>
        <Stack direction="row" spacing={1} alignItems="center"><ShareOutlinedIcon fontSize="small" /><Typography variant="body2">{post.shares} shares</Typography></Stack>
      </Stack>
    </Card>
  );
};

export default PostCard;
