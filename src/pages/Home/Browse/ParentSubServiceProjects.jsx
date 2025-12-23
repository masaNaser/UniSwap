// src/pages/Home/Browse/ParentSubServiceProjects.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import CustomButton from "../../../components/CustomButton/CustomButton";
import StudyProjectModal from "../../../components/Modals/StudyProjectModal";
import { browseProjectsBySubService } from "../../../services/publishProjectServices";
import FilterSection from "../../../components/Filter/FilterSection";
import { useCurrentUser } from "../../../Context/CurrentUserContext";
import { getImageUrl } from "../../../utils/imageHelper";
import { isAdmin, getToken, getUserId } from "../../../utils/authHelpers";
// Project Card Component
const ProjectCard = ({ project, onEditClick }) => {
  const currentUserId = getUserId();
  const isOwner = currentUserId === project.userId;
  const [expandedDescription, setExpandedDescription] = useState(false);

  const toggleDescription = (e) => {
    e.stopPropagation();
    setExpandedDescription(!expandedDescription);
  };

  const isLongDescription = (description) => {
    return description && description.length > 100;
  };

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      {isOwner && (
        <IconButton
          onClick={() => onEditClick(project)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              bgcolor: "white",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s",
          }}
          size="small"
        >
          <EditIcon sx={{ fontSize: 18, color: "#3B82F6" }} />
        </IconButton>
      )}

      {project.img && (
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(project.img)}
          alt={project.title}
          sx={{
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            objectFit: "cover",
          }}
        />
      )}

      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Link to={`/app/profile/${project.userId}`} style={{ textDecoration: "none" }}>
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
              src={getImageUrl(project.profilePicture, project.userName)}
              alt={project.userName}
            >
              {project.userName?.substring(0, 2).toUpperCase()}
            </Avatar>
          </Link>
          <Typography
            component={Link}
            to={`/app/profile/${project.userId}`}
            variant="body2"
            sx={{
              fontWeight: "medium",
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

        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mb: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "auto",
          }}
        >
          {project.title}
        </Typography>

        {/* Description with Read More and Scroll */}
        {project.description && (
          <Box sx={{ mb: 0, minHeight: "70px" }}>
            {!expandedDescription ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "13px",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {project.description}
              </Typography>
            ) : (
              <Box
                sx={{
                  maxHeight: "60px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 0.5,
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#F3F4F6",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#D1D5DB",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "#9CA3AF",
                    },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "13px",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {project.description}
                </Typography>
              </Box>
            )}
            {isLongDescription(project.description) && (
              <Typography
                variant="caption"
                sx={{
                  color: "#3B82F6",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "11px",
                  mt: 0.25,
                  display: "inline-block",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={toggleDescription}
              >
                {expandedDescription ? "Show less" : "Read more"}
              </Typography>
            )}
          </Box>
        )}

        {/* Tags Section */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1 }}>
          {project.tags?.slice(0, 3).map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              size="small"
              sx={{
                bgcolor: "rgb(0 0 0 / 6%)",
                fontWeight: 500,
              }}
            />
          ))}
          {project.tags?.length > 3 && (
            <>
              <Chip
                label="..."
                size="small"
                sx={{
                  bgcolor: "rgb(0 0 0 / 6%)",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  const parent = e.currentTarget.parentNode;
                  const hiddenChips = parent.querySelectorAll(".hidden-chip");
                  hiddenChips.forEach(
                    (chip) => (chip.style.display = "inline-flex")
                  );
                  e.currentTarget.style.display = "none";
                }}
              />
              {project.tags.slice(3).map((tag, idx) => (
                <Chip
                  key={idx + 3}
                  label={tag}
                  size="small"
                  className="hidden-chip"
                  sx={{
                    bgcolor: "rgb(0 0 0 / 6%)",
                    display: "none",
                    fontWeight: 500,
                  }}
                />
              ))}
            </>
          )}
        </Box>

        {/* Bottom Section - Project File Only */}
        <Box sx={{ mt: "auto" }}>
          {project.filePath && typeof project.filePath === "string" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                pt: 1.5,
              }}
            >
              <Button
                variant="text"
                size="small"
                startIcon={<FolderIcon sx={{ fontSize: 16 }} />}
                component="a"
                href={`https://uni1swap.runasp.net/${project.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  px: 1,
                  minWidth: "auto",
                }}
              >
                View File
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Component
const ParentSubServiceProjects = () => {
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  const { serviceId, subServiceId, parentSubServiceId } = useParams();
  const { updateCurrentUser, startTemporaryPolling } = useCurrentUser();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const serviceName = params.get("serviceName");
  const subServiceName = params.get("subServiceName");
  const parentSubServiceName = params.get("parentSubServiceName");
  const adminMode = isAdmin();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects
  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await browseProjectsBySubService(
        token,
        parentSubServiceId,
        page,
        pageSize
      );

      if (Array.isArray(response.data)) {
        setProjects(response.data);
        console.log("Full project data:", response.data[0]); // 🔍 Check this
        setTotalPages(1);
      } else if (response.data.items) {
        setProjects(response.data.items);
        console.log("Full project data:", response.data.items[0]); // 🔍 Check this
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (parentSubServiceId) {
      fetchProjects(page);
    }
  }, [parentSubServiceId, page]);

  // Open modal for creating
  const handleOpenCreateModal = () => {
    setEditData(null);
    setOpenModal(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (project) => {
    setEditData(project);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleSuccess = async () => {
    console.log("📚 Study project published successfully!");

    // Refresh the projects list
    fetchProjects(page);

    // Force update user points after publishing
    // Wait 1 seconds for backend to award the points
    setTimeout(async () => {
      console.log("🔄 Updating user points after study project publish...");

      if (updateCurrentUser) {
        await updateCurrentUser();
        console.log("✅ User points updated!");
      }
    }, 1000);
  };

  // Filter projects
  const filteredProjects = React.useMemo(() => {
    let filtered = [...projects];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [projects, searchQuery]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
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
        <Typography
          component={Link}
          to={`/app/browse/${serviceId}?name=${encodeURIComponent(
            serviceName
          )}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {serviceName}
        </Typography>
        <Typography
          component={Link}
          to={`/app/browse/${serviceId}/${subServiceId}/subjects?serviceName=${encodeURIComponent(
            serviceName
          )}&subServiceName=${encodeURIComponent(subServiceName)}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {subServiceName}
        </Typography>
        <Typography color="text.primary">{parentSubServiceName}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {parentSubServiceName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"} available
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomButton
            component={Link}
            to={`/app/browse/${serviceId}/${subServiceId}/subjects?serviceName=${encodeURIComponent(
              serviceName
            )}&subServiceName=${encodeURIComponent(subServiceName)}`}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back
          </CustomButton>
          {!adminMode && (
            <CustomButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
            >
              Publish Project
            </CustomButton>
          )}
        </Box>
      </Box>

      {/* Filter */}
      <FilterSection
        searchPlaceholder="Search projects..."
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Projects Grid */}
      {loading ? (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 4 }}
        >
          Loading projects...
        </Typography>
      ) : filteredProjects.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 4 }}
        >
          No projects found.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 5,
            }}
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEditClick={handleOpenEditModal}
              />
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </>
      )}

      {/* Study Project Modal */}
      <StudyProjectModal
        open={openModal}
        onClose={handleCloseModal}
        token={token}
        onSuccess={handleSuccess}
        editData={editData}
        parentSubServiceId={parentSubServiceId}
        subServiceId={subServiceId}
      />
    </Container>
  );
};

export default ParentSubServiceProjects;