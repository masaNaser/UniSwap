// src/pages/Home/Browse/ParentSubServiceProjects.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
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
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";

import CustomButton from "../../../components/CustomButton/CustomButton";
import StudyProjectModal from "../../../components/Modals/StudyProjectModal"; // 🔥 المودال الجديد
import { browseProjectsBySubService } from "../../../services/publishProjectServices";
import FilterSection from "../../../components/Filter/FilterSection";
import { getImageUrl } from "../../../utils/imageHelper";
import { isAdmin } from "../../../utils/authHelpers";

// Project Card Component
const ProjectCard = ({ project, onEditClick }) => {
  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === project.userId;
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
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

      <Box sx={{ position: "relative" }}>
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
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Link
            to={`/app/profile/${project.userId}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
              // src={getImageUrl(project.profilePicture, project.userName)}
                src={
                project.profilePicture
                  ? `https://uni1swap.runasp.net${project.profilePicture}`
                  : null
              }
            >
              {!project.profilePicture &&
                project.userName?.substring(0, 2).toUpperCase()}
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

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            mb: 1,
            display: "block",
            color: "black",
            textDecoration: "none",
            "&:hover": {
              color: "black",
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {project.title}
        </Typography>

        {project.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {project.description}
          </Typography>
        )}
        {project.filePath && typeof project.filePath === "string" && (
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
              border: "1px solid #3B82F6",
              borderRadius: "6px",
            }}
          >
            View File
          </Button>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2, mt: 2 }}>
          {project.tags?.slice(0, 3).map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{ bgcolor: "rgb(0 0 0 / 6%)" }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Component
const ParentSubServiceProjects = () => {
  const token = localStorage.getItem("accessToken");
  const { serviceId, subServiceId, parentSubServiceId } = useParams();
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

  // 🔥 Modal State
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
        console.log("Response data is an array:", response.data);
        setTotalPages(1);
      } else if (response.data.items) {
        setProjects(response.data.items);
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

  // 🔥 Open modal for creating
  const handleOpenCreateModal = () => {
    setEditData(null);
    setOpenModal(true);
  };

  // 🔥 Open modal for editing
  const handleOpenEditModal = (project) => {
    setEditData(project);
    setOpenModal(true);
  };

  // 🔥 Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  // 🔥 Success callback
  const handleSuccess = () => {
    fetchProjects(page);
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
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard
                  project={project}
                  onEditClick={handleOpenEditModal}
                />
              </Grid>
            ))}
          </Grid>

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

      {/* 🔥 Study Project Modal - واحد بس للكريييت والتعديل */}
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
