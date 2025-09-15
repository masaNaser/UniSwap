import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Button } from "@mui/material";
import CustomButton from "../../../shared/CustomButton/CustomButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logoDesignImage from "../../../assets/images/ProfessionalLogoDesign.png";
import socialMediaImage from "../../../assets/images/SocialMediaPostDesign.png";
import businessCardImage from "../../../assets/images/BusinessCardDesign.png";

// Mock data for a specific sub-service
const mockData = {
  "branding-identity": {
    name: "Branding & Identity",
    description: "4 services available",
    projects: [
      {
        user: {
          name: "Sarah Wilson",
          initials: "SW",
          rating: 4.9,
          reviews: 127,
          level: "Top Rated",
        },
        title: "Professional Logo Design",
        imageUrl: logoDesignImage,
        description:
          "I will create a modern, professional logo design that perfectly represents your brand identity.",
        tags: ["Logo Design", "Branding"],
        deliveryTime: "3-5 days",
        sales: 89,
        price: 150,
      },
      {
        user: {
          name: "Alex Chen",
          initials: "AC",
          rating: 4.8,
          reviews: 94,
          level: "Level 2",
        },
        title: "Social Media Post Design",
        imageUrl: socialMediaImage,
        description:
          "Eye-catching social media designs for Instagram, Facebook, and other platforms.",
        tags: ["Social Media", "Graphics"],
        deliveryTime: "1-2 days",
        sales: 156,
        price: 75,
      },
      {
        user: {
          name: "Maria Garcia",
          initials: "MG",
          rating: 4.7,
          reviews: 73,
          level: "Level 1",
        },
        title: "Business Card Design",
        imageUrl: businessCardImage,
        description:
          "Professional business card designs that make a lasting impression.",
        tags: ["Business Cards", "Print Design"],
        deliveryTime: "2-3 days",
        sales: 67,
        price: 50,
      },
    ],
  },
};

const ProjectCard = ({ project }) => {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        height: "100%",
        width: 368,
        display: "flex",
        flexDirection: "column",
      }}
    >

      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={project.imageUrl}
          alt={project.title}
          sx={{
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <IconButton
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              "&:hover": { background: "rgba(255, 255, 255, 1)" },
            }}
            size="small"
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* User and rating info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
            {project.user.initials}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {project.user.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <StarIcon sx={{ fontSize: 16, color: "gold", mr: 0.5 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                {project.user.rating} ({project.user.reviews})
              </Typography>
              <Chip label={project.user.level} size="small" />
            </Box>
          </Box>
        </Box>

        {/* Project title and description */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 0.5 }}
        >
          {project.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {project.description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {project.tags.map((tag, i) => (
            <Chip key={i} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>

      {/* Bottom section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pt: 0,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {project.deliveryTime}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleOutlineIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {project.sales}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          ${project.price}
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <CustomButton
          fullWidth
        >
          Request Service
        </CustomButton>
      </Box>
    </Card>
  );
};

const SubServiceProjects = () => {
  const { subserviceName } = useParams();

  const subserviceData = mockData[subserviceName];

  const [anchorElRated, setAnchorElRated] = useState(null);
  const [anchorElPrice, setAnchorElPrice] = useState(null);

  const handleMenuClickRated = (event) => {
    setAnchorElRated(event.currentTarget);
  };

  const handleMenuClickPrice = (event) => {
    setAnchorElPrice(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElRated(null);
    setAnchorElPrice(null);
  };
  const [selectedRated, setSelectedRated] = useState("Highest Rated");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");


  if (!subserviceData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Sub-service not found!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Typography
          component={Link}
          to="/browse"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Services
        </Typography>
        <Typography
          component={Link}
          to={`/browse/design-creative`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Design & Creative
        </Typography>
        <Typography color="text.primary">{subserviceData.name}</Typography>
      </Breadcrumbs>

      {/* Header and Back Button */}
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
            {subserviceData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subserviceData.description}
          </Typography>
        </Box>
        <CustomButton
          component={Link}
          to={`/browse/design-creative`}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </CustomButton>
      </Box>

      {/* Search + Filters Container */}
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
          {/* Search Bar */}
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

          {/* Highest Rated Dropdown */}
          <Button
            variant="outlined"
            onClick={handleMenuClickRated}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              backgroundColor: "#fff",
              color: "text.primary",
              border: "1px solid #e0e0e0",
              "&:hover": { backgroundColor: "#f9f9f9" },
            }}
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


          {/* All Prices Dropdown */}
          <Button
            variant="outlined"
            onClick={handleMenuClickPrice}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              backgroundColor: "#fff",
              color: "text.primary",
              border: "1px solid #e0e0e0",
              "&:hover": { backgroundColor: "#f9f9f9" },
            }}
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


      {/* Project Cards Grid */}
      <Grid container spacing={3}>
        {subserviceData.projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubServiceProjects;
