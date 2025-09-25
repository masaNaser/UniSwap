// import React, { useEffect, useState } from "react";
// import { Container, Box } from "@mui/material";
// import { WavingHand } from "@mui/icons-material";
// import SelectActionCard from "../../../components/Cards/Cards";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
// import GroupIcon from "@mui/icons-material/Group";
// import CreatePost from "./CreatePost";
// import PostCard from "./PostCard";
// import Sidebar from "./Sidebar";
// import "./feed.css";
// import { getPosts as getPostsApi } from "../../../services/postService";
// import ProfilePic from '../../../assets/images/ProfilePic.jpg';

// function Feed() {
//   const [posts, setPosts] = useState([]);
//   const userToken = localStorage.getItem("accessToken");

//   const fetchPosts = async () => {
//     try {
//       const response = await getPostsApi(userToken);
//       const postsData = response.data.map((p) => ({
//         id: p.id,
//         content: p.content,
//         selectedTags: p.tags?.[0]?.split(",") || [], // فصل التاجز
//         user: {
//           name: p.author?.userName || "Unknown User",
//           avatar: ProfilePic, // مؤقت لحد ما يكون عندنا صور مستخدمين
//         },
//         time: new Date(p.createdAt).toLocaleString(),
//         likes: p.likesCount || 0,
//         comments: p.commentsCount || 0,
//         shares: 0,
//         image: p.fileUrl ? `${p.fileUrl}` : null, // إذا في صورة نعرضها
//       }));
//       setPosts(postsData);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [userToken]);

//   const addPost = (newPost) => {
//     setPosts([newPost, ...posts]);
//   };

//   return (
//     <Container maxWidth="lg" className="container">
//       <div className="welcome-section">
//         <h1 className="welcome-heading">
//           Welcome back, John! <WavingHand className="wave" />
//         </h1>
//         <p className="welcome-subheading">
//           Here's what's happening in your community today.
//         </p>
//       </div>

//       <div className="cards-section">
//         <SelectActionCard title="Active Services" value="12" icon={<AccessTimeIcon />} />
//         <SelectActionCard title="Completed Tasks" value="47" icon={<WorkspacePremiumOutlinedIcon />} />
//         <SelectActionCard title="Peer Rating" value="4.8" icon={<GroupIcon />} />
//       </div>

//       <div className="post-section">
//         <div className="create-post-main">
//           <CreatePost addPost={addPost} token={userToken} />

//           <Box mt={3}>
//             {posts.map((post) => (
//               <PostCard key={post.id} post={post} />
//             ))}
//           </Box>
//         </div>

//         <div className="feed-sidebar" style={{ flex: 1 }}>
//           <Sidebar />
//         </div>
//       </div>
//     </Container>
//   );
// }

// export default Feed;

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
import ProfilePic from '../../../assets/images/ProfilePic.jpg';
import { deletePost as deletePostApi } from "../../../services/postService";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
function Feed() {
  const [posts, setPosts] = useState([]);
  const userToken = localStorage.getItem("accessToken");

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
        time: new Date(p.createdAt).toLocaleString(),
        likes: p.likesCount,
        comments: p.commentsCount,
        shares: 0,
        fileUrl: p.fileUrl ? `https://uniswap.runasp.net/${p.fileUrl}` : null, // رابط كامل للصور
      }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userToken]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  
 const handleDeletePost = async (postId) => {
  const result = await Swal.fire({
    title: "Are you sure you want to delete this post?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it"
  });

  if (result.isConfirmed) {
    try {
      const response = await deletePostApi(userToken, postId);
      if (response.status === 204) {
        setPosts(posts.filter((p) => p.id !== postId));
        Swal.fire("Deleted!", "Your post has been deleted.", "success",3000);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Swal.fire({
        icon: "error",
        title: "Error deleting post",
        text: "Failed to delete post. Please try again.",
      });
    }
  }
};

  return (
    <Container maxWidth="lg" className="container">
      <div className="welcome-section">
        <h1 className="welcome-heading">
          Welcome back, John! <WavingHand className="wave" />
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post}  onDelete={handleDeletePost}/>
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
