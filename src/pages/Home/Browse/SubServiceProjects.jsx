import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterSection from "../../../components/Filter/FilterSection";
import CustomButton from "../../../components/CustomButton/CustomButton";
import PublishProjectModal from "../../../components/Modals/PublishProjectModal";
import api from "../../../services/api";
import { getToken,getUserId } from "../../../utils/authHelpers";
const ProjectCard = ({ project, onEditClick, adminMode, onDeleteClick }) => {
  const currentUserId = getUserId();
  const isOwner = currentUserId === project.userId;
  const canEdit = isOwner || adminMode;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
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

  // Filter states - matching backend parameters
  const [searchQuery, setSearchQuery] = useState(""); // Local input value
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced value for API
  const [selectedSort, setSelectedSort] = useState("Highest Rated");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [selectedRating, setSelectedRating] = useState("All Ratings");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  // Debounce search input
  const debounceTimeout = useRef(null);

  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    // Cleanup
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);

  // Map frontend values to backend API parameters
  const mapSortToBackend = (sort) => {
    const mapping = {
      "Highest Rated": "highestrated",
      "Price: Low to High": "pricelowtohigh",
      "Price: High to Low": "pricehightolow",
    };
    return mapping[sort] || "highestrated";
  };

  const mapPriceToBackend = (price) => {
    const mapping = {
      "All Prices": null,
      "Under 50 pts": "under50",
      "50-100 pts": "50to100",
      "Over 100 pts": "over100",
    };
    return mapping[price];
  };

  const mapRatingToBackend = (rating) => {
    const mapping = {
      "All Ratings": null,
      "High": "high",
      "Average": "avg",
      "Low": "low",
    };
    return mapping[rating];
  };

  const fetchServiceProject = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        Page: currentPage.toString(),
        PageSize: pageSize.toString(),
      });

      // Add search if present (use debouncedSearch)
      if (debouncedSearch.trim()) {
        queryParams.append('Search', debouncedSearch.trim());
      }

      // Add sort
      const sortParam = mapSortToBackend(selectedSort);
      if (sortParam) {
        queryParams.append('SortBy', sortParam);
      }

      // Add price range
      const priceParam = mapPriceToBackend(selectedPrice);
      if (priceParam) {
        queryParams.append('PriceRange', priceParam);
      }

      // Add rating filter
      const ratingParam = mapRatingToBackend(selectedRating);
      if (ratingParam) {
        queryParams.append('RatingFilter', ratingParam);
      }

      console.log("📡 Fetching projects with params:", queryParams.toString());

      const response = await api.get(
        `/PublishProjects/browse/${id}?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Projects fetched:", response.data);

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
      console.error("❌ Error fetching projects:", err);
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change (reset to page 1) - use debouncedSearch instead of searchQuery
  useEffect(() => {
    if (id) {
      setPage(1);
      fetchServiceProject(1);
    }
  }, [id, debouncedSearch, selectedSort, selectedPrice, selectedRating]);

  // Fetch when page changes (only if page > 1 to avoid duplicate calls)
  useEffect(() => {
    if (id && page > 1) {
      fetchServiceProject(page);
    }
  }, [page]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update local state immediately
  };

  const handleSortSelect = (value) => {
    setSelectedSort(value);
  };

  const handlePriceSelect = (value) => {
    setSelectedPrice(value);
  };

  const handleRatingSelect = (value) => {
    setSelectedRating(value);
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
      label: selectedSort,
      items: [
        { label: "Highest Rated", value: "Highest Rated" },
        { label: "Price: Low to High", value: "Price: Low to High" },
        { label: "Price: High to Low", value: "Price: High to Low" }
      ],
      onSelect: handleSortSelect
    },
    {
      type: 'menu',
      label: selectedPrice,
      items: [
        { label: "All Prices", value: "All Prices" },
        { label: "Under 50 pts", value: "Under 50 pts" },
        { label: "50-100 pts", value: "50-100 pts" },
        { label: "Over 100 pts", value: "Over 100 pts" }
      ],
      onSelect: handlePriceSelect
    },
    {
      type: 'menu',
      label: selectedRating,
      items: [
        { label: "All Ratings", value: "All Ratings" },
        { label: "High", value: "High" },
        { label: "Average", value: "Average" },
        { label: "Low", value: "Low" }
      ],
      onSelect: handleRatingSelect
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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

      {projects.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          No projects found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={5}>
            {projects.map((project) => (
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