<<<<<<< HEAD
// import React from "react";
// import SelectActionCard from "../../../components/Cards/Cards";
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
// import GroupIcon from '@mui/icons-material/Group';
// import CreatePost from './CreatePost';
// import './feed.css';
// import {
//   Container
// } from "@mui/material";
// import { WavingHand } from "@mui/icons-material";
// import Sidebar from "./Sidebar";

// function Feed() {
//     return (
//         <Container maxWidth="lg" className="container">
//      <Sidebar></Sidebar>
//             <div className="welcome-section">
//                 <h1 className="welcome-heading">Welcome back, John! <WavingHand color="#eacc51bf"  className="wave"  /> </h1>
//                 <p className="welcome-subheading">Here's what's happening in your community today.</p>
//             </div>

//             <div className="cards-section">
//                 <SelectActionCard
//                     title="Active Services"
//                     value="12"
//                     icon={<AccessTimeIcon  />}
//                 />

//                 <SelectActionCard
//                     title="Completed Tasks"
//                     value="47"
//                     icon={<WorkspacePremiumOutlined/>}
//                 />

//                 <SelectActionCard
//                     title="Peer Rating"
//                     value="4.8"
//                     icon={<GroupIcon  />}
//                 />
//             </div>

//             <CreatePost />
//         </Container>
//     );
// }

// export default Feed;


// import React from "react";
// import SelectActionCard from "../../../components/Cards/Cards";
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
// import GroupIcon from '@mui/icons-material/Group';
// import CreatePost from './CreatePost';
// import Sidebar from './Sidebar';
// import './feed.css';
// import { Container } from "@mui/material";
// import { WavingHand } from "@mui/icons-material";

// function Feed() {
//     return (
//         <Container maxWidth="lg" className="container">
            
//             {/* محتوى الصفحة بدون sidebar */}
//             <div className="welcome-section">
//                 <h1 className="welcome-heading">
//                     Welcome back, John! <WavingHand color="#eacc51bf" className="wave" />
//                 </h1>
//                 <p className="welcome-subheading">
//                     Here's what's happening in your community today.
//                 </p>
//             </div>

//             <div className="cards-section">
//                 <SelectActionCard
//                     title="Active Services"
//                     value="12"
//                     icon={<AccessTimeIcon />}
//                 />

//                 <SelectActionCard
//                     title="Completed Tasks"
//                     value="47"
//                     icon={<WorkspacePremiumOutlinedIcon />}
//                 />

//                 <SelectActionCard
//                     title="Peer Rating"
//                     value="4.8"
//                     icon={<GroupIcon />}
//                 />
//             </div>

//             {/* CreatePost مع Sidebar */}
//             <div className="post-section" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '24px' }}>
                
//                 <div className="create-post-main" style={{ flex: 3 }}>
//                     <CreatePost />
//                 </div>

//                 <div className="feed-sidebar" style={{ flex: 1 }}>
//                     <Sidebar />
//                 </div>

//             </div>
//         </Container>
//     );
// }

// export default Feed;


// import React, { useState } from "react";
// import SelectActionCard from "../../../components/Cards/Cards";
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
// import GroupIcon from '@mui/icons-material/Group';
// import CreatePost from './CreatePost';
// import Sidebar from './Sidebar';
// import './feed.css';
// import { Container, Box } from "@mui/material";
// import { WavingHand } from "@mui/icons-material";

// function Feed() {
//     const [posts, setPosts] = useState([]); // نخزن كل البوستات هنا

//     const addPost = (newPost) => {
//         setPosts([newPost, ...posts]); // إضافة البوست الجديد في الأعلى
//     };

//     return (
//         <Container maxWidth="lg" className="container">
            
//             <div className="welcome-section">
//                 <h1 className="welcome-heading">
//                     Welcome back, John! <WavingHand color="#eacc51bf" className="wave" />
//                 </h1>
//                 <p className="welcome-subheading">
//                     Here's what's happening in your community today.
//                 </p>
//             </div>

//             <div className="cards-section">
//                 <SelectActionCard
//                     title="Active Services"
//                     value="12"
//                     icon={<AccessTimeIcon />}
//                 />
//                 <SelectActionCard
//                     title="Completed Tasks"
//                     value="47"
//                     icon={<WorkspacePremiumOutlinedIcon />}
//                 />
//                 <SelectActionCard
//                     title="Peer Rating"
//                     value="4.8"
//                     icon={<GroupIcon />}
//                 />
//             </div>

//             <div className="post-section" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginTop: '24px',flexWrap:"wrap" }}>
                
//                 <div className="create-post-main" style={{ flex: 3 }}>
//                     <CreatePost addPost={addPost} /> {/* نمرر الدالة للـ CreatePost */}

//                     {/* عرض البوستات تحت الفورم */}
//                     <Box mt={3}>
//                         {posts.map((post, index) => (
//                             <Box key={index} mb={2} p={2} bgcolor="#f5f5f5" borderRadius={2}>
//                                 <div>{post.content}</div>
//                                 <div style={{ fontSize: '12px', color: '#555' }}>{post.category}</div>
//                                 <div style={{ fontSize: '12px', color: '#888' }}>Tags: {post.selectedTags.join(', ')}</div>
//                             </Box>
//                         ))}
//                     </Box>
//                 </div>

//                 <div className="feed-sidebar" style={{ flex: 1 }}>
//                     <Sidebar />
//                 </div>

//             </div>
//         </Container>
//     );
// }

// export default Feed;


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
=======
import React from "react";
import SelectActionCard from "../../../components/Cards/Cards";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';
import CreatePost from './CreatePost';
import './feed.css';

function Feed() {
    return (
        <div className="main-container">

            <div className="welcome-section">
                <h1 className="welcome-heading">Welcome back, John! 👋</h1>
                <p className="welcome-subheading">Here's what's happening in your community today.</p>
            </div>

            <div className="cards-section">
                <SelectActionCard
                    title="Active Services"
                    value="12"
                    icon={<AccessTimeIcon fontSize="large" />}
                />

                <SelectActionCard
                    title="Completed Tasks"
                    value="47"
                    icon={<WorkspacePremiumIcon fontSize="large" />}
                />

                <SelectActionCard
                    title="Peer Rating"
                    value="4.8"
                    icon={<GroupIcon fontSize="large" />}
                />
            </div>

            <CreatePost />
        </div>
    );
}

export default Feed;
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
