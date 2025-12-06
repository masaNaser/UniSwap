import * as React from "react";
import { useState, useEffect, useContext } from "react";
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
  Paper,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import { useCurrentUser } from "../../Context/CurrentUserContext";

//icons
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Logout from "@mui/icons-material/Logout";
import StarIcon from "@mui/icons-material/Star";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";

import { useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import MessegeIcon from "../../assets/images/MessegeIcon.svg";

import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getImageUrl } from "../../utils/imageHelper";
import { useUnreadCount } from "../../Context/unreadCountContext";
import { isAdmin } from "../../utils/authHelpers";
import { useNotifications } from "../../Context/NotificationContext";
import { ThemeModeContext } from "../../Context/ThemeContext";
import { useTheme } from "@mui/material/styles";

// ✅ Import Search API
import { Search } from "../../services/FeedService";

import NotificationMenu from "./NotificationMenu";

const SearchBox = styled("div")(({ theme }) => ({
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
  width: "100%",
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

// ✅ Enhanced Search Results Component with Beautiful Design
const SearchResultsDropdown = ({ 
  searchResults, 
  isSearching, 
  searchQuery,
  onPostClick, 
  onUserClick, 
  theme 
}) => {
  if (!searchQuery) return null;

  // Helper function to get user avatar
  const getUserAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=3B82F6&color=fff&bold=true&size=40`;
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "100%",
        mt: 1,
        width: "100%",
        maxHeight: 450,
        overflowY: "auto",
        zIndex: 1300,
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: theme.palette.mode === "dark" ? "#2d2d2d" : "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.mode === "dark" ? "#555" : "#888",
          borderRadius: "4px",
          "&:hover": {
            background: theme.palette.mode === "dark" ? "#666" : "#555",
          },
        },
      }}
    >
      {isSearching ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress size={32} thickness={4} />
          <Typography sx={{ mt: 2, color: theme.palette.text.secondary, fontSize: "0.9rem" }}>
            Searching...
          </Typography>
        </Box>
      ) : searchResults.users?.length === 0 && searchResults.posts?.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <SearchIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            No results found
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 0.5 }}>
            Try different keywords
          </Typography>
        </Box>
      ) : (
        <>
          {/* USERS SECTION */}
          {searchResults.users?.length > 0 && (
            <Box sx={{ py: 1 }}>
              <Typography
                sx={{
                  px: 2.5,
                  pt: 1.5,
                  pb: 1,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Users
              </Typography>
              {searchResults.users.map((user) => (
                <Box
                  key={user.id}
                  onClick={() => onUserClick(user.id)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderLeft: "3px solid transparent",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.08)",
                      borderLeftColor: "#3B82F6",
                      pl: 2.8,
                    },
                  }}
                >
                  {/* User Avatar */}
                  <Avatar
                    src={getUserAvatar(user.userName)}
                    alt={user.userName}
                    sx={{
                      width: 40,
                      height: 40,
                      border: `2px solid ${theme.palette.divider}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  
                  {/* User Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: theme.palette.text.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.userName}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                      <StarIcon sx={{ fontSize: 14, color: "#FFA500" }} />
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {user.averageRating?.toFixed(1) || "0.0"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Arrow Icon */}
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      transition: "all 0.2s ease",
                    }}
                    className="arrow-icon"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Box>
                </Box>
              ))}
              {searchResults.posts?.length > 0 && <Divider sx={{ my: 1.5 }} />}
            </Box>
          )}

          {/* POSTS SECTION */}
          {searchResults.posts?.length > 0 && (
            <Box sx={{ py: 1 }}>
              <Typography
                sx={{
                  px: 2.5,
                  pt: 1.5,
                  pb: 1,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Posts
              </Typography>
              {searchResults.posts.map((post) => (
                <Box
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderLeft: "3px solid transparent",
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.08)",
                      borderLeftColor: "#22C55E",
                      pl: 2.8,
                      "& .arrow-icon": {
                        transform: "translateX(3px)",
                        bgcolor: "#22C55E",
                        color: "white",
                      },
                    },
                  }}
                >
                  {/* Post Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === "dark" ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)",
                      flexShrink: 0,
                    }}
                  >
                    <ArticleIcon sx={{ color: "#22C55E", fontSize: 20 }} />
                  </Box>

                  {/* Post Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 0.5,
                      }}
                    >
                      {post.content || "Untitled Post"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: theme.palette.text.secondary,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 12 }} />
                      {post.author}
                    </Typography>
                  </Box>

                  {/* Arrow Icon */}
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                    className="arrow-icon"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default function PrimarySearchAppBar() {
  const theme = useTheme();
  const { notifications, unreadNotificationCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName");
  const { currentUser } = useCurrentUser();
  const { unreadCount } = useUnreadCount();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ✅ Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const userIsAdmin = isAdmin();

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ✅ Search Handler with Debounce
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        setShowSearchResults(true);
        try {
          const token = localStorage.getItem("token");
          const response = await Search(searchQuery, token);
          console.log("Search response:", response);
          setSearchResults(response.data || { posts: [], users: [] });
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults({ posts: [], users: [] });
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ posts: [], users: [] });
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClose = () => {
    setShowSearchResults(false);
  };

  const handlePostClick = (postId) => {
    navigate(`/app/feed?postId=${postId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleUserClick = (userId) => {
    navigate(`/app/profile/${userId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const toggleMobileMenu = () => setMobileOpen((p) => !p);

  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === "/app/browse") {
      return currentPath.startsWith("/app/browse") || currentPath.startsWith("/app/services");
    }
    if (path === "/app/project") {
      return currentPath.startsWith("/app/project") || currentPath.startsWith("/app/TrackTasks");
    }
    return currentPath === path;
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
        elevation={1}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: theme.palette.background.paper,
              gap: "21px",
            }}
          >
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

            {/* DESKTOP LINKS */}
            {windowWidth >= 1029 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  component={Link}
                  to="/app/feed"
                  sx={{
                    textTransform: "none",
                    fontSize: "18px",
                    color: isActive("/app/feed") ? "#3B82F6" : "rgba(71,85,105,1)",
                    backgroundColor: isActive("/app/feed") ? "#E0EEFF" : "transparent",
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    fontWeight: isActive("/app/feed") ? "600" : "500",
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
                    color: isActive("/app/browse") ? "#3B82F6" : "rgba(71,85,105,1)",
                    backgroundColor: isActive("/app/browse") ? "#E0EEFF" : "transparent",
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    fontWeight: isActive("/app/browse") ? "600" : "500",
                  }}
                >
                  Browse
                </Button>

                {!userIsAdmin && (
                  <Button
                    component={Link}
                    to="/app/project"
                    sx={{
                      textTransform: "none",
                      fontSize: "18px",
                      color: isActive("/app/project") ? "#3B82F6" : "rgba(71,85,105,1)",
                      backgroundColor: isActive("/app/project") ? "#E0EEFF" : "transparent",
                      borderRadius: "8px",
                      px: 2,
                      py: 1,
                      fontWeight: isActive("/app/project") ? "600" : "500",
                    }}
                  >
                    Projects
                  </Button>
                )}
              </Box>
            )}

            {/* ✅ DESKTOP SEARCH WITH RESULTS */}
            <ClickAwayListener onClickAway={handleSearchClose}>
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  ml: 2,
                  flex: 1,
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <SearchBox
                  sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#474646ff" : "#F8FAFC",
                    width: "100%",
                    maxWidth: windowWidth >= 1029 ? 300 : 400,
                  }}
                >
                  <SearchIconWrapper>
                    {isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search users, posts.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                  />
                </SearchBox>

                {showSearchResults && (
                  <SearchResultsDropdown
                    searchResults={searchResults}
                    isSearching={isSearching}
                    searchQuery={searchQuery}
                    onPostClick={handlePostClick}
                    onUserClick={handleUserClick}
                    theme={theme}
                  />
                )}
              </Box>
            </ClickAwayListener>

            {/* RIGHT SIDE ICONS */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!userIsAdmin && windowWidth >= 1029 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#3b82f638",
                    borderRadius: 5,
                    p: 1,
                    mr: 1,
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
                      stroke="white"
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
                  <Typography sx={{ fontWeight: "bold", color: "#3B82F6", fontSize: "20px" }}>
                    {currentUser?.totalPoints || 0} <Typography component="span">pts</Typography>
                  </Typography>
                </Box>
              )}

              {!userIsAdmin && (
                <IconButton size="large" color="inherit" onClick={() => navigate("/chat")} sx={{ p: 1 }}>
                  <Badge badgeContent={unreadCount} color="error" max={99}>
                    <img src={MessegeIcon} alt="Messege Icon" style={{ height: "20px", width: "20px", display: "block" }} />
                  </Badge>
                </IconButton>
              )}

              <NotificationMenu
                notifications={notifications}
                unreadNotificationCount={unreadNotificationCount}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                clearAll={clearAll}
              />

              <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit" sx={{ p: 0 }}>
                <Avatar
                  alt={currentUser?.userName}
                  src={getImageUrl(currentUser?.profilePicture, currentUser?.userName)}
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5, overflow: "visible", borderRadius: "12px", minWidth: 230 },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1, gap: 1 }}>
                  <Avatar
                    alt={currentUser?.userName}
                    src={getImageUrl(currentUser?.profilePicture, currentUser?.userName)}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography sx={{ fontWeight: "bold" }}>{userName}</Typography>
                </Box>
                <Divider />

                {userIsAdmin && (
                  <>
                    <MenuItem onClick={() => navigate("/admin")}>
                      <ListItemIcon>
                        <EqualizerIcon fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>

                    <MenuItem onClick={toggleMode}>
                      <ListItemIcon>
                        {mode === "light" ? <WbSunnyIcon fontSize="small" /> : <Brightness2Icon fontSize="small" />}
                      </ListItemIcon>
                      {mode === "light" ? "Light Mode" : "Dark Mode"}
                    </MenuItem>

                    <MenuItem onClick={() => { logout(); navigate("/"); }} sx={{ color: "red" }}>
                      <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: "red" }} />
                      </ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </>
                )}

                {!userIsAdmin && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", px: 2, pb: 1 }}>
                      <StarIcon sx={{ color: "orange", fontSize: 18, mr: 0.5 }} />
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
                        {currentUser?.averageRating || "0"}
                      </Typography>

                      <Box sx={{ flex: 1 }} />

                      <Typography sx={{ color: "#3b82f6", fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5 }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(0,75,173,0.84)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="8" cy="8" r="6"></circle>
                          <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
                          <path d="M7 6h1v4"></path>
                          <path d="m16.71 13.88.7.71-2.82 2.82"></path>
                        </svg>
                        {currentUser?.totalPoints || 0}
                      </Typography>
                    </Box>
                    <MenuItem onClick={() => navigate("/app/profile")}>
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>

                    <MenuItem onClick={toggleMode}>
                      <ListItemIcon>
                        {mode === "light" ? <WbSunnyIcon fontSize="small" /> : <Brightness2Icon fontSize="small" />}
                      </ListItemIcon>
                      {mode === "light" ? "Light Mode" : "Dark Mode"}
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={() => { logout(); navigate("/"); }} sx={{ color: "red" }}>
                      <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: "red" }} />
                      </ListItemIcon>
                      Sign Out
                    </MenuItem>
                  </>
                )}
              </Menu>

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
        <Box sx={{ width: "100%", bgcolor: theme.palette.background.paper, borderBottom: 1 }}>
          <Container maxWidth="xl" sx={{ py: 1 }}>
            <Button component={Link} to="/app/feed" fullWidth>Feed</Button>
            <Button component={Link} to="/app/browse" fullWidth>Browse</Button>
            {!userIsAdmin && (
              <Button component={Link} to="/app/project" fullWidth>Projects</Button>
            )}

            {/* ✅ MOBILE SEARCH WITH RESULTS */}
            <ClickAwayListener onClickAway={handleSearchClose}>
              <Box sx={{ display: "flex", mt: 1, position: "relative" }}>
                <SearchBox sx={{ bgcolor: theme.palette.mode === "dark" ? "#474646ff" : "#F8FAFC", width: "100%" }}>
                  <SearchIconWrapper>
                    {isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search users, posts.."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                  />
                </SearchBox>

                {showSearchResults && (
                  <SearchResultsDropdown
                    searchResults={searchResults}
                    isSearching={isSearching}
                    searchQuery={searchQuery}
                    onPostClick={handlePostClick}
                    onUserClick={handleUserClick}
                    theme={theme}
                  />
                )}
              </Box>
            </ClickAwayListener>

            {!userIsAdmin && (
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
                  <Typography sx={{ color: "#3b82f6", fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0,75,173,0.84)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
            )}
          </Container>
        </Box>
      )}
    </>
  );
}