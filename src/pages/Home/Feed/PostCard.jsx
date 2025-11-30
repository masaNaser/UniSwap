import React, { useEffect, useState } from "react";
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
  Button,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import { useNavigateToProfile } from "../../../hooks/useNavigateToProfile";
import ShareDialog from "../../../components/Modals/ShareDialog";
import { formatTime } from "../../../utils/timeHelper";


// Single Comment Bubble
const CommentBubble = ({ comment }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 1, minWidth: 0 }}>
    <Avatar
      src={comment.author?.avatar}
      sx={{ width: 24, height: 24, flexShrink: 0 }}
    />
    <Box
      sx={{
        bgcolor: "#eef1f3",
        borderRadius: "12px",
        p: 1,
        maxWidth: "100%",
        wordBreak: "break-word",
        flexGrow: 1,
      }}
    >
      <Typography variant="caption" fontWeight="bold">
        {comment.author.userName}
      </Typography>
      <Typography variant="body2">{comment.content}</Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "right", mt: 0.5, lineHeight: 1 }}
      >
        {formatTime(comment.createdAt)}
      </Typography>
    </Box>
  </Box>
);

const ActionButton = ({ icon, label, onClick }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      cursor: onClick ? "pointer" : "default",
    }}
    onClick={onClick}
  >
    <IconButton>{icon}</IconButton>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

function PostCard({
  post,
  onDelete,
  onEdit,
  onLike,
  onCloseComments,
  onShowComments,
  onShare, // ✅ إضافة
  fetchRecentComments,
  onAddCommentInline,
  currentUserAvatar,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [recentComments, setRecentComments] = useState(
    post.recentComments || []
  );
  const [inlineCommentText, setInlineCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false); // ✅ State للـ Share Dialog

  const open = Boolean(anchorEl);
  const currentUserName = localStorage.getItem("userName");
  const isPostAuthor = post.user.name === currentUserName;
  const isPostClosed = post.isClosed === true; // ✅ إضافة هاي

  // Load recent comments
  useEffect(() => {
    const loadRecentComments = async () => {
      if (post.comments > 0) {
        const comments = await fetchRecentComments(post.id);
        setRecentComments(comments);
      } else {
        setRecentComments([]);
      }
    };

    if (post.recentComments?.length > 0) {
      setRecentComments(post.recentComments);
    } else {
      loadRecentComments();
    }
  }, [post.id, post.comments, post.recentComments, fetchRecentComments]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDeleteClick = () => {
    onDelete(post.id);
    handleClose();
  };
  const handleCloseClick = () => {
    onCloseComments(post.id);
    handleClose();
  };
  const handleEditClick = () => {
    onEdit(post.id);
    handleClose();
  };
  const handleLikeClick = () => onLike(post.id);
  const handleCommentClick = () => onShowComments(post.id);

  // ✅ Handle Share Click
  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  // ✅ Handle Share Success
  const handleShareSuccess = (postId) => {
    if (onShare) {
      onShare(postId);
    }
  };

  const navigateToProfile = useNavigateToProfile();

  const handleInlineCommentSubmit = async (e) => {
    e.preventDefault();
    if (!inlineCommentText.trim() || isPostClosed) return; // ✅ إضافة check

    setIsCommenting(true);
    try {
      await onAddCommentInline(post.id, inlineCommentText.trim());
      setInlineCommentText("");
    } catch (error) {
      console.error("Error submitting inline comment:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <>
      <Card
        sx={{ mb: 3, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        {/* Header */}
        <CardHeader
          avatar={<Avatar src={post.user.avatar} />}
          action={
            isPostAuthor && (
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  color: "primary.main",
                },
              }}
              onClick={() => navigateToProfile(post.user.id)}
            >
              {post.user.name}
            </Typography>
          }
          subheader={post.time}
        />

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleEditClick}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Post
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Post
          </MenuItem>
          <MenuItem onClick={handleCloseClick} disabled={isPostClosed} >
            <CommentsDisabledIcon fontSize="small" sx={{ mr: 1 }} /> 
            {isPostClosed ? "Comments Closed" : "Close Comments"} {/* ✅ تغيير النص */}
          </MenuItem>
        </Menu>

        {/* Content */}
        <CardContent>
          <Typography variant="body1" color="text.primary" paragraph>
            {post.content}
          </Typography>
          <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {post.selectedTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
          {post.fileUrl && (
            <Box
              sx={{
                mt: 2,
                maxHeight: 500,
                overflow: "hidden",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f5f5f5",
              }}
            >
              <img
                src={post.fileUrl}
                alt="Post content"
                style={{
                  width: "50%",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  maxHeight: "500px",
                }}
              />
            </Box>
          )}
        </CardContent>

        <Divider />

        <CardActions disableSpacing sx={{ justifyContent: "space-around" }}>
          <ActionButton
            icon={
              post.isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )
            }
            
            label={`${post.likes} Likes`}
            onClick={handleLikeClick}
          />           
           {console.log("post.isLiked",post.isLiked)}

          <ActionButton
            icon={<ChatBubbleOutlineIcon />}
            label={`${post.comments} Comments`}
            onClick={isPostClosed ? undefined : handleCommentClick} // ✅ disable لو مسكر
          />
          <ActionButton
            icon={<ShareIcon />}
            label="Shares"
            onClick={handleShareClick}
          />{" "}
          {/* ✅ إضافة onClick */}
        </CardActions>

  {/* ✅ رسالة لما البوست يكون مسكر */}
        {isPostClosed && (
          <Box sx={{ 
            px: 2, 
            py: 1.5, 
            bgcolor: '#fff3cd', 
            borderTop: '1px solid #ffc107',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <CommentsDisabledIcon sx={{ color: '#856404', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: '#856404', fontWeight: 500 }}>
              Comments are disabled for this post
            </Typography>
          </Box>
        )}
        <Divider />

        {/* Comments */}
        <Box sx={{ px: 2, pb: 1, pt: 1, bgcolor: "#fbfbfb" }}>
          {recentComments.length > 0 &&
            recentComments.map((comment, index) => (
              <CommentBubble key={comment.id || index} comment={comment} />
            ))}

          {post.comments > recentComments.length && !isPostClosed && (
            <Button
              variant="text"
              size="small"
              onClick={handleCommentClick}
              sx={{
                justifyContent: "flex-start",
                p: 0,
                mb: 1,
                fontWeight: "bold",
              }}
            >
              VIEW ALL {post.comments} COMMENTS
            </Button>
          )}

          {/* Inline Comment */}
          {/* Inline Comment - ✅ إخفاء لو مسكر */}
          {!isPostClosed && (
          <Box
            component="form"
            onSubmit={handleInlineCommentSubmit}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Avatar src={currentUserAvatar} sx={{ width: 32, height: 32 }} />
            <TextField
              placeholder="Add a comment..."
              variant="outlined"
              fullWidth
              size="small"
              value={inlineCommentText}
              onChange={(e) => setInlineCommentText(e.target.value)}
              disabled={isCommenting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleInlineCommentSubmit(e);
                }
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!inlineCommentText.trim() || isCommenting}
              size="small"
            >
              {isCommenting ? (
                <CircularProgress size={20} />
              ) : (
                <ChatBubbleOutlineIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        )}
        </Box>
      </Card>

      {/* ✅ Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        post={post}
        onShareSuccess={handleShareSuccess}
      />
    </>
  );
}

export default PostCard;
