import React, { useEffect, useState } from "react";
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

function Feed() {
    const [posts, setPosts] = useState([]);
    const userToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [currentComments, setCurrentComments] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await getPostsApi(userToken);
            console.log(response);
            const postsData = response.data.map((p) => ({
                id: p.id,
                content: p.content,
                selectedTags: p.tags?.[0]?.split(",") || [],
                user: {
                    name: p.author.userName,
                    avatar: ProfilePic,
                },
                time: dayjs(p.createdAt).format('DD MMM, hh:mm A'),
                likes: p.likesCount,
                comments: p.commentsCount,
                shares: 0,
                fileUrl: p.fileUrl ? `https://uni.runasp.net/${p.fileUrl}` : null,
                isLiked: p.isLikedByMe || false,
            }));
            setPosts(postsData);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch posts.",
                icon: "error",
                timer: 3000,
                showConfirmButton: true,
            });
            console.error("Error fetching posts:", error);
        }
    };

    const addPost = (newPost) => {
        setPosts([{ ...newPost, isLiked: false }, ...posts]);
    };

    const handleDeletePost = async (postId) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this post?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        });

        if (result.isConfirmed) {
            try {
                const response = await deletePostApi(userToken, postId);
                if (response.status === 204) {
                    setPosts(posts.filter((p) => p.id !== postId));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your post has been deleted.",
                        icon: "success",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error deleting post",
                    text: "Failed to delete post. Please try again.",
                    timer: 3000,
                    showConfirmButton: true,
                });
            }
        }
    };

    const handleEditPost = async (postId) => {
        const postToEdit = posts.find((p) => p.id === postId);
        if (!postToEdit) return;
        const { value: formValues } = await Swal.fire({
            title: "Edit Post",
            html: `
      <textarea id="swal-input1" class="swal2-textarea" placeholder="Content">${postToEdit.content
                }</textarea>
      <input id="swal-input2" class="swal2-input" placeholder="Tags (comma separated)" value="${postToEdit.selectedTags.join(
                    ","
                )}" />
      <input type="file" id="swal-input3" class="swal2-file" />
      ${postToEdit.fileUrl
                    ? `<img id="preview-img"
     src="${postToEdit.fileUrl || ''}"
     style="
       display: ${postToEdit.fileUrl ? 'block' : 'none'};
       width: 50%;
       max-height: 200px;
       object-fit: cover;
       border-radius: 6px;
       margin: 20px auto 0 auto;
     " />`
                    : ""
                }
    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Save",
            customClass: {
                popup: "my-swal-popup",
            },
            didOpen: () => {
                const fileInput = document.getElementById("swal-input3");
                const previewImg = document.getElementById("preview-img");

                fileInput.addEventListener("change", (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        previewImg.src = URL.createObjectURL(file);
                        previewImg.style.display = "block";
                        previewImg.style.objectFit = "cover";
                        previewImg.style.width = "50%";
                        previewImg.style.maxHeight = "200px";
                        previewImg.style.margin = "20px auto 0 auto";

                    } else {
                        previewImg.src = "";
                        previewImg.style.display = "none";
                    }
                });

            },
            preConfirm: () => ({
                content: document.getElementById("swal-input1").value,
                tags: document.getElementById("swal-input2").value,
                file: document.getElementById("swal-input3").files[0] || null,
            }),
        });

        if (formValues) {
            Swal.fire({
                title: "Updating data...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            try {
                const formData = new FormData();
                formData.append("Content", formValues.content);
                formData.append("Tags", formValues.tags);
                if (formValues.file) formData.append("File", formValues.file);

                const response = await editPostApi(formData, userToken, postId);
                console.log(response);
                if (response.status === 204) {
                    const updatedPost = {
                        id: postId,
                        content: formValues.content,
                        selectedTags: formValues.tags ? formValues.tags.split(",") : [],
                        user: postToEdit.user,
                        time: new Date().toLocaleString(),
                        likes: postToEdit.likes,
                        comments: postToEdit.comments,
                        shares: postToEdit.shares,
                        fileUrl: formValues.file
                            ? URL.createObjectURL(formValues.file)
                            : postToEdit.fileUrl,
                        isLiked: postToEdit.isLiked,
                    };

                    setPosts((prev) =>
                        prev.map((p) => (p.id === postId ? updatedPost : p))
                    );
                    Swal.close();

                    Swal.fire({
                        title: "Updated!",
                        text: "Your post has been updated.",
                        icon: "success",
                        timer: 3000,
                        showConfirmButton: true,
                    });
                }
            } catch (error) {
                console.error("Error editing post:", error);
                Swal.close();

                Swal.fire("Error", "Failed to update post", "error");
            }
        }
    };

    const handleLikePost = async (postId) => {
        const postToUpdate = posts.find(p => p.id === postId);
        if (!postToUpdate) return;

        const isCurrentlyLiked = postToUpdate.isLiked;
        const originalLikes = postToUpdate.likes;

        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        isLiked: !isCurrentlyLiked,
                        likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1,
                    }
                    : p
            )
        );

        try {
            let response;
            if (isCurrentlyLiked) {
                response = await unlikePostApi(userToken, postId);
            } else {
                response = await likePostApi(userToken, postId);
            }

            if (response.data && response.data.likesCount !== undefined) {
                setPosts(prevPosts =>
                    prevPosts.map(p =>
                        p.id === postId ? {
                            ...p,
                            isLiked: response.data.isLikedByMe || !isCurrentlyLiked,
                            likes: response.data.likesCount,
                        } : p
                    )
                );
            }

        } catch (error) {
            console.error(`Error ${isCurrentlyLiked ? 'unliking' : 'liking'} post:`, error);

            setPosts(prevPosts =>
                prevPosts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            isLiked: isCurrentlyLiked,
                            likes: originalLikes,
                        }
                        : p
                )
            );
            Swal.fire("Error", `Failed to ${isCurrentlyLiked ? 'unlike' : 'like'} post.`, "error");
        }
    };

    // Comment Handlers 
    const handleShowComments = async (postId) => {
        setCurrentPostId(postId);
        setCommentsModalVisible(true);

        setCurrentComments([]);

        try {
            const response = await getCommentsApi(userToken, postId);
            const normalizedComments = response.data.map(comment => ({
                ...comment,
                author: {
                    userName: comment.user?.userName || 'Anonymous',
                }
            }));

            setCurrentComments(normalizedComments);

        } catch (error) {
            console.error("Error fetching comments:", error);
            Swal.fire("Error", "Failed to load comments.", "error");
            setCommentsModalVisible(false);
        }
    };

    const handleAddComment = async (postId, content) => {
        const tempCommentId = Date.now();

        const newComment = {
            id: tempCommentId,
            content: content,
            createdAt: new Date().toISOString(),
            author: {
                userName: userName,
            }
        };

        setCurrentComments(prev => [newComment, ...prev]);
        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === postId ? { ...p, comments: p.comments + 1 } : p
            )
        );

        try {
            const response = await addCommentApi(userToken, postId, content);
            if (response.data && response.data.id) {
                const finalComment = {
                    ...response.data,
                    author: {
                        userName: response.data.user?.userName || userName,
                    }
                };

                setCurrentComments(prev =>
                    prev.map(c =>
                        c.id === tempCommentId ? finalComment : c
                    )
                );
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            Swal.fire("Error", "Failed to add comment.", "error");

            setCurrentComments(prev => prev.filter(c => c.id !== tempCommentId));
            setPosts(prevPosts =>
                prevPosts.map(p =>
                    p.id === postId ? { ...p, comments: p.comments - 1 } : p
                )
            );
        }
    };

    const handleDeleteComment = async (commentId) => {
        const postId = currentPostId;

        const originalComments = currentComments;
        setCurrentComments(prev => prev.filter(c => c.id !== commentId));

        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === postId ? { ...p, comments: p.comments - 1 } : p
            )
        );

        try {
            await deleteCommentApi(userToken, commentId);
        } catch (error) {
            console.error("Error deleting comment:", error);

            const status = error.response?.status;

            if (status === 404) {
                return;
            }

            Swal.fire("Error", "Failed to delete comment.", "error");

            setCurrentComments(originalComments);
            setPosts(prevPosts =>
                prevPosts.map(p =>
                    p.id === postId ? { ...p, comments: p.comments + 1 } : p
                )
            );
        }
    };

    const handleEditComment = async (commentId, newContent) => {

        const originalComments = [...currentComments];
        const originalContent = originalComments.find(c => c.id === commentId)?.content;

        setCurrentComments(prev =>
            prev.map(c => (c.id === commentId ? { ...c, content: newContent, createdAt: new Date().toISOString() } : c))
        );

        try {
            await editCommentApi(userToken, commentId, newContent);

        } catch (error) {
            console.error("Error editing comment:", error);

            setCurrentComments(originalComments);

            Swal.fire("Error", "Failed to update comment.", "error");
        }
    };


    useEffect(() => {
        fetchPosts();
    }, [userToken]);

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
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                                onEdit={handleEditPost}
                                onLike={handleLikePost}
                                onShowComments={handleShowComments}
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
                onCommentSubmit={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
                currentUserName={userName}
            />
        </Container>
    );
}

export default Feed;