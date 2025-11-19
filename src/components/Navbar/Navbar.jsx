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
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StarIcon from "@mui/icons-material/Star";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getImageUrl } from "../../utils/imageHelper";
import { getUnreadCount } from "../../services/chatService"; // ✅ إضافة

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
  const token = localStorage.getItem("accessToken"); // ✅ إضافة

  const { currentUser } = useCurrentUser();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [unreadCount, setUnreadCount] = useState(0); // ✅ إضافة

  // ✅ جلب عدد الرسائل غير المقروءة
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token) return;
      
      try {
        const response = await getUnreadCount(token);
        setUnreadCount(response.data || 0);
      } catch (error) {
        console.error("❌ Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [token]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "white !important", color: "black" }}
        elevation={1}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              width: "100%",
              bgcolor: "white",
              gap: "21px",
            }}
          >
            {/* Logo + Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={Logo}
                alt="logo"
                sx={{ width: 37, height: 37, cursor: "pointer" }}
                onClick={() => navigate("/app/feed")}
              />
              <Typography
                variant="h6"
                onClick={() => navigate("/app/feed")}
                sx={{
                  fontWeight: "bold",
                  color: "#74767a",
                  display: { xs: "none", sm: "block" },
                  cursor: "pointer",
                }}
              >
                UniSwap
              </Typography>
            </Box>

            {/* Desktop Links (≥1029px) */}
            {windowWidth >= 1029 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  className="nav-link"
                  component={Link}
                  to="/app/feed"
                  sx={{
                    textTransform: "none",
                    fontSize: "18px",
                    color: isActive("/app/feed")
                      ? "#3B82F6"
                      : "rgba(71, 85, 105, 1)",
                    backgroundColor: isActive("/app/feed")
                      ? "#E0EEFF"
                      : "transparent",
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    fontWeight: isActive("/app/feed") ? "600" : "500",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#E0EEFF",
                    },
                  }}
                >
                  Feed
                </Button>
                <Button
                  component={Link}
                  to="/app/browse"
                  sx={{
                    textTransform: "none",
                    fontSize: "18px",
                    color: isActive("/app/browse")
                      ? "#3B82F6"
                      : "rgba(71, 85, 105, 1)",
                    backgroundColor: isActive("/app/browse")
                      ? "#E0EEFF"
                      : "transparent",
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    fontWeight: isActive("/app/browse") ? "600" : "500",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#E0EEFF",
                    },
                  }}
                >
                  Browse
                </Button>
                <Button
                  component={Link}
                  to="/app/project"
                  sx={{
                    textTransform: "none",
                    fontSize: "18px",
                    color: isActive("/app/project")
                      ? "#3B82F6"
                      : "rgba(71, 85, 105, 1)",
                    backgroundColor: isActive("/app/project")
                      ? "#E0EEFF"
                      : "transparent",
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    fontWeight: isActive("/app/project") ? "600" : "500",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#E0EEFF",
                    },
                  }}
                >
                  Projects
                </Button>
              </Box>
            )}

            {/* Search (≥768px) */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                ml: 2,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Search
                sx={{
                  bgcolor: "#F8FAFC",
                  width: "100%",
                  maxWidth: windowWidth >= 1029 ? 300 : 400,
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search services, users, posts.."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Points (≥1029px) */}
              {windowWidth >= 1029 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#3b82f638",
                    borderRadius: 5,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      backgroundColor: "#3B82F6",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      color: "#3B82F6",
                      fontSize: "20px",
                    }}
                  >
                    {currentUser?.totalPoints || 0}{" "}
                    <Typography component="span" sx={{ fontWeight: "normal" }}>
                      pts
                    </Typography>
                  </Typography>
                </Box>
              )}

              {/* Icons */}
              {/* ✅ أيقونة Messages مع العداد */}
              <IconButton
                size="large"
                color="inherit"
                onClick={() => {
                  navigate("/chat");
                  setUnreadCount(0); // إعادة تعيين عند الضغط
                }}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  color="error"
                  max={99}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.65rem',
                      height: '18px',
                      minWidth: '18px',
                    }
                  }}
                >
                  <MailIcon />
                </Badge>
              </IconButton>

              <IconButton size="large" color="inherit">
                <NotificationsIcon />
              </IconButton>

              {/* Account Menu */}
              <IconButton
                size="large"
                edge="end"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ p: 0 }}
              >
                <Avatar
                  alt={currentUser?.userName || "User"}
                  src={getImageUrl(
                    currentUser?.profilePicture,
                    currentUser?.userName
                  )}
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                    borderRadius: "12px",
                    minWidth: 230,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 20,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", px: 2, py: 1, gap: 1 }}
                >
                  <Avatar
                    alt={currentUser?.userName || "User"}
                    src={getImageUrl(
                      currentUser?.profilePicture,
                      currentUser?.userName
                    )}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Box>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {userName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", px: 2, pb: 1 }}
                >
                  <StarIcon sx={{ color: "orange", fontSize: 18, mr: 0.5 }} />
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "#555",
                    }}
                  >
                    {currentUser?.averageRating || "0"}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography
                    sx={{
                      color: "#3b82f6",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0, 75, 173, 0.84"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="8" cy="8" r="6"></circle>
                      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                      <path d="M7 6h1v4"></path>
                      <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                    </svg>
                    {currentUser?.totalPoints || 0}
                  </Typography>
                </Box>
                <Divider />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/app/profile");
                  }}
                >
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>

                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Switch to Admin Mode
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    logout();
                    navigate("/");
                  }}
                  sx={{ color: "red" }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: "red" }} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>

              {/* Mobile Menu Button (<1029px) */}
              {windowWidth < 1029 && (
                <Box>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    onClick={toggleMobileMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Panel */}
      {mobileOpen && windowWidth < 1029 && (
        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth="xl" sx={{ py: 1 }}>
            <Button
              component={Link}
              to="/app/feed"
              fullWidth
              sx={{ justifyContent: "center" }}
            >
              Feed
            </Button>
            <Button
              component={Link}
              to="/app/browse"
              fullWidth
              sx={{ justifyContent: "center" }}
            >
              Browse
            </Button>
            <Button
              component={Link}
              to="/app/project"
              fullWidth
              sx={{ justifyContent: "center" }}
            >
              Projects
            </Button>

            {windowWidth < 768 && (
              <Box sx={{ display: "flex", mt: 1 }}>
                <Search sx={{ bgcolor: "#F8FAFC", width: "100%" }}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search services, users, posts.."
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#eafaf2",
                  borderRadius: 5,
                  p: 1,
                  width: "80%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#3b82f6",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(0, 75, 173, 0.84"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6"></circle>
                    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                    <path d="M7 6h1v4"></path>
                    <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                  </svg>
                  {currentUser?.totalPoints || 0}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}