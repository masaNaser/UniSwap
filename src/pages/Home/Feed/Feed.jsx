import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
// icons
import {
  WavingHand,
  Image as ImageIcon,
} from "@mui/icons-material";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SelectActionCard from "../../../components/Cards/Cards";
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
import { getImageUrl } from "../../../utils/imageHelper";
import { useCurrentUser } from "../../../Context/CurrentUserContext";
import { useSearchParams } from "react-router-dom";
import PostCardSkeleton from "../../../components/Skeletons/PostCardSkeleton";
import dayjs from "dayjs";
import { isAdmin, getToken } from "../../../utils/authHelpers";
import { formatDateTime } from "../../../utils/timeHelper";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import EditPostModal from "../../../components/Modals/EditPostModal";
import { useTheme } from "@mui/material/styles";
import { getUserId, getUserName } from "../../../utils/authHelpers";
import LikesModal from "./LikesModal";

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
  const theme = useTheme();
  const [postsUpdated, setPostsUpdated] = useState(false);


  const { currentUser, loading, updateCurrentUser } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const postRefs = useRef({});

  // ✅ Infinite Scroll State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // const userToken = localStorage.getItem("accessToken");
  const userToken = getToken();
  const userName = getUserName();

  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [currentComments, setCurrentComments] = useState([]);
  const [modalPost, setModalPost] = useState(null);
  const [userIdCommenting, setUserIdCommenting] = useState(null);

  const admin = isAdmin(currentUser);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    postId: null,
  });

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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // بعد state الموجودة، أضف هاي:
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [currentPostLikes, setCurrentPostLikes] = useState([]);

  // أضف function جديدة:
  const handleShowLikes = (postLikes) => {
    setCurrentPostLikes(postLikes || []);
    setLikesModalOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ✅ تعديل fetchPosts لدعم الـ pagination
  const fetchPosts = async (pageNumber = 1, append = false) => {
    if (loadingMore) return;

    setLoadingMore(true);
    const startTime = Date.now();

    try {
      const response = await getPosts(userToken, pageNumber, 10); // ✅ 10 بوستات بالمرة
      console.log(response);

      const postsData = response.data.map((p) => ({
        id: p.id,
        content: p.content,
        selectedTags: Array.isArray(p.tags) && p.tags.length > 0 && p.tags[0]
          ? (typeof p.tags[0] === 'string' && p.tags[0].includes(',')
            ? p.tags[0].split(",").map(t => t.trim())
            : p.tags)
          : [],
        user: {
          name: p.author.userName,
          avatar: getImageUrl(p.author.profilePictureUrl, p.author.userName),
          id: p.author.id,
        },
        time: formatDateTime(p.createdAt),
        likes: p.likesCount,
        comments: p.commentsCount,
        shares: "",
        fileUrl: p.fileUrl ? `https://uni1swap.runasp.net/${p.fileUrl}` : null,
        isLiked: p.isLikedByMe || false,
        recentComments: [],
        likedBy: p.likedBy || [], // ✅ أضف هاد السطر
        isClosed: p.postStatus === "Closed",
      }));

      if (append) {
        // ✅ إضافة البوستات الجديدة
        setPosts((prev) => [...prev, ...postsData]);
      } else {
        setPosts(postsData);
      }

      // ✅ إذا رجع أقل من 10 معناها خلصت البوستات
      setHasMore(postsData.length === 10);
      // ✅ ضمان إن الـ loader يظهر على الأقل 800ms
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 800; // 800 milliseconds
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch posts.",
        severity: "error",
      });
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // ✅ Function لتحميل المزيد
  const loadMorePosts = useCallback(() => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  }, [page, hasMore, loadingMore]);

  // ✅ استخدام الـ Infinite Scroll Hook
  const observerRef = useInfiniteScroll(loadMorePosts, hasMore, loadingMore);

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


  const addPost = (newPost) => {
    const formattedPost = {
      ...newPost,
      selectedTags: newPost.selectedTags || [],
      isLiked: false,
      recentComments: [],
    };

    setPosts((prev) => [formattedPost, ...prev]);

    if (updateCurrentUser) {
      updateCurrentUser();
    }
    setPostsUpdated(Date.now());
  };
  useEffect(() => {
    // Refresh user data when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && updateCurrentUser) {
        updateCurrentUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateCurrentUser]);
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
  const handleFileRemovedFromPost = (postId) => {
    console.log("🗑️ Removing file from post in Feed:", postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, fileUrl: null } : p
      )
    );
  };
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
      previewUrl: "",
      removeFile: false,
      onFileRemoved: handleFileRemovedFromPost,
    });
  };;

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

  const handleEditPost = async () => {
    const { postId, content, tags, file, removeFile } = editDialog;

    setIsUpdating(true);

    try {
      const formData = new FormData();

      formData.append("Content", content);

      if (tags) {
        const tagsArray = typeof tags === 'string'
          ? tags.split(',').map(t => t.trim()).filter(Boolean)
          : tags;

        tagsArray.forEach(tag => {
          formData.append("Tags", tag);
        });
      }

      // ⚠️ الجزء المهم - لو الملف انحذف قبل، ما نبعث removeFile مرة ثانية
      if (removeFile === true && !editDialog.existingFileUrl) {
        // الملف انحذف فعلاً من السيرفر، ما نبعث شي
        formData.append("RemoveFile", "false");
      } else if (file) {
        formData.append("File", file);
        formData.append("RemoveFile", "false");
      } else {
        formData.append("RemoveFile", "false");
      }

      const response = await editPost(formData, userToken, postId);

      if (response.status === 204) {
        // Update post in state
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                ...p,
                content: content,
                selectedTags: typeof tags === 'string'
                  ? tags.split(',').map(t => t.trim()).filter(Boolean)
                  : tags,
                fileUrl: removeFile ? null : (file ? URL.createObjectURL(file) : p.fileUrl)
              }
              : p
          )
        );

        // Refresh from server
        await fetchPosts(1, false);
        setPage(1);
        setHasMore(true);

        closeEditDialog();
        setSnackbar({
          open: true,
          message: "Your post has been updated. ✓",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("❌ Error editing post:", error);
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
    const originalLikedBy = postToUpdate.likedBy || [];

    const currentUserId = getUserId();
    const updatedLikedBy = isCurrentlyLiked
      ? originalLikedBy.filter(user => user.id !== currentUserId) // Remove user
      : [
        ...originalLikedBy,
        {
          id: currentUserId,
          userName: currentUser?.userName || getUserName(),
          profilePictureUrl: currentUser?.profilePicture
        }
      ];

    setPosts((prev) =>
      updatePost(prev, postId, {
        isLiked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? originalLikes - 1 : originalLikes + 1,
        likedBy: updatedLikedBy
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
            likes: response.data.likesCount ?? (isCurrentlyLiked ? originalLikes - 1 : originalLikes + 1),
            likedBy: response.data.likedBy || updatedLikedBy
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
          likedBy: originalLikedBy
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
      const sortedComments = response.data
        .map((comment) => normalizeComment(comment, userName, currentUser))
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
      setModalPost(null);
    }
  };

  const handleAddComment = async (postId, content) => {
    const tempCommentId = Date.now();
    const currentUserId = getUserId();
    const currentUserAvatar = getImageUrl(
      currentUser?.profilePicture,
      userName
    );

    const newComment = {
      id: tempCommentId,
      content,
      createdAt: new Date(),
      author: {
        userName,
        avatar: currentUserAvatar,
      },
      authorId: currentUserId,
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
          ? { ...c, content: newContent, createdAt: new Date() }
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

  const handleSharePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, shares: p.shares } : p))
    );
  };

  const postIdFromUrl = searchParams.get("postId");
  const [loadingPostFromNotif, setLoadingPostFromNotif] = useState(false); // ✅ ضيفي هاد

  useEffect(() => {
    if (!postIdFromUrl || !posts.length || loadingPostFromNotif) return;

    const post = posts.find(p => p.id === postIdFromUrl);

    if (post) {
      console.log("✅ Scrolling to post:", postIdFromUrl);
      setTimeout(() => {
        const postElement = postRefs.current[postIdFromUrl];
        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedPostId(postIdFromUrl);
          setTimeout(() => {
            setHighlightedPostId(null);
            setSearchParams({});
          }, 3000);
        }
      }, 500);
    } else {
      console.log("🔄 Post not found, reloading page 1...");
      setLoadingPostFromNotif(true);
      setPage(1);
      setHasMore(true);

      fetchPosts(1, false).finally(() => {
        setTimeout(() => {
          const postElement = postRefs.current[postIdFromUrl];
          if (postElement) {
            postElement.scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightedPostId(postIdFromUrl);
            setTimeout(() => {
              setHighlightedPostId(null);
              setSearchParams({});
              setLoadingPostFromNotif(false);
            }, 3000);
          } else {
            setSnackbar({
              open: true,
              message: "Post not found.",
              severity: "info",
            });
            setSearchParams({});
            setLoadingPostFromNotif(false);
          }
        }, 1000);
      });
    }
  }, [postIdFromUrl, posts.length, loadingPostFromNotif]);

  useEffect(() => {
    fetchPosts(1, false); // ✅ التحميل الأول
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

        {!admin && (
          <div className="cards-section">
            <SelectActionCard
              title="My Posts"
              value={currentUser?.postsCount}
              icon={<ArticleOutlinedIcon />}
              iconBgColor={theme.palette.mode === 'dark' ? '#474646ff' : '#F1F5F9'}
            />
            <SelectActionCard
              title="Completed Projects"
              value={currentUser?.completedProjectsCount}
              icon={<WorkspacePremiumOutlinedIcon />}
              iconBgColor={theme.palette.mode === 'dark' ? '#474646ff' : '#F1F5F9'}
            />
            <SelectActionCard
              title="Rating"
              value={currentUser?.averageRating}
              icon={<GroupIcon />}
              iconBgColor={theme.palette.mode === 'dark' ? '#474646ff' : '#F1F5F9'}
            />
          </div>
        )}

        <div className="post-section">
          <div className="create-post-main">
            {!admin && <CreatePost addPost={addPost} token={userToken} />}

            <Box mt={3}>
              {loading ? (
                <Box mt={3}>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </Box>
              ) : (
                <>
                  {posts.map((post) => (
                    <Box
                      key={post.id}
                      ref={(el) => (postRefs.current[post.id] = el)}
                      sx={{
                        transition: "all 0.3s ease",
                        ...(highlightedPostId === post.id && {
                          animation: "highlight 2s ease-in-out",
                          "@keyframes highlight": {
                            "0%": {
                              boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)",
                              transform: "scale(1)",
                            },
                            "50%": {
                              boxShadow:
                                "0 0 20px 10px rgba(59, 130, 246, 0.4)",
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
                        onShowLikes={handleShowLikes} 

                        currentUserAvatar={getImageUrl(
                          currentUser?.profilePicture,
                          currentUser?.userName || userName
                        )}
                      />
                    </Box>
                  ))}

                  {/* ✅ Loading Indicator */}
                  {loadingMore && (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2.5,
                        borderRadius: "16px",
                        mx: 2,
                      }}
                    >
                      <CircularProgress size={40} sx={{ color: "#3B82F6" }} />
                      {/* <Typography
                        sx={{ mt: 2, color: "#6B7280", fontWeight: 500 }}
                      >
                        Loading more posts...
                      </Typography> */}
                    </Box>
                  )}

                  {/* ✅ العنصر المراقب للـ Infinite Scroll */}
                  <div ref={observerRef} style={{ height: "20px" }} />

                  {/* ✅ End Message */}
                  {/* {!hasMore && posts.length > 0 && (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                      <Typography
                        sx={{
                          color: "#9CA3AF",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        🎉 You've reached the end!
                      </Typography> */}
                  {/* <Typography
                        sx={{ color: "#D1D5DB", fontSize: "14px", mt: 0.5 }}
                      >
                        No more posts to show
                      </Typography> 
                    </Box>
                  )}*/}

                  {/* ✅ Empty State */}
                  {!loading && posts.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#6B7280", fontWeight: 600 }}
                      >
                        No posts yet
                      </Typography>
                      <Typography sx={{ color: "#9CA3AF", mt: 1 }}>
                        Be the first to share something!
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </div>

          {!admin && (
            <div className="feed-sidebar" style={{ flex: 1 }}>
              <Sidebar postsUpdated={postsUpdated} />
            </div>
          )}
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
          isPostClosed={modalPost?.isClosed}
        />
      </Container>

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

      <EditPostModal
        open={editDialog.open}
        onClose={closeEditDialog}
        editDialog={editDialog}
        setEditDialog={setEditDialog}
        onSubmit={handleEditPost}
        isUpdating={isUpdating}
        snackbar={snackbar}
        onSnackbarClose={handleSnackbarClose}
      />
      <LikesModal
        open={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        likes={currentPostLikes}
      />

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
