// src/pages/Home/Browse/ParentSubServiceProjects.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  TextField,
  Pagination,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import CustomButton from "../../../components/CustomButton/CustomButton";
import GenericModal from "../../../components/Modals/GenericModal";
import { CreateStudySupportSub } from "../../../services/studySupportService";
import { browseProjectsBySubService } from "../../../services/publishProjectServices";
import FilterSection from "../../../components/Filter/FilterSection";

// استخدمي نفس ProjectCard من SubServiceProjects
import { Card, CardMedia, CardContent, Chip, Avatar, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";

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
          image={project.img ? `https://uni1swap.runasp.net/${project.img}` : null}
          alt={project.title}
          sx={{
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            objectFit: "cover",
          }}
        />

        {project.finalRating > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
            }}
          >
            <StarIcon
              sx={{
                color: "#FFD700",
                fontSize: "1.1rem",
                filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: "700",
                fontSize: "0.9rem",
                color: "white",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
              }}
            >
              {project.finalRating.toFixed(1)}
            </Typography>
            {project.reviewCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                ({project.reviewCount})
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Link
            to={`/app/profile/${project.userId}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
              src={
                project.profilePicture
                  ? `https://uni1swap.runasp.net${project.profilePicture}`
                  : null
              }
            >
              {!project.profilePicture &&
                project.userName.substring(0, 2).toUpperCase()}
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
          component={Link}
          to={`/app/project/${project.id}`}
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

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pt: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {project.deliveryTimeInDays
                ? `${project.deliveryTimeInDays} days`
                : "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
            <Typography variant="caption" color="text.secondary">
              {project.points} pts
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const ParentSubServiceProjects = () => {
  const token = localStorage.getItem("accessToken");
  const { serviceId, subServiceId, parentSubServiceId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const serviceName = params.get("serviceName");
  const subServiceName = params.get("subServiceName");
  const parentSubServiceName = params.get("parentSubServiceName");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);

  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [publishFormData, setPublishFormData] = useState({
    title: "",
    description: "",
    img: null,
    file: null,
    tags: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRated, setSelectedRated] = useState("Highest Rated");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");

  // جلب المشاريع
  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await browseProjectsBySubService(
        token,
        parentSubServiceId,
        page,
        pageSize
      );
      console.log("Projects:", response.data);

      if (Array.isArray(response.data)) {
        setProjects(response.data);
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

  // دالة نشر المشروع
  const handlePublishProject = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("Title", publishFormData.title);
      formData.append("Description", publishFormData.description);
      formData.append("SubServiceId", subServiceId); // Computer Engineering
      formData.append("ParentSubServiceId", parentSubServiceId); // Data Structures

      if (publishFormData.img) {
        formData.append("Img", publishFormData.img);
      }

      if (publishFormData.file) {
        formData.append("File", publishFormData.file);
      }

      publishFormData.tags.forEach((tag) => {
        formData.append("Tags", tag);
      });

      const response = await CreateStudySupportSub(token, formData);
      console.log("Project published:", response.data);

      setOpenPublishModal(false);
      setPublishFormData({
        title: "",
        description: "",
        img: null,
        file: null,
        tags: [],
      });

      fetchProjects(page); // Refresh
    } catch (error) {
      console.error("Error publishing project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // الفلترة
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

    if (selectedRated === "Highest Rated") {
      filtered.sort((a, b) => (b.finalRating || 0) - (a.finalRating || 0));
    } else if (selectedRated === "Most Reviewed") {
      filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    if (selectedPrice === "Low to High") {
      filtered.sort((a, b) => (a.points || 0) - (b.points || 0));
    } else if (selectedPrice === "High to Low") {
      filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
    }

    return filtered;
  }, [projects, searchQuery, selectedRated, selectedPrice]);

  const filterItems = [
    {
      type: "menu",
      label: selectedRated,
      items: [
        { label: "Highest Rated", value: "Highest Rated" },
        { label: "Most Reviewed", value: "Most Reviewed" },
      ],
      onSelect: (value) => setSelectedRated(value),
    },
    {
      type: "menu",
      label: selectedPrice,
      items: [
        { label: "All Prices", value: "All Prices" },
        { label: "Low to High", value: "Low to High" },
        { label: "High to Low", value: "High to Low" },
      ],
      onSelect: (value) => setSelectedPrice(value),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
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
          to={`/app/browse/${serviceId}?name=${encodeURIComponent(serviceName)}`}
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
          <CustomButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenPublishModal(true)}
          >
            Publish Project
          </CustomButton>
        </Box>
      </Box>

      {/* Filter */}
      <FilterSection
        searchPlaceholder="Search projects..."
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        items={filterItems}
      />

      {/* Projects Grid */}
      {loading ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          Loading projects...
        </Typography>
      ) : filteredProjects.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          No projects found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard project={project} onEditClick={() => {}} />
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

      {/* Publish Modal */}
      <GenericModal
        open={openPublishModal}
        onClose={() => {
          setOpenPublishModal(false);
          setPublishFormData({
            title: "",
            description: "",
            img: null,
            file: null,
            tags: [],
          });
        }}
        title="Publish Study Project"
        icon={<SchoolIcon sx={{ color: "#3b82f6" }} />}
        primaryButtonText="Publish"
        onPrimaryAction={handlePublishProject}
        isSubmitting={isSubmitting}
      >
        <TextField
          fullWidth
          label="Project Title"
          value={publishFormData.title}
          onChange={(e) =>
            setPublishFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          sx={{ mb: 2 }}
          required
          disabled={isSubmitting}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={publishFormData.description}
          onChange={(e) =>
            setPublishFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          sx={{ mb: 2 }}
          required
          disabled={isSubmitting}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Project Image *
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setPublishFormData((prev) => ({
                ...prev,
                img: e.target.files[0],
              }))
            }
            required
            disabled={isSubmitting}
          />
          {publishFormData.img && (
            <Box sx={{ mt: 1 }}>
              <img
                src={URL.createObjectURL(publishFormData.img)}
                alt="Preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Project File *
          </Typography>
          <input
            type="file"
            onChange={(e) =>
              setPublishFormData((prev) => ({
                ...prev,
                file: e.target.files[0],
              }))
            }
            required
            disabled={isSubmitting}
          />
          {publishFormData.file && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Selected: {publishFormData.file.name}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          label="Tags (comma separated, optional)"
          placeholder="data structures, homework, algorithms"
          onChange={(e) => {
            const tags = e.target.value
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            setPublishFormData((prev) => ({ ...prev, tags }));
          }}
          disabled={isSubmitting}
        />
      </GenericModal>
    </Container>
  );
};

export default ParentSubServiceProjects;