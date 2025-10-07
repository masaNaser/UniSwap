import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    CircularProgress,
    Divider,
    Menu,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ProfilePic from "../../../assets/images/ProfilePic.jpg";
import dayjs from 'dayjs';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
};

const formatTime = (time) => {
    if (!time) return "Just now";
    return dayjs(time).format('DD MMM, hh:mm A');
};

function CommentsModal({ isVisible, onClose, comments, postId, onCommentSubmit, onDeleteComment, onEditComment, currentUserName }) {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuCommentId, setMenuCommentId] = useState(null);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const openMenu = Boolean(anchorEl);

    // Menu Handlers
    const handleMenuClick = (event, commentId) => {
        setAnchorEl(event.currentTarget);
        setMenuCommentId(commentId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuCommentId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !postId || isSubmitting || editingCommentId !== null) return;

        setIsSubmitting(true);
        try {
            await onCommentSubmit(postId, commentText.trim());
            setCommentText('');
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (commentId) => {
        onDeleteComment(commentId);
        handleMenuClose();
    };

    const handleStartEdit = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedContent(content);
        handleMenuClose();
    };

    const handleSaveEdit = async () => {
        if (!editedContent.trim()) return;

        const originalContent = comments.find(c => c.id === editingCommentId)?.content;
        if (editedContent.trim() === originalContent) {
            setEditingCommentId(null);
            return;
        }

        setIsSubmitting(true);
        try {
            await onEditComment(editingCommentId, editedContent.trim());
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error saving comment edit:", error);
            const originalContent = comments.find(c => c.id === editingCommentId)?.content;
            setEditedContent(originalContent);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedContent('');
    };


    return (
        <Modal open={isVisible} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Comments ({comments.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Comment Input Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TextField
                        label="Add a comment..."
                        variant="outlined"
                        fullWidth
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isSubmitting || editingCommentId !== null}
                        size="small"
                        sx={{ mr: 1 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                        disabled={!commentText.trim() || isSubmitting || editingCommentId !== null}
                    >
                        Send
                    </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Comments List */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <List sx={{ width: '100%', p: 0 }}>
                        {comments.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                                Be the first to comment!
                            </Typography>
                        ) : (
                            comments.map((comment) => {
                                const authorUsername = comment.author?.userName || comment.user?.userName || 'Anonymous';
                                const isAuthor = authorUsername === currentUserName;
                                const isEditing = editingCommentId === comment.id;

                                return (
                                    <ListItem
                                        key={comment.id}
                                        alignItems="flex-start"
                                        secondaryAction={
                                            isAuthor && !isEditing ? (
                                                <IconButton
                                                    edge="end"
                                                    aria-label="options"
                                                    onClick={(e) => handleMenuClick(e, comment.id)}
                                                    size="small"
                                                >
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                            ) : null
                                        }
                                        sx={{
                                            px: 0,
                                            py: 1,
                                            borderBottom: '1px solid #eee',
                                            '&:last-child': { borderBottom: 'none' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={ProfilePic} alt={comment.author?.userName || 'User'} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography
                                                        component="span"
                                                        variant="subtitle2"
                                                        fontWeight="bold"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        {comment.author?.userName || 'Anonymous'}
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {formatTime(comment.createdAt)}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondaryTypographyProps={{ component: 'div' }}
                                            secondary={
                                                <React.Fragment>
                                                    {isEditing ? (
                                                        <TextField
                                                            value={editedContent}
                                                            onChange={(e) => setEditedContent(e.target.value)}
                                                            fullWidth
                                                            multiline
                                                            size="small"
                                                            variant="outlined"
                                                            disabled={isSubmitting}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    handleSaveEdit();
                                                                } else if (e.key === 'Escape') {
                                                                    handleCancelEdit();
                                                                }
                                                            }}
                                                            sx={{ mt: 0.5 }}
                                                        />
                                                    ) : (
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {comment.content}
                                                        </Typography>
                                                    )}

                                                    {isEditing && (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end',
                                                                mt: 0.5,
                                                                gap: 1
                                                            }}
                                                        >
                                                            <Button
                                                                onClick={handleCancelEdit}
                                                                disabled={isSubmitting}
                                                                size="small"
                                                                color="error"
                                                                variant="text"
                                                                startIcon={<CloseIcon fontSize="small" />}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={handleSaveEdit}
                                                                disabled={isSubmitting || !editedContent.trim()}
                                                                size="small"
                                                                color="primary"
                                                                variant="text"
                                                                startIcon={<CheckIcon fontSize="small" />}
                                                            >
                                                                Save
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                )
                            })
                        )}
                    </List>
                </Box>

                {/* Edit/Delete Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        onClick={() => handleStartEdit(
                            menuCommentId,
                            comments.find(c => c.id === menuCommentId)?.content
                        )}
                        disabled={isSubmitting}
                    >
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(menuCommentId)} disabled={isSubmitting}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                </Menu>

            </Box>
        </Modal>
    );
}

export default CommentsModal;