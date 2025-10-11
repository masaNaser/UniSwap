import React, { useEffect, useState, useCallback } from "react";
import { Container, Box } from "@mui/material";
import { WavingHand } from "@mui/icons-material";
import SelectActionCard from "../../../components/Cards/Cards";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import GroupIcon from "@mui/icons-material/Group";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import Sidebar from "./Sidebar";
import "./feed.css";
import CommentsModal from './CommentsModal';
import {
    getPosts as getPostsApi,
    deletePost as deletePostApi,
    editPost as editPostApi,
    likePost as likePostApi,
    unlikePost as unlikePostApi,
    getComments as getCommentsApi,
    addComment as addCommentApi,
    deleteComment as deleteCommentApi,
    editComment as editCommentApi,
} from "../../../services/postService";
import ProfilePic from "../../../assets/images/ProfilePic.jpg";
import dayjs from 'dayjs';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// normalize comment
const normalizeComment = (comment, userName) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: {
        userName: comment.user?.userName,
        avatar: comment.user?.avatarUrl || ProfilePic,
    }
});

// update post by ID
const updatePost = (posts, postId, newData) =>
    posts.map(p => (p.id === postId ? { ...p, ...newData } : p));

// ظهور الصورة بصفحة تعديل البوست
const applyPreviewStyles = (img) => {
    img.style.display = "block";
    img.style.objectFit = "cover";
    img.style.width = "50%";
    img.style.maxHeight = "200px";
    img.style.margin = "20px auto 0 auto";
};

function Feed() {
    const [posts, setPosts] = useState([]);
    const userToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [currentComments, setCurrentComments] = useState([]);
    const [modalPost, setModalPost] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await getPostsApi(userToken);
            console.log(response);
            const postsData = response.data.map(p => ({
                id: p.id,
                content: p.content,
                selectedTags: p.tags?.[0]?.split(",") || [],
                user: { name: p.author.userName, avatar: ProfilePic },
                time: dayjs(p.createdAt).format('DD MMM, hh:mm A'),
                likes: p.likesCount,
                comments: p.commentsCount,
                shares: 0,
                fileUrl: p.fileUrl ? `https://uni.runasp.net/${p.fileUrl}` : null,
                isLiked: p.isLikedByMe || false,
                recentComments: [],
            }));
            setPosts(postsData);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch posts.",
                icon: "error",
                timer: 2000,
                showConfirmButton: true,
            });
            console.error("Error fetching posts:", error);
        }
    };

    const fetchRecentComments = useCallback(async (postId) => {
        try {
            const response = await getCommentsApi(userToken, postId);
            if (response.data?.length) {
                return response.data
                    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
                    .slice(0, 2)
                    .map(c => normalizeComment(c, userName));
            }
            return [];
        } catch (error) {
            console.error("Error fetching recent comments:", error);
            return [];
        }
    }, [userToken, userName]);

    useEffect(() => {
        if (posts.length) {
            posts.forEach(async post => {
                if (post.comments > 0 && post.recentComments.length === 0) {
                    const recentComments = await fetchRecentComments(post.id);
                    setPosts(prev => updatePost(prev, post.id, { recentComments }));
                }
            });
        }
    }, [posts.length, fetchRecentComments]);

    const addPost = (newPost) =>
        setPosts([{ ...newPost, isLiked: false, recentComments: [] }, ...posts]);

    const handleDeletePost = async (postId) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this post?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await deletePostApi(userToken, postId);
            if (response.status === 204) {
                setPosts(posts.filter(p => p.id !== postId));

                Swal.fire({ title: "Deleted!", text: "Your post has been deleted.", icon: "success", timer: 2000, showConfirmButton: false });
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            Swal.fire({ icon: "error", title: "Error deleting post", text: "Failed to delete post. Please try again.", timer: 2000, showConfirmButton: true });
        }
    };

    const handleEditPost = async (postId) => {
        const postToEdit = posts.find(p => p.id === postId);
        if (!postToEdit) return;

        const { value: formValues } = await Swal.fire({
            title: "Edit Post",
            html: `
                <textarea id="swal-input1" class="swal2-textarea" placeholder="Content">${postToEdit.content}</textarea>
                <input id="swal-input2" class="swal2-input" placeholder="Tags (comma separated)" value="${postToEdit.selectedTags.join(",")}" />
                <input type="file" id="swal-input3" class="swal2-file" />
                ${postToEdit.fileUrl ? `<img id="preview-img" src="${postToEdit.fileUrl}" />` : ""}
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Save",
            customClass: { popup: "my-swal-popup" },
           didOpen: () => {
    const fileInput = document.getElementById("swal-input3");
    let previewImg = document.getElementById("preview-img");

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];

        if (file) {
            if (!previewImg) {
                // إذا ما في صورة موجودة، نخلق عنصر <img>
                previewImg = document.createElement("img");
                previewImg.id = "preview-img";
                fileInput.insertAdjacentElement("afterend", previewImg);
            }
            previewImg.src = URL.createObjectURL(file);
            applyPreviewStyles(previewImg);
        } else if (previewImg) {
            previewImg.src = "";
            previewImg.style.display = "none";
        }
    });

    // إذا فيه صورة موجودة مسبقاً، نطبق الستايلي
    if (previewImg) applyPreviewStyles(previewImg);
}
,
            preConfirm: () => ({
                content: document.getElementById("swal-input1").value,
                tags: document.getElementById("swal-input2").value,
                file: document.getElementById("swal-input3").files[0] || null,
            }),
        });

        if (!formValues) return;

        Swal.fire({ title: "Updating data...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            const formData = new FormData();
            formData.append("Content", formValues.content);
            formData.append("Tags", formValues.tags);
            if (formValues.file) formData.append("File", formValues.file);

            const response = await editPostApi(formData, userToken, postId);
            console.log(response);

            if (response.status === 204) {
                const updatedPost = {
                    ...postToEdit,
                    content: formValues.content,
                    selectedTags: formValues.tags ? formValues.tags.split(",") : [],
                    time: new Date().toLocaleString(),
                    fileUrl: formValues.file ? URL.createObjectURL(formValues.file) : postToEdit.fileUrl,
                };
                setPosts(prev => updatePost(prev, postId, updatedPost));
                Swal.close();

                Swal.fire({ title: "Updated!", text: "Your post has been updated.", icon: "success", timer: 2000, showConfirmButton: true });
            }
        } catch (error) {
            console.error("Error editing post:", error);
            Swal.close();
            Swal.fire("Error", "Failed to update post", "error");
        }
    };

    const handleLikePost = async (postId) => {
        const postToUpdate = posts.find(p => p.id === postId);
        if (!postToUpdate) return;

        const isCurrentlyLiked = postToUpdate.isLiked;
        const originalLikes = postToUpdate.likes;

        setPosts(prev => updatePost(prev, postId, { isLiked: !isCurrentlyLiked, likes: isCurrentlyLiked ? originalLikes - 1 : originalLikes + 1 }));

        try {
            const response = isCurrentlyLiked
                ? await unlikePostApi(userToken, postId)
                : await likePostApi(userToken, postId);

            if (response.data?.likesCount !== undefined) {
                setPosts(prev => updatePost(prev, postId, { isLiked: response.data.isLikedByMe || !isCurrentlyLiked, likes: response.data.likesCount }));
            }
        } catch (error) {
            console.error(`Error ${isCurrentlyLiked ? 'unliking' : 'liking'} post:`, error);
            setPosts(prev => updatePost(prev, postId, { isLiked: isCurrentlyLiked, likes: originalLikes }));
            Swal.fire("Error", `Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} post.`, "error");
        }
    };

    const handleShowComments = async (postId) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        setCurrentPostId(postId);
        setModalPost(post);
        setCommentsModalVisible(true);
        setCurrentComments([]);

        try {
            const response = await getCommentsApi(userToken, postId);
            const sortedComments = response.data
                .map(comment => normalizeComment(comment, userName))
                .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
            setCurrentComments(sortedComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            Swal.fire("Error", "Failed to load comments.", "error");
            setCommentsModalVisible(false);
            setModalPost(null);
        }
    };

    const handleAddComment = async (postId, content) => {
        const tempCommentId = Date.now();
        const newComment = { id: tempCommentId, content, createdAt: new Date().toISOString(), author: { userName, avatar: ProfilePic } };

        // Update modal and posts instantly
        if (currentPostId === postId) setCurrentComments(prev => [newComment, ...prev]);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1, recentComments: [newComment, ...p.recentComments].slice(0, 2) } : p));

        try {
            const response = await addCommentApi(userToken, postId, content);
            if (response.data?.id) {
                const finalComment = normalizeComment(response.data, userName);
                setCurrentComments(prev => prev.map(c => c.id === tempCommentId ? finalComment : c));
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, recentComments: [finalComment, ...p.recentComments.filter(c => c.id !== tempCommentId)].slice(0, 2) } : p));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            Swal.fire("Error", "Failed to add comment.", "error");
            setCurrentComments(prev => prev.filter(c => c.id !== tempCommentId));
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments - 1, recentComments: p.recentComments.filter(c => c.id !== tempCommentId) } : p));
        }
    };

    const handleDeleteComment = async (commentId) => {
        const postId = currentPostId;
        const originalComments = currentComments;
        setCurrentComments(prev => prev.filter(c => c.id !== commentId));

        let shouldRefetchRecent = false;
        let originalRecentComments = [];

        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                originalRecentComments = p.recentComments;
                if (p.recentComments.some(c => c.id === commentId)) shouldRefetchRecent = true;
                return { ...p, comments: p.comments - 1, recentComments: p.recentComments.filter(c => c.id !== commentId) };
            }
            return p;
        }));

        try {
            await deleteCommentApi(userToken, commentId);
            if (shouldRefetchRecent) {
                const newRecentComments = await fetchRecentComments(postId);
                setPosts(prev => updatePost(prev, postId, { recentComments: newRecentComments }));
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            if (error.response?.status !== 404) {
                Swal.fire("Error", "Failed to delete comment.", "error");
                setCurrentComments(originalComments);
                setPosts(prev => updatePost(prev, postId, { comments: originalRecentComments.length, recentComments: originalRecentComments }));
            }
        }
    };

    const handleEditComment = async (commentId, newContent) => {
        const originalComments = [...currentComments];
        const originalComment = originalComments.find(c => c.id === commentId);
        const originalContent = originalComment?.content;
        const postId = currentPostId;

        setCurrentComments(prev => prev.map(c => c.id === commentId ? { ...c, content: newContent, createdAt: new Date().toISOString() } : c));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, recentComments: p.recentComments.map(c => c.id === commentId ? { ...c, content: newContent, createdAt: new Date().toISOString() } : c) } : p));

        try {
            await editCommentApi(userToken, commentId, newContent);
        } catch (error) {
            console.error("Error editing comment:", error);
            setCurrentComments(originalComments);
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, recentComments: p.recentComments.map(c => c.id === commentId ? { ...c, content: originalContent, createdAt: originalComment.createdAt } : c) } : p));
            Swal.fire("Error", "Failed to update comment.", "error");
        }
    };

    useEffect(() => { fetchPosts(); }, [userToken]);

    return (
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
                <SelectActionCard title="Active Services" value="12" icon={<AccessTimeIcon />} />
                <SelectActionCard title="Completed Tasks" value="47" icon={<WorkspacePremiumOutlinedIcon />} />
                <SelectActionCard title="Peer Rating" value="4.8" icon={<GroupIcon />} />
            </div>

            <div className="post-section">
                <div className="create-post-main">
                    <CreatePost addPost={addPost} token={userToken} />
                    <Box mt={3}>
                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                                onEdit={handleEditPost}
                                onLike={handleLikePost}
                                onShowComments={handleShowComments}
                                onAddCommentInline={handleAddComment}
                                fetchRecentComments={fetchRecentComments}
                            />
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
            />
        </Container>
    );
}

export default Feed;