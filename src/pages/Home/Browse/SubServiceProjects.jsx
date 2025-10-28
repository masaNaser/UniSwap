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
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { browseProjectsBySubService } from "../../../services/publishProjectServices";
import FilterSection from "../../../components/Filter/FilterSection";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Point from "../../../assets/images/Point.svg";

const ProjectCard = ({ project }) => {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={project.img ? `https://uni.runasp.net${project.img}` : null}
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
            to={`/profile/${project.userId}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
              src={
                  project.profilePicture
                  ? `https://uni.runasp.net${project.profilePicture}`
                  : null
              }
            >
              {!project.profilePicture && project.userName.substring(0, 2).toUpperCase()}
            </Avatar>
          </Link>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {project.userName || "Anonymous"}
            </Typography>
          </Box>
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
            <img src={Point} alt="points" style={{ width: 16, height: 16 }} />
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

  const fetchServiceProject = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Debug logging
      console.log("Fetching projects with:", {
        subServiceId: id,
        page,
        pageSize,
        token: token ? "present" : "missing",
      });

      const response = await browseProjectsBySubService(
        token,
        id,
        page,
        pageSize
      );

      console.log("Projects data:", response.data);

      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
      setProjects(response.data.items);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRatedSelect = (value) => {
    setSelectedRated(value);
  };

  const handlePriceSelect = (value) => {
    setSelectedPrice(value);
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

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Loading projects...
        </Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  // No projects state
  if (!projects.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
            to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(
              parentServiceName
            )}`}
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
          <Typography variant="h4" component="h1">
            {subServiceName}
          </Typography>
          <CustomButton
            component={Link}
            to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(
              parentServiceName
            )}`}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back
          </CustomButton>
        </Box>

        <Typography variant="h6" color="text.secondary">
          No projects found for this subservice.
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
          to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(
            parentServiceName
          )}`}
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
          to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(
            parentServiceName
          )}`}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </CustomButton>
      </Box>

      {/* Filter Section */}
      <FilterSection
        searchPlaceholder="Search projects..."
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        items={filterItems}
      />

      {/* Project Grid */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
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
    </Container>
  );
}