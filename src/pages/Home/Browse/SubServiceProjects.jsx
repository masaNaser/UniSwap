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
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Pagination,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getProjectBySubServices as getProjectBySubServicesApi } from "../../../services/publishProjectServices";
import CustomButton from "../../../components/CustomButton/CustomButton";
import Point from "../../../assets/images/Point.svg";
import { Pagination as PaginationApi } from "../../../services/publishProjectServices";

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
      {/* صورة المشروع */}
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
        {/* User info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            sx={{ width: 32, height: 32, mr: 1 }}
            src={
              project.profilePicture
                ? `https://uni.runasp.net${project.profilePicture}`
                : null
            }
          >
            {!project.profilePicture && project.title.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {project.userName || "Anonymous"}
            </Typography>
          </Box>
        </Box>

        {/* Title - Clickable */}
        <Typography
          variant="subtitle1"
          component={Link}
          to={`/app/project/${project.id}`}
          sx={{
            fontWeight: "bold",
            mb: 1,
            display: "block",
            color: "inherit",
            textDecoration: "none",
            "&:hover": {
              color: "primary.main",
              textDecoration: "underline",
            },
          }}
        >
          {project.title}
        </Typography>

        {/* Tags */}
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

      {/* Bottom section - Delivery Time & Points */}
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

const SubServiceProjects = () => {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [anchorElRated, setAnchorElRated] = useState(null);
  const [anchorElPrice, setAnchorElPrice] = useState(null);
  const [selectedRated, setSelectedRated] = useState("Highest Rated");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subServiceName = params.get("name");
  const parentServiceName = params.get("parentName");
  const parentServiceId = params.get("parentId");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);

  const fetchServiceProject = async (page = 1) => {
    try {
      const response = await PaginationApi(token, page, pageSize);
      console.log("sub project data : ", response.data);
      setTotalPages(response.data.totalPages);
      setProjects(response.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchServiceProject(page);
  }, [id, page]);

  const handleMenuClickRated = (event) => setAnchorElRated(event.currentTarget);
  const handleMenuClickPrice = (event) => setAnchorElPrice(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorElRated(null);
    setAnchorElPrice(null);
  };

  if (!projects.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No projects found for this subservice.
        </Typography>
      </Container>
    );
  }

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
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {subServiceName}
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

      {/* Filters */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          p: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search services..."
            sx={{
              flexGrow: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              "& fieldset": { border: "1px solid #e0e0e0" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            onClick={handleMenuClickRated}
            sx={{ borderRadius: "12px", textTransform: "none" }}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {selectedRated}
          </Button>
          <Menu
            anchorEl={anchorElRated}
            open={Boolean(anchorElRated)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                setSelectedRated("Highest Rated");
                handleMenuClose();
              }}
            >
              Highest Rated
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedRated("Most Reviewed");
                handleMenuClose();
              }}
            >
              Most Reviewed
            </MenuItem>
          </Menu>

          <Button
            variant="outlined"
            onClick={handleMenuClickPrice}
            sx={{ borderRadius: "12px", textTransform: "none" }}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {selectedPrice}
          </Button>
          <Menu
            anchorEl={anchorElPrice}
            open={Boolean(anchorElPrice)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                setSelectedPrice("All Prices");
                handleMenuClose();
              }}
            >
              All Prices
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedPrice("Low to High");
                handleMenuClose();
              }}
            >
              Low to High
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedPrice("High to Low");
                handleMenuClose();
              }}
            >
              High to Low
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Project Grid */}
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 6 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          variant="outlined"
        />
      </Box>
    </Container>
  );
};

export default SubServiceProjects;