import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Divider,
    TextField,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
    Chip,
    CardHeader,
    CardContent,
    Menu,
    MenuItem,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: 500, md: 600 },
    height: "90vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
};

// Helper function to format time
const formatTime = (time) => (time ? dayjs(time).format("DD MMM, hh:mm A") : "Just now");

const Comment = ({ comment, onEdit, onDelete, currentUserName }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const isCurrentUser = comment.author.userName === currentUserName;
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleEditClick = () => {
        setIsEditing(true);
        handleMenuClose();
    };

    const handleDeleteClick = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            didOpen: (popup) => {
                popup.parentElement.style.zIndex = 20000;
            }
        });

        if (result.isConfirmed) onDelete(comment.id);
        handleMenuClose();
    };

    const handleSaveEdit = () => {
        if (editedContent.trim() && editedContent !== comment.content) {
            onEdit(comment.id, editedContent.trim());
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedContent(comment.content);
        setIsEditing(false);
    };

    return (
        <Box sx={{ display: "flex", gap: 1.5, my: 2 }}>
            <Avatar
                src={comment.author.avatar}
                alt={comment.author.userName}
                sx={{ width: 32, height: 32 }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                {isEditing ? (
                    <Box>
                        <TextField
                            fullWidth
                            multiline
                            variant="outlined"
                            size="small"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSaveEdit}
                            disabled={!editedContent.trim()}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCancelEdit}
                            sx={{ ml: 1 }}
                        >
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            bgcolor: "#f0f2f5",
                            borderRadius: "16px",
                            p: 1.5,
                            position: "relative",
                        }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                            {comment.author.userName}
                        </Typography>
                        <Typography variant="body2" sx={{ my: 0.5, pr: isCurrentUser ? 3 : 0 }}>
                            {comment.content}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", textAlign: "right", mt: 0.5, ml: 'auto' }}
                        >
                            {formatTime(comment.createdAt)}
                        </Typography>

                        {isCurrentUser && (
                            <IconButton
                                aria-label="more"
                                onClick={handleMenuClick}
                                size="small"
                                sx={{ position: 'absolute', top: 4, right: 4, p: 0 }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
                <MenuItem onClick={handleEditClick}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

function CommentsModal({
    isVisible,
    onClose,
    comments,
    postId,
    post,
    onCommentSubmit,
    onDeleteComment,
    onEditComment,
    currentUserName,
}) {
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onCommentSubmit(postId, commentText.trim());
            setCommentText("");
        } catch (error) {
            console.error("Error submitting comment:", error);
            Swal.fire("Error", "Failed to submit comment.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={isVisible}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <CardHeader
                            avatar={<Avatar src={post?.user?.avatar} />}
                            title={
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {post?.user?.name}
                                </Typography>
                            }
                            subheader={post?.time}
                            sx={{ p: 0, mb: 1 }}
                        />
                        <CardContent sx={{ p: 0 }}>
                            <Typography variant="body1" color="text.primary" paragraph>
                                {post?.content}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {post?.selectedTags?.map((tag, index) => (
                                    <Chip key={index} label={tag} size="small" variant="outlined" color="primary" />
                                ))}
                            </Box>
                            {post?.fileUrl && (
                                <Box sx={{ mt: 2, maxHeight: 300, overflow: 'hidden', borderRadius: 1 }}>
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
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        Comments ({comments.length})
                    </Typography>
                    {comments.length > 0 ? (
                        <Box>
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    onDelete={onDeleteComment}
                                    onEdit={onEditComment}
                                    currentUserName={currentUserName}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No comments yet. Be the first!
                        </Typography>
                    )}
                </Box>

                <Box sx={{ p: 2, borderTop: "1px solid #eee", flexShrink: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            placeholder="Add a comment..."
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit();
                                }
                            }}
                            disabled={isSubmitting}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCommentSubmit}
                            disabled={!commentText.trim() || isSubmitting}
                            sx={{ minWidth: "auto", p: 1.5 }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <SendIcon />
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default CommentsModal;
