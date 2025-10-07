import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function PostCard({ post, onDelete, onEdit, onLike, onShowComments }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const currentUserName = localStorage.getItem("userName");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    onDelete(post.id);
    handleClose();
  };

  const handleEditClick = () => {
    onEdit(post.id);
    handleClose();
  };

  const handleLikeClick = () => {
    onLike(post.id);
  };

  const handleCommentClick = () => {
    onShowComments(post.id);
  };

  // Check if the current user is the post author
  const isPostAuthor = post.user.name === currentUserName;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.user.avatar} />}
        action={
          isPostAuthor && ( // Only show menu if current user is the author
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold">
            {post.user.name}
          </Typography>
        }
        subheader={post.time}
      />

      {/* Menu for Edit/Delete */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Post
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Post
        </MenuItem>
      </Menu>

      <CardContent>
        {/* Post Content */}
        <Typography variant="body1" color="text.primary" paragraph>
          {post.content}
        </Typography>

        {/* Tags */}
        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {post.selectedTags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" color="primary" />
          ))}
        </Box>

        {/* Image/File */}
        {post.fileUrl && (
          <Box sx={{ mt: 2, maxHeight: 400, overflow: 'hidden', borderRadius: 1 }}>
            {post.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
              <img
                src={post.fileUrl}
                alt="Post content"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ) : (
              <a href={post.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
            )}
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions disableSpacing sx={{ justifyContent: "space-around" }}>
        {/* Like Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
            {post.isLiked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.likes} Likes
          </Typography>
        </Box>

        {/* Comment Button */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleCommentClick}
        >
          <IconButton aria-label="comment">
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.comments} Comments
          </Typography>
        </Box>

        {/* Share Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.shares} Shares
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
}

export default PostCard;