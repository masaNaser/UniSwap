// import * as React from "react";
// import { styled, alpha } from "@mui/material/styles";
// import {
//   AppBar,
//   Button,
//   Box,
//   Toolbar,
//   Badge,
//   IconButton,
//   Typography,
//   InputBase,
//   Container,
//   Menu,
//   MenuItem,
//   Avatar,
//   Divider,
//   ListItemIcon,
// } from "@mui/material";
// import { useCurrentUser } from "../../Context/CurrentUserContext";

// import MenuIcon from "@mui/icons-material/Menu";
// import SearchIcon from "@mui/icons-material/Search";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import MailIcon from "@mui/icons-material/Mail";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import Settings from "@mui/icons-material/Settings";
// import Logout from "@mui/icons-material/Logout";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import StarIcon from "@mui/icons-material/Star";
// import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// import logo from "../../assets/images/logo.png";
// import Point from "../../assets/images/Point.svg";
// import { Link, useNavigate } from "react-router-dom";
// import { logout } from "../../services/authService"; // أو المسار الصحيح عندك

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.black, 0.05),
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     marginLeft: theme.spacing(3),
//     width: "auto",
//   },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 1, 1, 0),
//     paddingLeft: `calc(0.5em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("md")]: {
//       width: "40ch",
//     },
//   },
// }));

// export default function PrimarySearchAppBar() {
//   const navigate = useNavigate();
//   const userName = localStorage.getItem("userName");
//   const {userData} = useProfile();

//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [mobileOpen, setMobileOpen] = React.useState(false);

//   // ✅ Toggle menu on/off
//   const handleProfileMenuOpen = (event) => {
//     if (anchorEl) {
//       setAnchorEl(null);
//     } else {
//       setAnchorEl(event.currentTarget);
//     }
//   };

//   // ✅ Close when clicking outside or choosing option
//   const handleMenuClose = () => setAnchorEl(null);

//   const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

//   React.useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

//   return (
//     <>
//       <AppBar
//         position="sticky"
//         sx={{ backgroundColor: "white !important", color: "black" }}
//         elevation={1}
//       >
//         <Container maxWidth="xl">
//           <Toolbar
//             sx={{
//               justifyContent: "space-between",
//               width: "100%",
//               bgcolor: "white",
//               gap: "21px",
//             }}
//           >
//             {/* Logo + Name */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Box component="img" src={logo} alt="logo" sx={{ width: 32, height: 32 }} />
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontWeight: "bold",
//                   color: "#74767a",
//                   display: { xs: "none", sm: "block" },
//                 }}
//               >
//                 UniSwap
//               </Typography>
//             </Box>

//             {/* Desktop Links (≥1029px) */}
//             {windowWidth >= 1029 && (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <Button
//                   className="nav-link"
//                   component={Link}
//                   to="/app/feed"
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "18px",
//                     color: "rgba(71, 85, 105, 1)",
//                   }}
//                 >
//                   Feed
//                 </Button>
//                 <Button
//                   component={Link}
//                   to="/app/browse"
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "18px",
//                     color: "rgba(71, 85, 105, 1)",
//                   }}
//                 >
//                   Browse
//                 </Button>
//                 <Button
//                   component={Link}
//                   to="/app/project"
//                   sx={{
//                     textTransform: "none",
//                     fontSize: "18px",
//                     color: "rgba(71, 85, 105, 1)",
//                   }}
//                 >
//                   Projects
//                 </Button>
//               </Box>
//             )}

//             {/* Search (≥768px) */}
//             <Box
//               sx={{
//                 display: { xs: "none", sm: "flex" },
//                 ml: 2,
//                 flex: 1,
//                 justifyContent: "center",
//               }}
//             >
//               <Search
//                 sx={{
//                   bgcolor: "#F8FAFC",
//                   width: "100%",
//                   maxWidth: windowWidth >= 1029 ? 300 : 400, // ✅ يصغر عند الشاشات الكبيرة
//                 }}
//               >
//                 <SearchIconWrapper>
//                   <SearchIcon />
//                 </SearchIconWrapper>
//                 <StyledInputBase
//                   placeholder="Search services, users, posts.."
//                   inputProps={{ "aria-label": "search" }}
//                 />
//               </Search>
//             </Box>

//             {/* Right Side Icons */}
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               {/* Points (≥1029px) */}
//               {windowWidth >= 1029 && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     bgcolor: "#eafaf2",
//                     borderRadius: 5,
//                     p: 1,
//                     mr: 2,
//                   }}
//                 >
//                   <Box component="img" src={Point} alt="points" sx={{ width: 30, height: 30 }} />
//                   <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745" }}>
//                     {userData?.totalPoints}
//                     <Typography component="span" sx={{ fontWeight: "normal" }}>
//                       pts
//                     </Typography>
//                   </Typography>
//                 </Box>
//               )}

//               {/* Icons */}
//               <IconButton size="large" color="inherit">
//                 <Badge badgeContent={4} color="error">
//                   <MailIcon />
//                 </Badge>
//               </IconButton>
//               <IconButton size="large" color="inherit">
//                 <Badge badgeContent={5} color="error">
//                   <NotificationsIcon />
//                 </Badge>
//               </IconButton>

//               {/* ✅ Account Menu */}
//               <IconButton
//                 size="large"
//                 edge="end"
//                 aria-haspopup="true"
//                 onClick={handleProfileMenuOpen}
//                 color="inherit"
//               >
//                 <AccountCircle />
//               </IconButton>

//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 PaperProps={{
//                   elevation: 3,
//                   sx: {
//                     mt: 1.5,
//                     overflow: "visible",
//                     filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
//                     borderRadius: "12px",
//                     minWidth: 230,
//                     "&:before": {
//                       content: '""',
//                       display: "block",
//                       position: "absolute",
//                       top: 0,
//                       right: 20,
//                       width: 10,
//                       height: 10,
//                       bgcolor: "background.paper",
//                       transform: "translateY(-50%) rotate(45deg)",
//                       zIndex: 0,
//                     },
//                   },
//                 }}
//                 transformOrigin={{ horizontal: "right", vertical: "top" }}
//                 anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1 }}>
//                   <Avatar sx={{ width: 40, height: 40, mr: 1 }} />
//                   <Box>
//                     <Typography sx={{ fontWeight: "bold" }}>{userName}</Typography>
//                   </Box>
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "center", px: 2, pb: 1 }}>
//                   <StarIcon sx={{ color: "orange", fontSize: 18, mr: 0.5 }} />
//                   <Typography sx={{ fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
//                     4.8
//                   </Typography>
//                   <Box sx={{ flex: 1 }} />
//                   <Typography sx={{ color: "green", fontWeight: "bold" }}>750</Typography>
//                 </Box>

//                 <Divider />

//                 <MenuItem
//                   onClick={() => {
//                     handleMenuClose();
//                     navigate("/app/profile");
//                   }}
//                 >
//                   <ListItemIcon>
//                     <PersonOutlineOutlinedIcon fontSize="small" />
//                   </ListItemIcon>
//                   Profile
//                 </MenuItem>

//                 <MenuItem onClick={handleMenuClose}>
//                   <ListItemIcon>
//                     <Settings fontSize="small" />
//                   </ListItemIcon>
//                   Settings
//                 </MenuItem>

//                 <MenuItem onClick={handleMenuClose}>
//                   <ListItemIcon>
//                     <AdminPanelSettingsIcon fontSize="small" />
//                   </ListItemIcon>
//                   Switch to Admin Mode
//                 </MenuItem>

//                 <Divider />

//                 <MenuItem
//                   onClick={() => {
//                     handleMenuClose();
//                     logout();
//                     navigate("/");
//                   }}
//                   sx={{ color: "red" }}
//                 >
//                   <ListItemIcon>
//                     <Logout fontSize="small" sx={{ color: "red" }} />
//                   </ListItemIcon>
//                   Sign Out
//                 </MenuItem>
//               </Menu>

//               {/* Mobile Menu Button (<1029px) */}
//               {windowWidth < 1029 && (
//                 <Box>
//                   <IconButton
//                     size="large"
//                     aria-label="show more"
//                     onClick={toggleMobileMenu}
//                     color="inherit"
//                   >
//                     <MenuIcon />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* Mobile Menu Panel (نفس الكود تبعك بدون تعديل) */}
//       {mobileOpen && windowWidth < 1029 && (
//         <Box
//           sx={{ width: "100%", bgcolor: "white", borderBottom: 1, borderColor: "divider" }}
//         >
//           <Container maxWidth="xl" sx={{ py: 1 }}>
//             <Button component={Link} to="/app/feed" fullWidth sx={{ justifyContent: "center" }}>
//               Feed
//             </Button>
//             <Button component={Link} to="/app/browse" fullWidth sx={{ justifyContent: "center" }}>
//               Browse
//             </Button>
//             <Button component={Link} to="/app/project" fullWidth sx={{ justifyContent: "center" }}>
//               Projects
//             </Button>

//             {windowWidth < 768 && (
//               <Box sx={{ display: "flex", mt: 1 }}>
//                 <Search sx={{ bgcolor: "#F8FAFC", width: "100%" }}>
//                   <SearchIconWrapper>
//                     <SearchIcon />
//                   </SearchIconWrapper>
//                   <StyledInputBase
//                     placeholder="Search services, users, posts.."
//                     inputProps={{ "aria-label": "search" }}
//                   />
//                 </Search>
//               </Box>
//             )}

//             <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   bgcolor: "#eafaf2",
//                   borderRadius: 5,
//                   p: 1,
//                   width: "80%",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Box component="img" src={Point} alt="points" sx={{ width: 30, height: 30 }} />
//                 <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745" }}>
//                   750{" "}
//                   <Typography component="span" sx={{ fontWeight: "normal" }}>
//                     pts
//                   </Typography>
//                 </Typography>
//               </Box>
//             </Box>
//           </Container>
//         </Box>
//       )}
//     </>
//   );
// }

import * as React from "react";
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
import { useCurrentUser } from "../../Context/CurrentUserContext"; // ✅ التغيير الأساسي
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
// import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StarIcon from "@mui/icons-material/Star";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Logo from "../../assets/images/Logo.png";
// import Point from "../../assets/images/Point.svg";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getImageUrl } from "../../utils/imageHelper";

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
  const userName = localStorage.getItem("userName");

  // ✅ استخدام currentUser بدل userData من ProfileContext
  const { currentUser } = useCurrentUser();
  console.log("currentUser", currentUser);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // ✅ Toggle menu on/off
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // ✅ Close when clicking outside or choosing option
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

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
                sx={{ width: 32, height: 32 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#74767a",
                  display: { xs: "none", sm: "block" },
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
                    color: "rgba(71, 85, 105, 1)",
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
                    color: "rgba(71, 85, 105, 1)",
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
                    color: "rgba(71, 85, 105, 1)",
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
                      backgroundColor: "#3B82F6", // لون الخلفية
                      borderRadius: "50%", // دائري
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
                    {/* ✅ استخدام currentUser بدل userData */}
                    {currentUser?.totalPoints || 0}{" "}
                    <Typography component="span" sx={{ fontWeight: "normal" }}>
                      pts
                    </Typography>
                  </Typography>
                </Box>
              )}

              {/* Icons */}
              <IconButton
                size="large"
                color="inherit"
                onClick={() => navigate("/chat")} // ✅ أضف هاي السطر
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={5} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* ✅ Account Menu */}
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
                onClose={handleMenuClose} //  بيشتغل لما تضغط برا
                onClick={handleMenuClose} //  بيشتغل لما تضغط جوا على item
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
                  sx={{ display: "flex", alignItems: "center", px: 2, py: 1 ,gap:1}}
                >
                  <Avatar
                    alt={currentUser?.userName || "User"}
                    src={getImageUrl(
                      currentUser?.profilePicture,
                      currentUser?.userName
                    )}
                    sx={{ width: 30, height: 30 }}
                  />{" "}
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
                    {/* ✅ استخدام currentUser.averageRating */}
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
                <Box
                  component="img"
                  src={Point}
                  alt="points"
                  sx={{ width: 30, height: 30 }}
                />
                <Typography
                  component="span"
                  sx={{ fontWeight: "bold", color: "#28a745" }}
                >
                  {/* ✅ استخدام currentUser في Mobile Menu */}
                  {currentUser?.totalPoints || 0}{" "}
                  <Typography component="span" sx={{ fontWeight: "normal" }}>
                    pts
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}
