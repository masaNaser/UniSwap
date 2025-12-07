import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PostCard from "../../Home/Feed/PostCard";
import CommentsModal from "../../Home/Feed/CommentsModal";
import { GetAllPost } from "../../../services/profileService";
import {
  deletePost,
  editPost,
  likePost,
  unlikePost,
  getComments,
  addComment,
  deleteComment,
  editComment,
  closeCommentPost,
} from "../../../services/postService";
import dayjs from "dayjs";
import { getImageUrl } from "../../../utils/imageHelper";
import { useCurrentUser } from "../../../Context/CurrentUserContext";
import { formatDateTime } from "../../../utils/timeHelper";

// normalize comment
const normalizeComment = (comment, userName, currentUser) => {
  const isCurrentUserComment = comment.user?.userName === currentUser?.userName;
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    authorId: comment.user?.id,
    author: {
      userName: comment.user?.userName,
      avatar: isCurrentUserComment
        ? getImageUrl(currentUser?.profilePicture, currentUser?.userName)
        : getImageUrl(comment.user?.profilePictureUrl, comment.user?.userName),
    },
  };
};

// update post by ID
const updatePost = (posts, postId, newData) =>
  posts.map((p) => (p.id === postId ? { ...p, ...newData } : p));

export default function PostsTab({ username }) {
  const { currentUser, loading } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const userName = localStorage.getItem("userName");

  const userToken = localStorage.getItem("accessToken");
  const currentUserName = localStorage.getItem("userName");

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentComments, setCurrentComments] = useState([]);
  const [modalPost, setModalPost] = useState(null);

  // Delete Dialog State
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    postId: null,
  });

  // Edit Dialog State
  const [editDialog, setEditDialog] = useState({
    open: false,
    postId: null,
    content: "",
    tags: "",
    file: null,
    existingFileUrl: "",
    previewUrl: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ✅ Fetch user posts from API
  const fetchUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await GetAllPost(userToken, username);
      const postsData = response.data.map((p) => ({
        id: p.id,
        content: p.content,
        selectedTags: p.tags?.[0]?.split(",") || [],
        user: {
          name: p.author.userName,
          avatar: getImageUrl(p.author.profilePictureUrl, p.author.userName),
          id: p.author.id,
        },
        time: formatDateTime(p.createdAt),
        likes: p.likesCount,
        comments: p.commentsCount,
        shares: "",
        fileUrl: p.fileUrl ? `https://uni.runasp.net/${p.fileUrl}` : null,
        isLiked: p.isLikedByMe || false,
        recentComments: [],
        isClosed: p.postStatus === "Closed", // ✅ تحديث: استخدام postStatus بدل isCommentsClosed
      }));
      setPosts(postsData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch posts.",
        severity: "error",
      });
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchRecentComments = useCallback(
    async (postId) => {
      try {
        const response = await getComments(userToken, postId);
        if (response.data?.length) {
          return response.data
            .sort(
              (a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
            )
            .slice(0, 2)
            .map((c) => normalizeComment(c, currentUserName, currentUser));
        }
        return [];
      } catch (error) {
        console.error("Error fetching recent comments:", error);
        return [];
      }
    },
    [userToken, currentUserName, currentUser]
  );

  useEffect(() => {
    if (posts.length) {
      posts.forEach(async (post) => {
        if (post.comments > 0 && post.recentComments.length === 0) {
          const recentComments = await fetchRecentComments(post.id);
          setPosts((prev) => updatePost(prev, post.id, { recentComments }));
        }
      });
    }
  }, [posts.length, fetchRecentComments]);

  // Fetch posts on mount or when username changes
  useEffect(() => {
    if (username && userToken) {
      fetchUserPosts();
    }
  }, [username, userToken]);

  // Delete handlers
  const openDeleteDialog = (postId) => {
    setDeleteDialog({ open: true, postId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, postId: null });
  };

  const handleDeletePost = async () => {
    const postId = deleteDialog.postId;
    closeDeleteDialog();

    try {
      const response = await deletePost(userToken, postId);
      if (response.status === 204) {
        setPosts(posts.filter((p) => p.id !== postId));
        setSnackbar({
          open: true,
          message: "Post has been deleted. ✓",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete post.",
        severity: "error",
      });
    }
  };

  // Edit handlers
  const openEditDialog = (postId) => {
    const postToEdit = posts.find((p) => p.id === postId);
    if (!postToEdit) return;

    setEditDialog({
      open: true,
      postId,
      content: postToEdit.content,
      tags: postToEdit.selectedTags.join(","),
      file: null,
      existingFileUrl: postToEdit.fileUrl || "",
      previewUrl: postToEdit.fileUrl || "",
    });
  };

  const closeEditDialog = () => {
    setEditDialog({
      open: false,
      postId: null,
      content: "",
      tags: "",
      file: null,
      existingFileUrl: "",
      previewUrl: "",
    });
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditDialog((prev) => ({
        ...prev,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditPost = async () => {
    const { postId, content, tags, file } = editDialog;
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("Content", content);
      formData.append("Tags", tags);
      if (file) formData.append("File", file);

      const response = await editPost(formData, userToken, postId);

      if (response.status === 204) {
        const postToEdit = posts.find((p) => p.id === postId);
        const updatedPost = {
          ...postToEdit,
          content,
          selectedTags: tags ? tags.split(",") : [],
          time: new Date().toLocaleString(),
          fileUrl: file ? URL.createObjectURL(file) : postToEdit.fileUrl,
        };
        setPosts((prev) => updatePost(prev, postId, updatedPost));

        closeEditDialog();
        setSnackbar({
          open: true,
          message: "Post has been updated. ✓",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error editing post:", error);
      setSnackbar({
        open: true,
        message: "Failed to update post.",
        severity: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Like handlers
  const handleLikePost = async (postId) => {
    const postToUpdate = posts.find((p) => p.id === postId);
    if (!postToUpdate) return;

    const isCurrentlyLiked = postToUpdate.isLiked;
    const originalLikes = postToUpdate.likes;

    setPosts((prev) =>
      updatePost(prev, postId, {
        isLiked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? originalLikes - 1 : originalLikes + 1,
      })
    );

    try {
      const response = isCurrentlyLiked
        ? await unlikePost(userToken, postId)
        : await likePost(userToken, postId);

      if (response.data?.likesCount !== undefined) {
        setPosts((prev) =>
          updatePost(prev, postId, {
            isLiked: response.data.isLikedByMe || !isCurrentlyLiked,
            likes: response.data.likesCount,
          })
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts((prev) =>
        updatePost(prev, postId, {
          isLiked: isCurrentlyLiked,
          likes: originalLikes,
        })
      );
      setSnackbar({
        open: true,
        message: "Failed to update like status.",
        severity: "error",
      });
    }
  };

  // Comments handlers
  const handleShowComments = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    setCurrentPostId(postId);
    setModalPost(post);
    setCommentsModalVisible(true);
    setCurrentComments([]);

    try {
      const response = await getComments(userToken, postId);
      const sortedComments = response.data
        .map((comment) => normalizeComment(comment, currentUserName, currentUser))
        .sort(
          (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );
      setCurrentComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setSnackbar({
        open: true,
        message: "Failed to load comments.",
        severity: "error",
      });
      setCommentsModalVisible(false);
    }
  };

  const handleAddComment = async (postId, content) => {
    const tempCommentId = Date.now();
    const currentUserAvatar = getImageUrl(
      currentUser?.profilePicture,
      currentUserName
    );

    const newComment = {
      id: tempCommentId,
      content,
      createdAt: new Date().toISOString(),
      author: {
        userName: currentUserName,
        avatar: currentUserAvatar,
      },
      authorId: localStorage.getItem("userId"),
    };

    if (currentPostId === postId)
      setCurrentComments((prev) => [newComment, ...prev]);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments + 1,
              recentComments: [newComment, ...p.recentComments].slice(0, 2),
            }
          : p
      )
    );

    try {
      const response = await addComment(userToken, postId, content);
      if (response.data?.id) {
        const finalComment = normalizeComment(
          response.data,
          currentUserName,
          currentUser
        );
        setCurrentComments((prev) =>
          prev.map((c) => (c.id === tempCommentId ? finalComment : c))
        );
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  recentComments: [
                    finalComment,
                    ...p.recentComments.filter((c) => c.id !== tempCommentId),
                  ].slice(0, 2),
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setSnackbar({
        open: true,
        message: "Failed to add comment.",
        severity: "error",
      });
      setCurrentComments((prev) => prev.filter((c) => c.id !== tempCommentId));
    }
  };

  const handleDeleteComment = async (commentId) => {
    const postId = currentPostId;
    const originalComments = currentComments;
    setCurrentComments((prev) => prev.filter((c) => c.id !== commentId));

    let shouldRefetchRecent = false;
    let originalRecentComments = [];

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          originalRecentComments = p.recentComments;
          if (p.recentComments.some((c) => c.id === commentId))
            shouldRefetchRecent = true;
          return {
            ...p,
            comments: p.comments - 1,
            recentComments: p.recentComments.filter((c) => c.id !== commentId),
          };
        }
        return p;
      })
    );

    try {
      await deleteComment(userToken, commentId);
      if (shouldRefetchRecent) {
        const newRecentComments = await fetchRecentComments(postId);
        setPosts((prev) =>
          updatePost(prev, postId, { recentComments: newRecentComments })
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.status !== 404) {
        setSnackbar({
          open: true,
          message: "Failed to delete comment.",
          severity: "error",
        });
        setCurrentComments(originalComments);
        setPosts((prev) =>
          updatePost(prev, postId, {
            comments: originalRecentComments.length,
            recentComments: originalRecentComments,
          })
        );
      }
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    const originalComments = [...currentComments];
    const originalComment = originalComments.find((c) => c.id === commentId);
    const originalContent = originalComment?.content;
    const postId = currentPostId;

    setCurrentComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, content: newContent, createdAt: new Date().toISOString() }
          : c
      )
    );
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              recentComments: p.recentComments.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      content: newContent,
                      createdAt: new Date().toISOString(),
                    }
                  : c
              ),
            }
          : p
      )
    );

    try {
      await editComment(userToken, commentId, newContent);
    } catch (error) {
      console.error("Error editing comment:", error);
      setCurrentComments(originalComments);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                recentComments: p.recentComments.map((c) =>
                  c.id === commentId
                    ? {
                        ...c,
                        content: originalContent,
                        createdAt: originalComment.createdAt,
                      }
                    : c
                ),
              }
            : p
        )
      );
      setSnackbar({
        open: true,
        message: "Failed to update comment.",
        severity: "error",
      });
    }
  };

  // ✅ Handle Close Comments
  const handleCloseComments = async (postId) => {
    try {
      const response = await closeCommentPost(userToken, postId);
      console.log("close comment:", response);
      
      if (response.status === 200 || response.status === 204) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isClosed: true } : p))
        );
        
        // ✅ إذا كان الـ Modal مفتوح، حدّث الـ modalPost كمان
        if (modalPost?.id === postId) {
          setModalPost((prev) => ({ ...prev, isClosed: true }));
        }

        setSnackbar({
          open: true,
          message: "Comments have been closed on this post.",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error closing comments:", error);
      setSnackbar({
        open: true,
        message: "Failed to close comments.",
        severity: "error",
      });
    }
  };

  const handleSharePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p))
    );
  };

  if (loadingPosts) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
        <p>No posts yet</p>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          mt: 3,
          // maxWidth: "800px",
          // px: { xs: 1, sm: 2, md: 3 },
          py: 2,
          width:"42%"
        }}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={openDeleteDialog}
            onEdit={openEditDialog}
            onLike={handleLikePost}
            onShowComments={handleShowComments}
            onShare={handleSharePost}
            onCloseComments={handleCloseComments} // ✅ إضافة
            onAddCommentInline={handleAddComment}
            fetchRecentComments={fetchRecentComments}
            currentUserAvatar={getImageUrl(
              currentUser?.profilePicture,
              currentUser?.userName || currentUserName
            )}
          />
        ))}
      </Box>

      {/* ✅ إضافة isPostClosed للـ CommentsModal */}
      <CommentsModal
        isVisible={commentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        comments={currentComments}
        postId={currentPostId}
        post={modalPost}
        onCommentSubmit={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
        currentUserName={currentUserName}
        currentUserAvatar={getImageUrl(
          currentUser?.profilePicture,
          currentUser?.userName || currentUserName
        )}
        isPostClosed={modalPost?.isClosed} // ✅ تمرير حالة البوست
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        PaperProps={{ sx: { borderRadius: "12px", width: "400px", maxWidth: "90%" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#F59E0B" }} />
          Delete Post
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>Are you sure?</Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog} sx={{ color: "#6B7280", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            variant="contained"
            sx={{ bgcolor: "#EF4444", textTransform: "none", "&:hover": { bgcolor: "#DC2626" } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent sx={{ pt: 5 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={editDialog.content}
            onChange={(e) => setEditDialog((prev) => ({ ...prev, content: e.target.value }))}
            sx={{ mb: 3, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Tags (comma separated)"
            value={editDialog.tags}
            onChange={(e) => setEditDialog((prev) => ({ ...prev, tags: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <input type="file" accept="image/*" onChange={handleEditFileChange} style={{ marginBottom: "16px" }} />
          {editDialog.previewUrl && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <img
                src={editDialog.previewUrl}
                alt="Preview"
                style={{ width: "50%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEditDialog} disabled={isUpdating} sx={{ color: "#6B7280", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditPost}
            variant="contained"
            disabled={isUpdating}
            sx={{ bgcolor: "#3B82F6", textTransform: "none", minWidth: "100px", "&:hover": { bgcolor: "#2563EB" } }}
          >
            {isUpdating ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
            "& .MuiAlert-icon": { color: "white" },
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}