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
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Pagination 
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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
        {/* <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              "&:hover": { background: "rgba(255, 255, 255, 1)" },
            }}
            size="small"
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Box> */}
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
            {/* <Chip label={`Points: ${project.points}`} size="small" /> */}
          </Box>
        </Box>

        {/* Title + description */}
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.9 }}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {project.description}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {project.tags?.slice(0, 3).map((tag, i) => (
            //هون بنعرض اول 3 تاجات
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{ bgcolor: "rgb(0 0 0 / 6%)" }}
            />
          ))}
          {project.tags?.length > 3 && (
            //بنفحص بالاول اذا في اكثر من 3 تاجات بنعرض ال... وبنخلي الباقي مخفية
            <>
              <Chip
                label="..."
                size="small"
                sx={{ bgcolor: "rgb(0 0 0 / 6%)", cursor: "pointer" }}
                onClick={(e) => {
                  //.parentNode → الصندوق الأب اللي يحتوي كل Chips (الـ Box)
                  const hiddenChips =
                    e.currentTarget.parentNode.querySelectorAll(".hidden-chip"); // اختيار التاجات المخفية
                  hiddenChips.forEach(
                    (chip) => (chip.style.display = "inline-flex")
                  ); // اظهار التاجات المخفية
                  e.currentTarget.style.display = "none"; // اخفاء ال...
                }}
              />

              {project.tags.slice(3).map((tag, i) => (
                // عرض التاجات الباقية المخفية بنبلش من التاج الرابع
                <Chip
                  key={i + 3}
                  label={tag}
                  size="small"
                  className="hidden-chip"
                  sx={{ bgcolor: "rgb(0 0 0 / 6%)", display: "none" }} //مخفي بالافتراضي , بنظهره لما نضغط على ال...
                />
              ))}
            </>
          )}
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
            {/* <PeopleOutlineIcon sx={{ fontSize: 16, color: "text.secondary" }} /> */}
            <img src={Point} sx={{ color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {project.points} pts
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <CustomButton fullWidth>Request Service</CustomButton>
      </Box>
    </Card>
  );
};

const SubServiceProjects = () => {
  const token = localStorage.getItem("accessToken");
  // هون ال id قيمته عبارة عن مثلا بقسم الستادي الاي دي هو عبارة عن تبع ال  Explain difficult concepts
  // Explain difficult concepts Id 
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [anchorElRated, setAnchorElRated] = useState(null);
  const [anchorElPrice, setAnchorElPrice] = useState(null);
  const [selectedRated, setSelectedRated] = useState("Highest Rated");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subServiceName = params.get("name"); // الاسم اللي جاي من الرابط
  const parentServiceName = params.get("parentName");
  // study support Id
   const parentServiceId = params.get("parentId");
  const[page, setPage] = useState(1);
  const pageSize = 6; // عدد المشاريع في كل صفحة  
const [totalPages, setTotalPages] = useState(1); // عدد الصفحات الكلي من API

  const fetchServiceProject = async (page=1) => {
    try {
      const response = await PaginationApi(token, page, pageSize);
      console.log("sub project data : ", response.data);
      setTotalPages(response.data.totalPages);
      setProjects(response.data.items);4
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchServiceProject(page);
  }, [id,page]);

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
     <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
  <Typography component={Link} to="/app/browse" color="inherit" sx={{ textDecoration: "none" }}>
    Services
  </Typography>
  <Typography component={Link} to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(parentServiceName)}`} color="inherit" sx={{ textDecoration: "none" }}>
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
          to={`/app/browse/${parentServiceId}?name=${encodeURIComponent(parentServiceName)}`}
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
  <Pagination
    count={totalPages}               // عدد الصفحات حسب الـ API
    page={page}                      // الصفحة الحالية
    //value → رقم الصفحة الجديدة اللي اختارها المستخدم
    onChange={(event, value) => setPage(value)} // لما المستخدم يختار صفحة جديدة
    color="primary"
    variant="outlined"
  />
</Box>

    </Container>
  );
};

export default SubServiceProjects;
