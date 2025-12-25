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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import CustomButton from "../../../components/CustomButton/CustomButton";
import DisabledCustomButton from "../../../components/CustomButton/DisabledCustomButton";
import api from "../../../services/api";
import {
  addPublicReview,
  getPublicReviews,
} from "../../../services/reviewService";
import { formatDateTime } from "../../../utils/timeHelper";
import { getImageUrl } from "../../../utils/imageHelper";
import { getUserId } from "../../../utils/authHelpers";
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
  const [reviews, setReviews] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentUserId = getUserId();
  const isProjectOwner = currentUserId === project?.userId;
  const isReviewDisabled =
    reviewText.trim().length === 0 ||
    !reviewRating ||
    isSubmittingReview ||
    hasUserReviewed;

  // Fetch project details and reviews
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Fetching project details for ID:", id);

      const response = await api.get(`/PublishProjects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Project details:", response.data);
      setProject(response.data);

      // Fetch reviews
      await fetchReviews(id);
    } catch (err) {
      console.error("❌ Error fetching project:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load project"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async (publishProjectId) => {
    try {
      console.log("📡 Fetching reviews for project:", publishProjectId);
      const response = await getPublicReviews(publishProjectId, token);
      console.log("✅ Reviews fetched:", response.data);
      setReviews(response.data);

      // Check if current user has already reviewed
      if (currentUserId) {
        const userHasReviewed = response.data.some(
          (review) => review.reviewerId === currentUserId
        );
        setHasUserReviewed(userHasReviewed);
        console.log("👤 User has reviewed:", userHasReviewed);
      }
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
      // Don't set error state here, as reviews are not critical
      setReviews([]);
    }
  };

  useEffect(() => {
    if (id) fetchProjectDetails();
  }, [id]);

  // Handle Review Submit
  const handleReviewSubmit = async () => {
    if (isReviewDisabled) return;

    try {
      setIsSubmittingReview(true);
      console.log("📤 Submitting review:", {
        publishProjectId: id,
        rating: reviewRating,
        content: reviewText,
      });

      const response = await addPublicReview(
        id,
        reviewRating,
        reviewText,
        token
      );
      console.log("✅ Review submitted successfully:", response.data);

      // Clear form
      setReviewText("");
      setReviewRating(0);

      // Refresh reviews
      await fetchReviews(id);

      setSnackbar({
        open: true,
        message: "Review submitted successfully! 🎉",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error submitting review:", error);

      let errorMessage = "Failed to submit review. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
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
          sx={{ mb: 2 }}
        >
          <Typography
            component={Link}
            to="/app/browse"
            color="inherit"
            sx={{ textDecoration: "none" }}
          >
            Services
          </Typography>
          {project.serviceName && project.serviceId && (
            <Typography
              component={Link}
              to={`/app/browse/${project.serviceId}?name=${encodeURIComponent(
                project.serviceName
              )}`}
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              {project.serviceName}
            </Typography>
          )}
          {project.subServiceName && project.subServiceId && (
            <Typography
              component={Link}
              to={`/app/services/${
                project.subServiceId
              }/projects?name=${encodeURIComponent(
                project.subServiceName
              )}&parentName=${encodeURIComponent(
                project.serviceName
              )}&parentId=${project.serviceId}`}
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              {project.subServiceName}
            </Typography>
          )}
          <Typography color="text.primary">{project.title}</Typography>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          {" "}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            {project.img && !imgError ? (
              <Box
                component="img"
                src={`https://uni1swap.runasp.net/${project.img}`}
                alt={project.title}
                onError={() => setImgError(true)}
                sx={{
                  width: "100%",
height: { xs: "220px", sm: "280px", md: "350px" },
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ) : project.img && imgError ? (
              <Box
                sx={{
                  width: "100%",
height: { xs: "220px", sm: "280px", md: "350px" },
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
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#3B82F6",
                      borderRadius: "50%",
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
                <Typography variant="body2" sx={{ fontWeight: "medium" }} >
                  {project.points || 0} pts
                </Typography>
              </Box>
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
            fontSize: { xs: "1rem", md: "1.6rem" },
          }}
        >
          {project.title}
        </Typography>

        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            component={Link}
            to={`/app/profile/${project.userId}`}
            sx={{
              width: 56,
              height: 56,
              mr: 2.5,
              cursor: "pointer",
              textDecoration: "none",
            }}
            src={getImageUrl(project.profilePicture, project.userName)}
            alt={project.userName}
          >
            {project.userName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography
              component={Link}
              to={`/app/profile/${project.userId}`}
              variant="body1"
              sx={{
                fontWeight: "medium",
                fontSize: "1.05rem",
                textDecoration: "none",
                color: "inherit",
                "&:hover": {
                  color: "#3B82F6",
                  cursor: "pointer",
                },
              }}
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
            sx={{
              fontSize: "1.02rem",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
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
                flexWrap:"wrap",
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
                href={`https://uni1swap.runasp.net/${project.filePath}`}
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
            Reviews ({reviews.length})
          </Typography>

          {/* Add Review Form - Only show if NOT the project owner */}
          {!isProjectOwner && !hasUserReviewed ? (
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
                  disabled={isSubmittingReview}
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
                disabled={isSubmittingReview}
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
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </DisabledCustomButton>
              ) : (
                <CustomButton fullWidth onClick={handleReviewSubmit}>
                  Submit Review
                </CustomButton>
              )}
            </Paper>
          ) : !isProjectOwner && hasUserReviewed ? (
            <Alert severity="info" sx={{ mb: 4 }}>
              You have already reviewed this project. Thank you for your
              feedback!
            </Alert>
          ) : null}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    py: 2,
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: "1.1rem",
                      fontWeight: "600",
                    }}
                    src={getImageUrl(
                      review.reviewerPicture,
                      review.reviewerName
                    )}
                    alt={review.reviewerName}
                  >
                    {review.reviewerName?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  {/* Review Content */}
                  <Box sx={{ flex: 1 }}>
                    {/* Reviewer Name */}
                    <Typography
                      component={Link}
                      to={`/app/profile/${review.reviewerId}`}
                      variant="body1"
                      sx={{
                        fontWeight: "600",
                        mb: 0.5,
                        fontSize: "1rem",
                        textDecoration: "none",
                        color: "inherit",
                        cursor: "pointer",
                        "&:hover": {
                          color: "#3B82F6",
                        },
                      }}
                    >
                      {review.reviewerName || "Anonymous"}
                    </Typography>

                    {/* Rating with numeric value */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <StarIcon
                        sx={{
                          color: "#FFD700",
                          fontSize: "1.3rem",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "500",
                          fontSize: "1rem",
                        }}
                      >
                        {review.rating.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.9rem",
                          ml: 1,
                        }}
                      >
                        {formatDateTime(review.createdAt)}
                      </Typography>
                    </Box>

                    {/* Review Text */}
                    {review.content && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.primary",
                          lineHeight: 1.6,
                          fontSize: "0.95rem",
                        }}
                      >
                        {review.content}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                p: 4,
                bgcolor: "rgb(0 0 0 / 2%)",
                borderRadius: "12px",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {isProjectOwner
                  ? "No reviews yet."
                  : "No reviews yet. Be the first to review this project!"}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* Snackbar for notifications */}
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
            bgcolor:
              snackbar.severity === "success"
                ? "#3b82f6"
                : snackbar.severity === "error"
                ? "#EF4444"
                : undefined,
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
    </Box>
  );
};

export default ProjectDetails;
