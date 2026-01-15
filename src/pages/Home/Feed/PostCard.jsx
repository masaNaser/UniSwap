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
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import MessegeIcon from "../../../assets/images/MessegeIcon.svg";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import { useNavigateToProfile } from "../../../hooks/useNavigateToProfile";
import ShareDialog from "../../../components/Modals/ShareDialog";
import { formatDateTime } from "../../../utils/timeHelper";
import { useTheme } from "@mui/material/styles";
import { getUserName } from "../../../utils/authHelpers";
import { renderContentWithLinks } from "../../../utils/textHelper";

//  FileDisplay Component - لعرض جميع أنواع الملفات
const FileDisplay = ({ fileUrl }) => {
  if (!fileUrl || fileUrl === null || fileUrl === "") return null;

  const getFileExtension = (url) => {
    return url.split(".").pop().toLowerCase();
  };

  const extension = getFileExtension(fileUrl);
  const fileName = fileUrl.split("/").pop();

  // للصور - نفس العرض القديم
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return (
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
          src={fileUrl}
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
    );
  }

  // للملفات الأخرى - بطاقة تحميل
  const getFileIcon = () => {
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "txt":
        return "📃";
      case "zip":
      case "rar":
        return "🗜️";
      default:
        return "📎";
    }
  };

  const getFileType = () => {
    switch (extension) {
      case "pdf":
        return "PDF Document";
      case "doc":
      case "docx":
        return "Word Document";
      case "xls":
      case "xlsx":
        return "Excel Spreadsheet";
      case "txt":
        return "Text File";
      case "zip":
      case "rar":
        return "Compressed Archive";
      default:
        return "File";
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: "2px dashed #e0e0e0",
        borderRadius: 2,
        bgcolor: "#fafafa",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: 40 }}>{getFileIcon()}</Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ wordBreak: "break-word" }}
        >
          {fileName}
        </Typography>
        <Chip
          label={getFileType()}
          size="small"
          sx={{ mt: 0.5 }}
          variant="outlined"
          color="primary"
        />
      </Box>
      <Button
        variant="contained"
        href={fileUrl}
        download
        target="_blank"
        sx={{
          textTransform: "none",
          bgcolor: "#3b82f6",
          "&:hover": { bgcolor: "#2563eb" },
          minWidth: "100px",
        }}
      >
        Download
      </Button>
    </Box>
  );
};

// Single Comment Bubble
const CommentBubble = ({ comment, theme, onUserClick }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 1, minWidth: 0 }}>
    <Avatar
      src={comment.author?.avatar}
      sx={{ width: 24, height: 24, flexShrink: 0, cursor: "pointer" }}
      onClick={() => onUserClick(comment.authorId)}
    />
    <Box
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "#2c2c2c" : "#eef1f3",
        borderRadius: "12px",
        p: 1,
        maxWidth: "100%",
        wordBreak: "break-word",
        flexGrow: 1,
      }}
    >
      <Typography
        variant="caption"
        fontWeight="bold"
        onClick={() => onUserClick(comment.authorId)}
        sx={{
          cursor: "pointer",
          "&:hover": {
            textDecoration: "underline",
            color: "primary.main",
          },
        }}
      >
        {comment.author.userName}
      </Typography>
      <Typography variant="body2">
        {renderContentWithLinks(comment.content)}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "right", mt: 0.5, lineHeight: 1 }}
      >
        {formatDateTime(comment.createdAt)}
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
  onShare,
  fetchRecentComments,
  onAddCommentInline,
  currentUserAvatar,
  onShowLikes,
}) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [recentComments, setRecentComments] = useState(
    post.recentComments || []
  );
  const [inlineCommentText, setInlineCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const open = Boolean(anchorEl);
  const currentUserName = getUserName();
  const isPostAuthor = post.user.name === currentUserName;
  const isPostClosed = post.isClosed === true;

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

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  const handleShareSuccess = (postId) => {
    if (onShare) {
      onShare(postId);
    }
  };

  const navigateToProfile = useNavigateToProfile();

  const handleInlineCommentSubmit = async (e) => {
    e.preventDefault();
    if (!inlineCommentText.trim() || isPostClosed) return;

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

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleEditClick}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Post
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Post
          </MenuItem>
          <MenuItem onClick={handleCloseClick} disabled={isPostClosed}>
            <CommentsDisabledIcon fontSize="small" sx={{ mr: 1 }} />
            {isPostClosed ? "Comments Closed" : "Close Comments"}
          </MenuItem>
        </Menu>

        <CardContent>
          <Typography
            variant="body1"
            color="text.primary"
            paragraph
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              unicodeBidi: "plaintext",
              textAlign: "initial",
              display: "block",
              width: "100%",
            }}
          >
            {renderContentWithLinks(post.content)}
          </Typography>
          <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {post.selectedTags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="medium"
                variant="outlined"
                color="primary"
                // cursor="pointer"
                sx={{
                  minWidth: "80px",
                  height: "32px",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "16px",
                  px: 2,
                  "&:hover": {
                    bgcolor: "rgba(59, 130, 246, 0.25)",
                  },
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
          {post.fileUrl && <FileDisplay fileUrl={post.fileUrl} />}
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
            onClick={(e) => {
              // ✅ لو كبس على القلب، عمل لايك
              if (e.target.closest("button")) {
                handleLikeClick();
              }
              // ✅ لو كبس على النص، عرض اللايكات
              else if (post.likes > 0 && onShowLikes) {
                onShowLikes(post.likedBy);
              }
            }}
          />

          <ActionButton
            icon={
              <img
                src={MessegeIcon}
                alt="Messege Icon"
                style={{
                  height: "20px",
                  width: "20px",
                  display: "block",
                }}
              />
            }
            label={`${post.comments} Comments`}
            onClick={isPostClosed ? undefined : handleCommentClick}
          />
          <ActionButton
            icon={<ShareIcon />}
            label="Shares"
            onClick={handleShareClick}
          />
        </CardActions>

        {isPostClosed && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "#fff3cd",
              borderTop: "1px solid #ffc107",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CommentsDisabledIcon sx={{ color: "#856404", fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ color: "#856404", fontWeight: 500 }}
            >
              Comments are disabled for this post
            </Typography>
          </Box>
        )}
        <Divider />

        <Box
          sx={{ px: 2, pb: 1, pt: 1, bgcolor: theme.palette.background.paper }}
        >
          {recentComments.length > 0 &&
            recentComments.map((comment, index) => (
              <CommentBubble
                key={comment.id || index}
                comment={comment}
                theme={theme}
                onUserClick={navigateToProfile}
              />
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
                  <img
                    src={MessegeIcon}
                    alt="Messege Icon"
                    style={{
                      height: "20px",
                      width: "20px",
                      display: "block",
                    }}
                  />
                )}
              </IconButton>
            </Box>
          )}
        </Box>
      </Card>

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
