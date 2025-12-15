import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Avatar,
  Pagination,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import { browseProjectsBySubService } from "../../../services/publishProjectServices";
import FilterSection from "../../../components/Filter/FilterSection";
import CustomButton from "../../../components/CustomButton/CustomButton";
import PublishProjectModal from "../../../components/Modals/PublishProjectModal";

const ProjectCard = ({ project, onEditClick,adminMode,onDeleteClick }) => {
  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === project.userId;
  const canEdit = isOwner || adminMode; // 🔥 صاحب المشروع أو الأدمن

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
        {/*  Menu للتعديل والحذف */}
      {canEdit && (
        <>
          <IconButton
            onClick={handleMenuOpen}
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
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onEditClick(project);
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1, color: "#3B82F6" }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onDeleteClick(project);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1, color: "#EF4444" }} />
              Delete
            </MenuItem>
          </Menu>
        </>
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
              {!project.profilePicture && project.userName.substring(0, 2).toUpperCase()}
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
          {project.tags?.length > 3 && (
            <>
              <Chip
                label="..."
                size="small"
                sx={{ bgcolor: "rgb(0 0 0 / 6%)", cursor: "pointer" }}
                onClick={(e) => {
                  const hiddenChips =
                    e.currentTarget.parentNode.querySelectorAll(".hidden-chip");
                  hiddenChips.forEach(
                    (chip) => (chip.style.display = "inline-flex")
                  );
                  e.currentTarget.style.display = "none";
                }}
              />
              {project.tags.slice(3).map((tag, i) => (
                <Chip
                  key={i + 3}
                  label={tag}
                  size="small"
                  className="hidden-chip"
                  sx={{ bgcolor: "rgb(0 0 0 / 6%)", display: "none" }}
                />
              ))}
            </>
          )}
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

export default function SubServiceProjects() {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subServiceName = params.get("name");
  const parentServiceName = params.get("parentName");
  const parentServiceId = params.get("parentId");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRated, setSelectedRated] = useState("Highest Rated");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const fetchServiceProject = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await browseProjectsBySubService(token, id, page, pageSize);
      
      if (Array.isArray(response.data)) {
        setProjects(response.data);
        setTotalPages(1);
        setTotalCount(response.data.length);
      } else if (response.data.items && Array.isArray(response.data.items)) {
        setProjects(response.data.items);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      } else {
        setProjects([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchServiceProject(page);
  }, [id, page]);

  // 🔥 الفلترة
  const filteredProjects = React.useMemo(() => {
    let filtered = [...projects];

    if (searchQuery.trim()) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRatedSelect = (value) => {
    setSelectedRated(value);
  };

  const handlePriceSelect = (value) => {
    setSelectedPrice(value);
  };

  const handleEditClick = (project) => {
    setProjectToEdit(project);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setProjectToEdit(null);
  };

  const handleEditSuccess = () => {
    fetchServiceProject(page);
  };

  const filterItems = [
    {
      type: 'menu',
      label: selectedRated,
      items: [
        { label: "Highest Rated", value: "Highest Rated" },
        { label: "Most Reviewed", value: "Most Reviewed" }
      ],
      onSelect: handleRatedSelect
    },
    {
      type: 'menu',
      label: selectedPrice,
      items: [
        { label: "All Prices", value: "All Prices" },
        { label: "Low to High", value: "Low to High" },
        { label: "High to Low", value: "High to Low" }
      ],
      onSelect: handlePriceSelect
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Loading projects...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
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
          to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(parentServiceName)}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {parentServiceName}
        </Typography>
        <Typography color="text.primary">{subServiceName}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {subServiceName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} {totalCount === 1 ? "project" : "projects"} available
          </Typography>
        </Box>
        <CustomButton
          component={Link}
          to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(parentServiceName)}`}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </CustomButton>
      </Box>

      <FilterSection
        searchPlaceholder="Search projects..."
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        items={filterItems}
      />

      {filteredProjects.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          No projects found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <ProjectCard project={project} onEditClick={handleEditClick} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 6 }}>
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

      {projectToEdit && (
        <PublishProjectModal
          open={editModalOpen}
          onClose={handleEditModalClose}
          publishProjectId={projectToEdit.id}
          existingProject={projectToEdit}
          isEditMode={true}
          onEditSuccess={handleEditSuccess}
        />
      )}
    </Container>
  );
}