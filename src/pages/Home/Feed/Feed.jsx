import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Container,
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
import { WavingHand } from "@mui/icons-material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SelectActionCard from "../../../components/Cards/Cards";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import GroupIcon from "@mui/icons-material/Group";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import Sidebar from "./Sidebar";
import "./Feed.css";
import CommentsModal from "./CommentsModal";
import {
  getPosts,
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
import { useSearchParams } from "react-router-dom"; // ✅ إضافة

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

export default function Feed() {
  const { currentUser, loading } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ إضافة
  const [highlightedPostId, setHighlightedPostId] = useState(null); // ✅ إضافة
  const postRefs = useRef({}); // ✅ إضافة

  const userToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentComments, setCurrentComments] = useState([]);
  const [modalPost, setModalPost] = useState(null);
  const [userIdCommenting, setUserIdCommenting] = useState(null);

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

  const fetchPosts = async () => {
    try {
      const response = await getPosts(userToken);
      console.log(response);
      const postsData = response.data.map((p) => ({
        id: p.id,
        content: p.content,
        selectedTags: p.tags?.[0]?.split(",") || [],
        user: {
          name: p.author.userName,
          avatar: getImageUrl(p.author.profilePictureUrl, p.author.userName),
          id: p.author.id,
        },
        time: dayjs(p.createdAt).format("DD MMM, hh:mm A"),
        likes: p.likesCount,
        comments: p.commentsCount,
        shares: "",
        fileUrl: p.fileUrl ? `https://uni.runasp.net/${p.fileUrl}` : null,
        isLiked: p.isLikedByMe || false,
        recentComments: [],
      isClosed: p.postStatus === "Closed", // ✅ إضافة هاي
      }));
      setPosts(postsData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch posts.",
        severity: "error",
      });
      console.error("Error fetching posts:", error);
    }
  };

  const fetchRecentComments = useCallback(
    async (postId) => {
      try {
        const response = await getComments(userToken, postId);
        setUserIdCommenting(response.data[0]?.user?.id || null);
        if (response.data?.length) {
          return response.data
            .sort(
              (a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
            )
            .slice(0, 2)
            .map((c) => normalizeComment(c, userName, currentUser));
        }
        return [];
      } catch (error) {
        console.error("Error fetching recent comments:", error);
        return [];
      }
    },
    [userToken, userName, currentUser]
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

  // ✅ Scroll to post when URL has postId parameter
  useEffect(() => {
    const postId = searchParams.get("postId");

    if (postId && posts.length > 0) {
      // انتظر شوي للتأكد إن كل شي تحمل
      setTimeout(() => {
        const postElement = postRefs.current[postId];

        if (postElement) {
          // Scroll للبوست
          postElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Highlight البوست
          setHighlightedPostId(postId);

          // إزالة الـ highlight بعد 3 ثواني
          setTimeout(() => {
            setHighlightedPostId(null);
            // إزالة الـ postId من الـ URL
            setSearchParams({});
          }, 3000);
        } else {
          console.log("Post not found, might be on different page or deleted");
        }
      }, 500);
    }
  }, [posts, searchParams, setSearchParams]);

  const addPost = (newPost) =>
    setPosts([{ ...newPost, isLiked: false, recentComments: [] }, ...posts]);

  // Open Delete Dialog
  const openDeleteDialog = (postId) => {
    setDeleteDialog({ open: true, postId });
  };

  // Close Delete Dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, postId: null });
  };

  // Confirm Delete Post
  const handleDeletePost = async () => {
    const postId = deleteDialog.postId;
    closeDeleteDialog();

    try {
      const response = await deletePost(userToken, postId);
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

  // Open Edit Dialog
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

  // Close Edit Dialog
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

  // Handle File Change in Edit Dialog
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

  // Confirm Edit Post
  const handleEditPost = async () => {
    const { postId, content, tags, file } = editDialog;

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("Content", content);
      formData.append("Tags", tags);
      if (file) formData.append("File", file);

      const response = await editPost(formData, userToken, postId);
      console.log(response);

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
      console.error(
        `Error ${isCurrentlyLiked ? "unliking" : "liking"} post:`,
        error
      );
      setPosts((prev) =>
        updatePost(prev, postId, {
          isLiked: isCurrentlyLiked,
          likes: originalLikes,
        })
      );
      setSnackbar({
        open: true,
        message: `Failed to ${isCurrentlyLiked ? "unlike" : "like"} post.`,
        severity: "error",
      });
    }
  };

  const handleShowComments = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    setCurrentPostId(postId);
    setModalPost(post);
    setCommentsModalVisible(true);
    setCurrentComments([]);

    try {
      const response = await getComments(userToken, postId);
      console.log("Comments fetched:", response.data);
      console.log("First comment user:", response.data[0]?.user);

      const sortedComments = response.data
        .map((comment) => normalizeComment(comment, userName, currentUser))
        .sort(
          (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );
      setCurrentComments(sortedComments);
      console.log("Sorted Comments:", sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setSnackbar({
        open: true,
        message: "Failed to load comments.",
        severity: "error",
      });
      setCommentsModalVisible(false);
      setModalPost(null);
    }
  };

  const handleAddComment = async (postId, content) => {
    const tempCommentId = Date.now();
    const currentUserId = localStorage.getItem("userId");
    const currentUserAvatar = getImageUrl(
      currentUser?.profilePicture,
      userName
    );
    console.log("currentUserAvatar:", currentUserAvatar);

    const newComment = {
      id: tempCommentId,
      content,
      createdAt: new Date().toISOString(),
      author: {
        userName,
        avatar: currentUserAvatar,
      },
      authorId: currentUserId,
    };

    // Update modal and posts instantly
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
          userName,
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
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments - 1,
                recentComments: p.recentComments.filter(
                  (c) => c.id !== tempCommentId
                ),
              }
            : p
        )
      );
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

  const handleCloseComments = async (postId) => {
    try {
      const response = await closeCommentPost(userToken, postId);
     console.log("close comment :",response);
      if (response.status === 200 || response.status === 204) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isClosed: true } : p))
        );

        setSnackbar({
          open: true,
          message: "Comments have been closed on this post.",
          severity: "success",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to close comments.",
        severity: "error",
      });
    }
  };

  // Share Post Handler
  const handleSharePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p))
    );
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, [userToken]);

  return (
    <>
      <Container maxWidth="lg" className="container">
        <div className="welcome-section">
          <h1 className="welcome-heading">
            Welcome back, {userName}! <WavingHand className="wave" />
          </h1>
          <p className="welcome-subheading">
            Here's what's happening in your community today.
          </p>
        </div>

        <div className="cards-section">
          <SelectActionCard
            title="Active Services"
            value="12"
            icon={<AccessTimeIcon />}
          />
          <SelectActionCard
            title="Completed Tasks"
            value="47"
            icon={<WorkspacePremiumOutlinedIcon />}
          />
          <SelectActionCard
            title="Peer Rating"
            value="4.8"
            icon={<GroupIcon />}
          />
        </div>

        <div className="post-section">
          <div className="create-post-main">
            <CreatePost addPost={addPost} token={userToken} />
            <Box mt={3}>
              {posts.map((post) => (
                <Box
                  key={post.id}
                  ref={(el) => (postRefs.current[post.id] = el)} // ✅ ref للبوست
                  sx={{
                    transition: "all 0.3s ease",
                    // ✅ Highlight effect
                    ...(highlightedPostId === post.id && {
                      animation: "highlight 2s ease-in-out",
                      "@keyframes highlight": {
                        "0%": {
                          boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)",
                          transform: "scale(1)",
                        },
                        "50%": {
                          boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.4)",
                          transform: "scale(1.02)",
                        },
                        "100%": {
                          boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
                          transform: "scale(1)",
                        },
                      },
                    }),
                  }}
                >
                  <PostCard
                    post={post}
                    onDelete={openDeleteDialog}
                    onEdit={openEditDialog}
                    onLike={handleLikePost}
                    onShowComments={handleShowComments}
                    onShare={handleSharePost}
                    onCloseComments={handleCloseComments}
                    onAddCommentInline={handleAddComment}
                    fetchRecentComments={fetchRecentComments}
                    currentUserAvatar={getImageUrl(
                      currentUser?.profilePicture,
                      currentUser?.userName || userName
                    )}
                  />
                </Box>
              ))}
            </Box>
          </div>
          <div className="feed-sidebar" style={{ flex: 1 }}>
            <Sidebar />
          </div>
        </div>

        <CommentsModal
          isVisible={commentsModalVisible}
          onClose={() => setCommentsModalVisible(false)}
          comments={currentComments}
          postId={currentPostId}
          post={modalPost}
          onCommentSubmit={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
          currentUserName={userName}
          currentUserAvatar={getImageUrl(
            currentUser?.profilePicture,
            currentUser?.userName || userName
          )}
            isPostClosed={modalPost?.isClosed} // ✅ إضافة هاي

        />
      </Container>

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
        <DialogContent sx={{ pt: 5 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={editDialog.content}
            onChange={(e) =>
              setEditDialog((prev) => ({ ...prev, content: e.target.value }))
            }
            sx={{ mb: 3, mt: 1 }}
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
