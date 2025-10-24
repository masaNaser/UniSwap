import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Breadcrumbs,
    Avatar,
    Chip,
    Rating,
    TextField,
    Divider,
    Paper,
    Grid,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "../../../components/CustomButton/CustomButton";
import DisabledCustomButton from "../../../components/CustomButton/DisabledCustomButton";
import RequestServiceModal from "../../../components/Modals/RequestServiceModal";
import Point from "../../../assets/images/Point.svg";
import api from "../../../services/api";

const ProjectDetails = () => {
    const token = localStorage.getItem("accessToken");
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);

    // Modal State
    const [openModal, setOpenModal] = useState(false);

    const isReviewDisabled = reviewText.trim().length === 0 || !reviewRating;

    // جلب تفاصيل المشروع
    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/PublishProjects/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Project details:", response.data);
            setProject(response.data);
        } catch (err) {
            console.error("Error fetching project:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProjectDetails();
    }, [id]);

    // Handle Review Submit
    const handleReviewSubmit = () => {
        console.log("Review submitted:", { reviewText, reviewRating });
        setReviewText("");
        setReviewRating(0);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    if (!project) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">
                    Project not found!
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                sx={{ mb: 3 }}
            >
                <Typography
                    component={Link}
                    to="/app/browse"
                    color="inherit"
                    sx={{ textDecoration: "none" }}
                >
                    Services
                </Typography>
                <Typography color="text.primary">Project Details</Typography>
            </Breadcrumbs>

            {/* Back Button */}
            <Box sx={{ mb: 3 }}>
                <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <CustomButton
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </CustomButton>
                </div>
            </Box>

            {/* Main Content */}
            <Grid container spacing={4}>
                {/* Left Side - Project Details */}
                <Grid item xs={12} md={8}>
                    {/* Project Image */}
                    {project.img && (
                        <Box
                            component="img"
                            src={`https://uni.runasp.net${project.img}`}
                            alt={project.title}
                            sx={{
                                width: "100%",
                                height: "400px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                mb: 3,
                            }}
                        />
                    )}

                    {/* Project Title */}
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                        {project.title}
                    </Typography>

                    {/* User Info */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Avatar
                            sx={{ width: 48, height: 48, mr: 2 }}
                            src={
                                project.profilePicture
                                    ? `https://uni.runasp.net${project.profilePicture}`
                                    : null
                            }
                        >
                            {!project.profilePicture && project.userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                {project.userName || "Anonymous"}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Description */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                            Description
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {project.description}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Tags
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {project.tags.map((tag, i) => (
                                    <Chip
                                        key={i}
                                        label={tag}
                                        sx={{ bgcolor: "rgb(0 0 0 / 6%)" }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Attached File */}
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                            Attached Files
                        </Typography>
                        {project.filePath && project.filePath.trim() !== "" ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2.5,
                                    bgcolor: "rgb(106, 103, 254, 0.05)",
                                    borderRadius: "12px",
                                    border: "1px solid rgb(106, 103, 254, 0.2)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        bgcolor: "rgb(106, 103, 254, 0.1)",
                                        boxShadow: "0 4px 12px rgba(106, 103, 254, 0.15)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 48,
                                        height: 48,
                                        borderRadius: "8px",
                                        bgcolor: "rgb(106, 103, 254, 0.1)",
                                    }}
                                >
                                    <DownloadIcon sx={{ color: "#6A67FE", fontSize: 28 }} />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: "medium", mb: 0.5 }}>
                                        Project Attachment
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {project.filePath.split("/").pop()}
                                    </Typography>
                                </Box>
                                <CustomButton
                                    size="small"
                                    component="a"
                                    href={`https://uni.runasp.net${project.filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ minWidth: "100px" }}
                                >
                                    Download
                                </CustomButton>
                            </Paper>
                        ) : (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    p: 3,
                                    bgcolor: "rgb(0 0 0 / 3%)",
                                    borderRadius: "12px",
                                    border: "1px dashed #e0e0e0",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    No files attached to this project
                                </Typography>
                            </Paper>
                        )}
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Reviews Section */}
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                            Reviews
                        </Typography>

                        {/* Add Review Form */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                bgcolor: "rgb(0 0 0 / 2%)",
                                borderRadius: "12px",
                                mb: 3,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Leave a Review
                            </Typography>

                            {/* Rating */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Your Rating:
                                </Typography>
                                <Rating
                                    value={reviewRating}
                                    onChange={(event, newValue) => setReviewRating(newValue)}
                                    size="large"
                                />
                            </Box>

                            {/* Review Text */}
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Share your experience with this project..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                sx={{
                                    mb: 2,
                                    bgcolor: "#fff",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                    },
                                }}
                            />

                            {isReviewDisabled ? (
                                <DisabledCustomButton>Submit Review</DisabledCustomButton>
                            ) : (
                                <CustomButton onClick={handleReviewSubmit}>
                                    Submit Review
                                </CustomButton>
                            )}
                        </Paper>

                        {/* Reviews List (Placeholder) */}
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                No reviews yet. Be the first to review this project!
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side - Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: "12px",
                            border: "1px solid #e0e0e0",
                            ml: { xs: 0, md: 24 },
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                            Service Details
                        </Typography>

                        {/* Delivery Time */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTimeIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                                <Typography variant="body2" color="text.secondary">
                                    Delivery Time
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                {project.deliveryTimeInDays} days
                            </Typography>
                        </Box>

                        {/* Points */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 3,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <img src={Point} alt="points" style={{ width: 20, height: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Price
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {project.points} pts
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* Request Service Button */}
                        <CustomButton fullWidth size="large" onClick={() => setOpenModal(true)}>
                            Request Service
                        </CustomButton>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", textAlign: "center", mt: 2 }}
                        >
                            You'll be able to customize your request details
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Request Service Modal */}
            <RequestServiceModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                projectTitle={project.title}
                projectId={project.id}
                pointsBudget={project.points}
            />
        </Container>
    );
};

export default ProjectDetails;