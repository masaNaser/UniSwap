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
import { getPosts as getPostsApi } from "../../../services/postService";
import ProfilePic from "../../../assets/images/ProfilePic.jpg";
import { deletePost as deletePostApi } from "../../../services/postService";
import { editPost as editPostApi } from "../../../services/postService";
import { likePost as likePostApi } from "../../../services/postService";

import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
function Feed() {
  const [posts, setPosts] = useState([]);
  const userToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");
  const fetchPosts = async () => {
    try {
      const response = await getPostsApi(userToken);
      // console.log(response);
      const postsData = response.data.map((p) => ({
        id: p.id,
        content: p.content,
        selectedTags: p.tags?.[0]?.split(",") || [],
        user: {
          name: p.author.userName,
          avatar: ProfilePic,
        },
        time: new Date(p.createdAt).toLocaleString(),
        likes: p.likesCount,
        comments: p.commentsCount,
        shares: 0,
        fileUrl: p.fileUrl ? `http://uni.runasp.net/${p.fileUrl}` : null, // رابط كامل للصور
      }));
      setPosts(postsData);
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "Failed to create post.",
            icon: "error",
            timer: 3000,
            showConfirmButton: true,
          });
      console.error("Error fetching posts:", error);
    }
  };

 

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
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
   if(!postToEdit) return;
    const { value: formValues } = await Swal.fire({
      title: "Edit Post",
      html: `
      <textarea id="swal-input1" class="swal2-textarea" placeholder="Content">${
        postToEdit.content
      }</textarea>
      <input id="swal-input2" class="swal2-input" placeholder="Tags (comma separated)" value="${postToEdit.selectedTags.join(
        ","
      )}" />
      <input type="file" id="swal-input3" class="swal2-file"  />
      ${
        postToEdit.fileUrl
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
        popup: "my-swal-popup", // مودال بنص الصفحة
      },
        didOpen: () => {
    const fileInput = document.getElementById("swal-input3");
    const previewImg = document.getElementById("preview-img");

  fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = "block";
    previewImg.style.objectFit = "cover"; // مهم لتوسيط الصورة
    previewImg.style.width = "50%";
    previewImg.style.maxHeight = "200px";
    previewImg.style.margin = "20px auto 0 auto"; // يظل متوسّط

  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
  }
});

  },
      //preConfirm: دالة تُنفّذ قبل إغلاق المودال. هنا تعيد كائن يحتوي:
      preConfirm: () => ({
        content: document.getElementById("swal-input1").value,
        tags: document.getElementById("swal-input2").value,
        file: document.getElementById("swal-input3").files[0] || null,
      }),
    });
// حطينا الشرط عشان نتاكد انه المستخدم كبس ع سيف وارسل داتا 
    if (formValues) {
      Swal.fire({
        title: "Updating data...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        // هون ارسلنا الداتا للباك
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
                    ? URL.createObjectURL(formValues.file) // رابط مؤقت للصورة الجديدة
                    : postToEdit.fileUrl, // احتفظ بالقديمة إذا ما تغيّرت

          };

          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? updatedPost : p))
          );
          Swal.close(); // سكّر مودال التحديث

          Swal.fire({
            title: "Deleted!",
            text: "Your post has been deleted.",
            icon: "success",
            timer: 3000,
            showConfirmButton: true,
          });
        }
      } catch (error) {
        console.error("Error editing post:", error);
        Swal.close(); // سكّر مودال التحديث

        Swal.fire("Error", "Failed to update post", "error");
      }
    }
  };
  
  const handleLikePost = async(postId)=>{
    const response = await likePostApi(userToken,postId);
    console.log(response);
  }


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
                onLike ={handleLikePost}
              />
            ))}
          </Box>
        </div>

        <div className="feed-sidebar" style={{ flex: 1 }}>
          <Sidebar />
        </div>
      </div>
    </Container>
  );
}

export default Feed;
