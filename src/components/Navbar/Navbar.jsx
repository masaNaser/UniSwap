import * as React from "react";
import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Button,
  Box,
  Toolbar,
  Badge,
  IconButton,
  Typography,
  InputBase,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useCurrentUser } from "../../Context/CurrentUserContext";

//icons
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from "@mui/icons-material/Notifications";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StarIcon from "@mui/icons-material/Star";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EqualizerIcon from '@mui/icons-material/Equalizer';

import { useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getImageUrl } from "../../utils/imageHelper";
import { useUnreadCount } from "../../Context/unreadCountContext";
import { isAdmin } from "../../utils/authHelpers";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(0.5em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName");

  const { currentUser } = useCurrentUser();
  const { unreadCount } = useUnreadCount();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const userIsAdmin = isAdmin();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toggleMobileMenu = () => setMobileOpen((p) => !p);

  // Updated isActive function to check if path starts with the route
  const isActive = (path) => {
    const currentPath = location.pathname;

    // Special handling for browse - includes /browse, /browse/:id, /services/:id/projects
    if (path === "/app/browse") {
      return currentPath.startsWith("/app/browse") || currentPath.startsWith("/app/services");
    }

    // Special handling for project - includes /app/project, /app/project/:id, and /app/TrackTasks/:taskId
    if (path === "/app/project") {
      return currentPath.startsWith("/app/project") || currentPath.startsWith("/app/TrackTasks");
    }

    // For other routes, exact match
    return currentPath === path;
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "white !important", color: "black" }} elevation={1}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", width: "100%", bgcolor: "white", gap: "21px" }}>

            {/* LOGO */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={Logo}
                alt="logo"
                sx={{ width: 37, height: 37, cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
              <Typography
                variant="h6"
                onClick={() => navigate("/")}
                sx={{ fontWeight: "bold", color: "#74767a", display: { xs: "none", sm: "block" }, cursor: "pointer" }}>
                UniSwap
              </Typography>
            </Box>

            {/* DESKTOP LINKS */}
            {windowWidth >= 1029 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button component={Link} to="/app/feed" sx={{
                  textTransform: "none", fontSize: "18px",
                  color: isActive("/app/feed") ? "#3B82F6" : "rgba(71,85,105,1)",
                  backgroundColor: isActive("/app/feed") ? "#E0EEFF" : "transparent",
                  borderRadius: "8px", px: 2, py: 1, fontWeight: isActive("/app/feed") ? "600" : "500"
                }}>
                  Feed
                </Button>

                <Button component={Link} to="/app/browse" sx={{
                  textTransform: "none", fontSize: "18px",
                  color: isActive("/app/browse") ? "#3B82F6" : "rgba(71,85,105,1)",
                  backgroundColor: isActive("/app/browse") ? "#E0EEFF" : "transparent",
                  borderRadius: "8px", px: 2, py: 1, fontWeight: isActive("/app/browse") ? "600" : "500"
                }}>
                  Browse
                </Button>

                {/* HIDE PROJECTS IF ADMIN */}
                {!userIsAdmin && (
                  <Button component={Link} to="/app/project" sx={{
                    textTransform: "none",
                    fontSize: "18px",
                    color: isActive("/app/project") ? "#3B82F6" : "rgba(71,85,105,1)",
                    backgroundColor: isActive("/app/project") ? "#E0EEFF" : "transparent",
                    borderRadius: "8px", px: 2, py: 1, fontWeight: isActive("/app/project") ? "600" : "500"
                  }}>
                    Projects
                  </Button>
                )}
              </Box>
            )}

            {/* SEARCH */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, ml: 2, flex: 1, justifyContent: "center" }}>
              <Search sx={{ bgcolor: "#F8FAFC", width: "100%", maxWidth: windowWidth >= 1029 ? 300 : 400 }}>
                <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase placeholder="Search services, users, posts.." />
              </Search>
            </Box>

            {/* RIGHT SIDE ICONS */}
            <Box sx={{ display: "flex", alignItems: "center" }}>

              {/* POINTS — HIDE IF ADMIN */}
              {!userIsAdmin && windowWidth >= 1029 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#3b82f638", borderRadius: 5, p: 1, mr: 2 }}>
                  <Box sx={{
                    width: 35, height: 35, backgroundColor: "#3B82F6",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="8" r="6"></circle>
                      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                      <path d="M7 6h1v4"></path>
                      <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                    </svg>
                  </Box>
                  <Typography sx={{ fontWeight: "bold", color: "#3B82F6", fontSize: "20px" }}>
                    {currentUser?.totalPoints || 0} <Typography component="span">pts</Typography>
                  </Typography>
                </Box>
              )}

              {/* CHAT — HIDE IF ADMIN */}
              {!userIsAdmin && (
                <IconButton size="large" color="inherit" onClick={() => navigate("/chat")}>
                  <Badge badgeContent={unreadCount} color="error" max={99}>
                    <MessageIcon />
                  </Badge>
                </IconButton>
              )}

              <IconButton size="large" color="inherit">
                <NotificationsIcon />
              </IconButton>

              {/* ACCOUNT MENU */}
              <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit" sx={{ p: 0 }}>
                <Avatar
                  alt={currentUser?.userName}
                  src={getImageUrl(currentUser?.profilePicture, currentUser?.userName)}
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>

              {/* MENU */}
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    overflow: "visible",
                    borderRadius: "12px",
                    minWidth: 230,
                  },
                }}>

                {/* HEADER */}
                <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1, gap: 1 }}>
                  <Avatar
                    alt={currentUser?.userName}
                    src={getImageUrl(currentUser?.profilePicture, currentUser?.userName)}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography sx={{ fontWeight: "bold" }}>{userName}</Typography>
                </Box>
                <Divider />

                {/* IF ADMIN → ONLY TWO ITEMS */}
                {userIsAdmin && (
                  <>
                    <MenuItem onClick={() => navigate("/admin")}>
                      <ListItemIcon><EqualizerIcon fontSize="small" /></ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      sx={{ color: "red" }}
                    >
                      <ListItemIcon><Logout fontSize="small" sx={{ color: "red" }} /></ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </>
                )}

                {/* IF NORMAL USER → ORIGINAL MENU */}
                {!userIsAdmin && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", px: 2, pb: 1 }}>
                      <StarIcon sx={{ color: "orange", fontSize: 18, mr: 0.5 }} />
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
                        {currentUser?.averageRating || "0"}
                      </Typography>

                      <Box sx={{ flex: 1 }} />

                      <Typography sx={{ color: "#3b82f6", fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                          viewBox="0 0 24 24" fill="none" stroke="rgba(0,75,173,0.84)"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="8" cy="8" r="6"></circle>
                          <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                          <path d="M7 6h1v4"></path>
                          <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                        </svg>
                        {currentUser?.totalPoints || 0}
                      </Typography>
                    </Box>
                    <MenuItem onClick={() => navigate("/app/profile")}>
                      <ListItemIcon><PersonOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
                      Profile
                    </MenuItem>

                    <MenuItem>
                      <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                      Settings
                    </MenuItem>

                    <MenuItem>
                      <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                      Switch to Admin Mode
                    </MenuItem>

                    <Divider />

                    <MenuItem
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      sx={{ color: "red" }}
                    >
                      <ListItemIcon><Logout fontSize="small" sx={{ color: "red" }} /></ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </>
                )}

              </Menu>

              {/* MOBILE MENU BUTTON */}
              {windowWidth < 1029 && (
                <Box>
                  <IconButton size="large" onClick={toggleMobileMenu} color="inherit">
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE MENU */}
      {mobileOpen && windowWidth < 1029 && (
        <Box sx={{ width: "100%", bgcolor: "white", borderBottom: 1 }}>
          <Container maxWidth="xl" sx={{ py: 1 }}>

            <Button component={Link} to="/app/feed" fullWidth>Feed</Button>
            <Button component={Link} to="/app/browse" fullWidth>Browse</Button>

            {!userIsAdmin && (
              <Button component={Link} to="/app/project" fullWidth>Projects</Button>
            )}

            {windowWidth < 768 && (
              <Box sx={{ display: "flex", mt: 1 }}>
                <Search sx={{ bgcolor: "#F8FAFC", width: "100%" }}>
                  <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                  <StyledInputBase placeholder="Search services, users, posts.." />
                </Search>
              </Box>
            )}

            {/* POINTS MOBILE — HIDE IF ADMIN */}
            {!userIsAdmin && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 1,
                  bgcolor: "#eafaf2", borderRadius: 5, p: 1, width: "80%",
                  justifyContent: "center"
                }}>
                  <Typography sx={{ color: "#3b82f6", fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                      viewBox="0 0 24 24" fill="none" stroke="rgba(0,75,173,0.84)"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="8" r="6"></circle>
                      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                      <path d="M7 6h1v4"></path>
                      <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                    </svg>
                    {currentUser?.totalPoints || 0}
                  </Typography>
                </Box>
              </Box>
            )}

          </Container>
        </Box>
      )}
    </>
  );
}