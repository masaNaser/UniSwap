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