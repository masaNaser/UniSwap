import React, { useState } from "react";
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

function Feed() {
  const [posts, setPosts] = useState([]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
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

      <div
        className="post-section"
        style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginTop: "24px", flexWrap: "wrap" }}
      >
        <div className="create-post-main">
          <CreatePost addPost={addPost} />

          <Box mt={3}>
            {posts.map((post, index) => (
              <PostCard key={index} post={post} />
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