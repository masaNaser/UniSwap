import React, { useEffect, useState, useCallback } from "react";
import { useProfile } from "../../../Context/ProfileContext";
import { useCurrentUser } from "../../../Context/CurrentUserContext";
import PostCard from "../../Home/Feed/PostCard";
import { getImageUrl } from "../../../utils/imageHelper";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {deletePost,editPost,getComments} from "../../../services/postService";
import { GetAllPost } from "../../../services/profileService";
import dayjs from "dayjs";

// normalize comment - تحويل التعليق للصيغة المطلوبة
const normalizeComment = (comment, currentUser) => {
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

// update post by ID - تحديث بوست معين
const updatePost = (posts, postId, newData) =>
  posts.map((p) => (p.id === postId ? { ...p, ...newData } : p));

export default function PostsTab() {
  const { userData } = useProfile();
  const { currentUser } = useCurrentUser();
  const username = userData?.userName;
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");
  const currentUserId = localStorage.getItem("userId");
  const currentUserAvatar = getImageUrl(currentUser?.profilePicture, currentUser?.userName);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const pageSize = 4;

  // التحقق إذا البروفايل لليوزر الحالي
  const isOwnProfile = userData?.id === Number(currentUserId);

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

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // جلب البوستات من الـ API
  const fetchPosts = async (currentPage = 1) => {
    try {
      setLoading(true);
      const response = await GetAllPost(token, username, currentPage, pageSize);
      console.log("Posts Response:", response);

      const newPosts = response.data?.data || response.data || [];

      // تحويل البوستات للصيغة المطلوبة
      const formattedPosts = newPosts.map((post) => ({
        id: post.id,
        content: post.content,
        fileUrl: post.fileUrl ? `https://uni.runasp.net/${post.fileUrl}` : null,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: post.sharesCount || 0,
        isLiked: post.isLikedByMe || false,
        time: dayjs(post.createdAt).format("DD MMM, hh:mm A"),
        selectedTags: post.tags?.[0]?.split(",") || [],
        user: {
          id: post.author?.id || post.userId || userData?.id,
          name: userName, // ✅ استخدم الـ userName من localStorage مباشرة
          avatar: getImageUrl(
            post.author?.profilePictureUrl ||
              post.userProfilePicture ||
              userData?.profilePicture,
            userName
          ),
        },
        recentComments: [],
      }));

      if (currentPage === 1) {
        setPosts(formattedPosts);
      } else {
        setPosts((prev) => [...prev, ...formattedPosts]);
      }

      setHasMore(formattedPosts.length === pageSize);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // جلب آخر تعليقين لكل بوست
  const fetchRecentComments = useCallback(
    async (postId) => {
      try {
        const response = await getComments(token, postId);
        if (response.data?.length) {
          return response.data
            .sort(
              (a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
            )
            .slice(0, 2)
            .map((c) => normalizeComment(c, currentUser));
        }
        return [];
      } catch (error) {
        console.error("Error fetching recent comments:", error);
        return [];
      }
    },
    [token, currentUser]
  );

  // جلب التعليقات للبوستات اللي عندها تعليقات
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

  // جلب البوستات أول ما يفتح التاب
  useEffect(() => {
    if (token && username) {
      fetchPosts(1);
    }
  }, [token, username]);

  // تحميل المزيد من البوستات
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  // فتح نافذة تأكيد الحذف - فقط للبروفايل الشخصي
  const openDeleteDialog = (postId) => {
    if (!isOwnProfile) return;
    setDeleteDialog({ open: true, postId });
  };

  // إغلاق نافذة الحذف
  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, postId: null });
  };

  // تأكيد حذف البوست
  const handleDeletePost = async () => {
    const postId = deleteDialog.postId;
    closeDeleteDialog();

    try {
      const response = await deletePost(token, postId);
      if (response.status === 204) {
        setPosts(posts.filter((p) => p.id !== postId));
        setSnackbar({
          open: true,
          message: "Your post has been deleted. ✓",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete post. Please try again.",
        severity: "error",
      });
    }
  };

  // فتح نافذة التعديل - فقط للبروفايل الشخصي
  const openEditDialog = (postId) => {
    if (!isOwnProfile) return;

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

  // إغلاق نافذة التعديل
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

  // معالجة تغيير الملف في نافذة التعديل
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

  // تأكيد تعديل البوست
  const handleEditPost = async () => {
    const { postId, content, tags, file } = editDialog;

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("Content", content);
      formData.append("Tags", tags);
      if (file) formData.append("File", file);

      const response = await editPost(formData, token, postId);

      if (response.status === 204) {
        const postToEdit = posts.find((p) => p.id === postId);
        const updatedPost = {
          ...postToEdit,
          content,
          selectedTags: tags ? tags.split(",") : [],
          time: dayjs().format("DD MMM, hh:mm A"),
          fileUrl: file ? URL.createObjectURL(file) : postToEdit.fileUrl,
        };
        setPosts((prev) => updatePost(prev, postId, updatedPost));

        closeEditDialog();
        setSnackbar({
          open: true,
          message: "Your post has been updated. ✓",
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

  // وظائف فارغة - بدون تفاعل للبروفايلات (عرض فقط)
  const handleLikePost = () => {
    // ما في لايك في البروفايل - عرض العدد فقط
  };

  const handleShowComments = () => {
    // ما في فتح modal للتعليقات - عرض آخر تعليقين فقط
  };

  const handleAddCommentInline = () => {
    // ما في إضافة تعليقات - عرض فقط
  };

  // Loading State
  if (loading && posts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Error State
  if (error && posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Empty State
  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No posts yet
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Posts Container - بعرض مناسب ومتوسط */}
      <Box
        sx={{
          maxWidth: "800px",
          // mx: 'auto',
          px: { xs: 1, sm: 2, md: 3 },
          py: 2,
        }}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={isOwnProfile ? openDeleteDialog : () => {}}
            onEdit={isOwnProfile ? openEditDialog : () => {}}
            onLike={handleLikePost}
            onShowComments={handleShowComments}
            fetchRecentComments={fetchRecentComments}
            onAddCommentInline={handleAddCommentInline}
            currentUserAvatar={currentUserAvatar}
          />
        ))}

        {/* زر Load More */}
        {hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Load More"}
            </Button>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#F59E0B" }} />
          Delete Post
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>Are you sure you want to delete this post?</Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            sx={{
              color: "#6B7280",
              textTransform: "none",
            }}
          >
            No, keep it
          </Button>
          <Button
            onClick={handleDeletePost}
            variant="contained"
            sx={{
              bgcolor: "#EF4444",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Yes, delete it!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={editDialog.content}
            onChange={(e) =>
              setEditDialog((prev) => ({ ...prev, content: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tags (comma separated)"
            value={editDialog.tags}
            onChange={(e) =>
              setEditDialog((prev) => ({ ...prev, tags: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleEditFileChange}
            style={{ marginBottom: "16px" }}
          />
          {editDialog.previewUrl && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <img
                src={editDialog.previewUrl}
                alt="Preview"
                style={{
                  width: "50%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeEditDialog}
            disabled={isUpdating}
            sx={{
              color: "#6B7280",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditPost}
            variant="contained"
            disabled={isUpdating}
            sx={{
              bgcolor: "#3B82F6",
              textTransform: "none",
              minWidth: "100px",
              "&:hover": {
                bgcolor: "#2563EB",
              },
            }}
          >
            {isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar للإشعارات */}
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
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
