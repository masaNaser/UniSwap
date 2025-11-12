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
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Modal State
  const [openModal, setOpenModal] = useState(false);

  const isReviewDisabled = reviewText.trim().length === 0 || !reviewRating;

  // Fetch project details
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching project details for ID:", id);

      const response = await api.get(`/PublishProjects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Project details:", response.data);
      setProject(response.data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load project"
      );
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
        <Typography variant="h6">Loading project details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
        <CustomButton
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </CustomButton>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Project not found!
        </Typography>
        <CustomButton
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </CustomButton>
      </Container>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      {/* Breadcrumbs */}
      <Container maxWidth="lg">
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <CustomButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Back
            </CustomButton>
          </div>
        </Box>
      </Container>

      {/* TOP SECTION - Image on Left (70%) + Service Details Card on Right (30%) */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          <Box sx={{ flex: 2, minWidth: 0 }}>
            {project.img && !imgError ? (
              <Box
                component="img"
                src={`https://uni.runasp.net${project.img}`}
                alt={project.title}
                onError={() => setImgError(true)}
                sx={{
                  width: "100%",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ) : project.img && imgError ? (
              <Box
                sx={{
                  width: "100%",
                  height: "350px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgb(0 0 0 / 5%)",
                  borderRadius: "12px",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Image not available
                </Typography>
              </Box>
            ) : null}
          </Box>

          {/* Right - Service Details Card */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "12px",
                border: "1px solid #e0e0e0",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 3, fontSize: "1.2rem" }}
              >
                Service Details
              </Typography>

              {/* Delivery Time */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Delivery Time
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {project.deliveryTimeInDays || "N/A"}{" "}
                  {project.deliveryTimeInDays ? "days" : ""}
                </Typography>
              </Box>

              {/* Points */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {/* <img src={Point} alt="points" style={{ width: 20, height: 20 }} /> */}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#3B82F6", // لون الخلفية
                      borderRadius: "50%", // دائري
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255, 255, 255, 1)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="8" cy="8" r="6"></circle>
                      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                      <path d="M7 6h1v4"></path>
                      <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                    </svg>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {project.points || 0} pts
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Request Service Button */}
              <CustomButton
                fullWidth
                size="large"
                onClick={() => setOpenModal(true)}
              >
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
          </Box>
        </Box>
      </Container>

      {/* BOTTOM SECTION */}
      <Container maxWidth="lg">
        {/* Project Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
          }}
        >
          {project.title}
        </Typography>

        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{ width: 56, height: 56, mr: 2.5 }}
            src={
              project.profilePicture
                ? `https://uni.runasp.net${project.profilePicture}`
                : undefined
            }
          >
            {!project.profilePicture &&
              (project.userName?.[0]?.toUpperCase() || "U")}
          </Avatar>
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", fontSize: "1.05rem" }}
            >
              {project.userName || "Anonymous"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, fontSize: "1.3rem" }}
          >
            Description
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.02rem", lineHeight: 1.8 }}
          >
            {project.description || "No description provided."}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, fontSize: "1.3rem" }}
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {project.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    sx={{
                      bgcolor: "rgb(0 0 0 / 6%)",
                      fontSize: "0.95rem",
                      py: "22px",
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Divider sx={{ mb: 4 }} />
          </>
        )}

        {/* Attached File */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, fontSize: "1.3rem" }}
          >
            Attached Files
          </Typography>
          {project.filePath && project.filePath.trim() !== "" ? (
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 3,
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
                  width: 56,
                  height: 56,
                  borderRadius: "8px",
                  bgcolor: "rgb(106, 103, 254, 0.1)",
                }}
              >
                <DownloadIcon sx={{ color: "#6A67FE", fontSize: 32 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", mb: 0.5, fontSize: "1.05rem" }}
                >
                  Project Attachment
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {project.filePath.split("/").pop()}
                </Typography>
              </Box>
              <CustomButton
                size="small"
                component="a"
                href={`https://uni.runasp.net${project.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ minWidth: "120px" }}
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
                p: 4,
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

        <Divider sx={{ mb: 5 }} />

        {/* Reviews Section */}
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 3, fontSize: "1.3rem" }}
          >
            Reviews
          </Typography>

          {/* Add Review Form */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: "rgb(0 0 0 / 2%)",
              borderRadius: "12px",
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontSize: "1.1rem" }}>
              Leave a Review
            </Typography>

            {/* Rating */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: "500" }}>
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
              rows={5}
              placeholder="Share your experience with this project..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              sx={{
                mb: 3,
                bgcolor: "#fff",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            {isReviewDisabled ? (
              <DisabledCustomButton fullWidth>
                Submit Review
              </DisabledCustomButton>
            ) : (
              <CustomButton fullWidth onClick={handleReviewSubmit}>
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
      </Container>

      {/* Request Service Modal */}
      <RequestServiceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        projectTitle={project.title}
        projectId={project.id}
        pointsBudget={project.points}
      />
    </Box>
  );
};

export default ProjectDetails;
