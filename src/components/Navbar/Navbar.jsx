// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import {
//   AppBar,
//   Button,
//   Box,
//   Toolbar,
//   Badge,
//   MenuItem,
//   Menu,
//   IconButton,
//   Typography,
//   InputBase,
//   Container,
// }
//   from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MoreIcon from '@mui/icons-material/MoreVert';
// import logo from "../../assets/images/logo.png";
// import Point from "../../assets/images/Point.svg";

// import "../Navbar/Navbar.css"
// import { Link } from 'react-router-dom';
// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   // '&:hover': {
//   //   backgroundColor: alpha(theme.palette.common.white, 0.25),
//   // },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(0.5em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '40ch',
//     },


//   },
// }));

// export default function PrimarySearchAppBar() {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleMobileMenuClose();
//   };

//   const handleMobileMenuOpen = (event) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   const menuId = 'primary-search-account-menu';
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = 'primary-search-account-menu-mobile';
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem>
//         <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//           <Badge badgeContent={4} color="error">
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem>
//       <MenuItem>
//         <IconButton
//           size="large"
//           aria-label="show 17 new notifications"
//           color="inherit"
//         >
//           <Badge badgeContent={17} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem>
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           size="large"
//           aria-label="account of current user"
//           aria-controls="primary-search-account-menu"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   );

//   return (
//     <>
//       <AppBar position="sticky" sx={{ backgroundColor: "white  !important", color: "black" }} elevation={1}>
//           <Container maxWidth="xl" >
//           <Toolbar className='tool' sx={{ justifyContent: "space-between" ,  width: "100%", bgcolor: "white"}}>

//              {/* Left: Logo + Name */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Box
//                 component="img"
//                 src={logo}
//                 alt="logo"
//                 sx={{
//                   width: 32,
//                   height: 32,
//                 }}
//               />
//               <Typography variant="h6" sx={{ fontWeight: "bold",color:"#74767a" }}>
//                 UniSwap
//               </Typography>

//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <Button component={Link} to="/feed" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>Feed</Button>
//               <Button component={Link} to="" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>Browse</Button>
//               <Button component={Link} to="" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>Projects</Button>
//             </Box>

//             <Search sx={{ bgcolor: "#F8FAFC" }}>
//               <SearchIconWrapper>
//                 <SearchIcon />
//               </SearchIconWrapper>
//               <StyledInputBase
//                 placeholder="Search services,users,posts.."
//                 inputProps={{ 'aria-label': 'search' }}
//               />
//             </Search>

//             <div className='lastSide'>
//               <Box sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 3,
//                 mr: 2,
//                 bgcolor: "#eafaf2",
//                 borderRadius: 5,
//                 p: 1
//               }}>
//                 {/* صورة */}
//                 <Box
//                   component="img"
//                   src={Point} // مسار الصورة
//                   alt="points"
//                   sx={{ width: 30, height: 30 }}
//                 />

//                 {/* الزر */}
//                 <Typography  component="span"  sx={{ fontWeight: "bold", color: "#28a745" }}>
//                   750 <Typography component="span" sx={{ fontWeight: "normal" }}>pts</Typography>
//                 </Typography>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//                 <IconButton size="large" aria-label="show 4 new mails" color="inherit">
//                   <Badge badgeContent={4} color="error">
//                     <MailIcon />
//                   </Badge>
//                 </IconButton>
//                 <IconButton
//                   size="large"
//                   aria-label="show 5 new notifications"
//                   color="inherit"
//                 >
//                   <Badge badgeContent={5} color="error">
//                     <NotificationsIcon />
//                   </Badge>
//                 </IconButton>
//                 <IconButton
//                   size="large"
//                   edge="end"
//                   aria-label="account of current user"
//                   aria-controls={menuId}
//                   aria-haspopup="true"
//                   onClick={handleProfileMenuOpen}
//                   color="inherit"
//                 >
//                   <AccountCircle />
//                 </IconButton>
//               </Box>
//               <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//                 <IconButton
//                   size="large"
//                   aria-label="show more"
//                   aria-controls={mobileMenuId}
//                   aria-haspopup="true"
//                   onClick={handleMobileMenuOpen}
//                   color="inherit"
//                 >
//                   <MoreIcon />
//                 </IconButton>
//               </Box>
//             </div>
//           </Toolbar>
//       </Container>
//       </AppBar>
//       {renderMobileMenu}
//       {renderMenu}
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
  MenuItem,
  Menu,
  IconButton,
  Typography,
  InputBase,
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

import logo from "../../assets/images/logo.png";
import Point from "../../assets/images/Point.svg";
import "../Navbar/Navbar.css";
import { Link } from "react-router-dom";

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  const menuId = "primary-search-account-menu";
  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  // Mobile dropdown menu (<800px)
  const mobileMenuId = "primary-mobile-menu";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* Links */}
      <MenuItem component={Link} to="/feed">Feed</MenuItem>
      <MenuItem component={Link} to="">Browse</MenuItem>
      <MenuItem component={Link} to="">Projects</MenuItem>

      {/* Search - يظهر فقط أقل من 800px */}
      <MenuItem
        disableRipple
        // sx={{ display: { xs: "flex", "@media(min-width:800px)": "none" } }}
        sx={{
  display: { 
    xs: "flex",   // من 0px لحد sm → flex
    md: "none"    // من 900px وطالع → none (md = 900px حسب theme default)
  }
}}

      >
        <Search sx={{ bgcolor: "#F8FAFC", width: "100%" }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search services, users, posts.."
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </MenuItem>

      {/* Points */}
      <MenuItem disableRipple>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#eafaf2",
            borderRadius: 5,
            p: 1,
            width: "100%",
          }}
        >
          <Box component="img" src={Point} alt="points" sx={{ width: 30, height: 30 }} />
          <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745" }}>
            750 <Typography component="span" sx={{ fontWeight: "normal" }}>pts</Typography>
          </Typography>
        </Box>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "white !important", color: "black" }}
        elevation={1}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", width: "100%", bgcolor: "white" }}>
            {/* Left: Logo + Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box component="img" src={logo} alt="logo" sx={{ width: 32, height: 32 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#74767a",
                  display: { xs: "none" },
                  "@media(min-width:640px)": { display: "block" },
                }}
              >
                UniSwap
              </Typography>
            </Box>

            {/* Desktop Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <Button component={Link} to="/feed" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>
                Feed
              </Button>
              <Button component={Link} to="" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>
                Browse
              </Button>
              <Button component={Link} to="" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>
                Projects
              </Button>
            </Box>

            {/* Search on AppBar ≥800px */}
            {/* <Box
              sx={{
                display: { xs: "none" },
                "@media(min-width:800px)": { display: "flex" },
                ml: 2,
              }}
            > */}
            <Box
  sx={{
    display: { 
      xs: "none",   // من 0px لحد sm → none
      md: "flex"    // من 900px وطالع → flex
    },
    ml: 2,
  }}
>

              <Search sx={{ bgcolor: "#F8FAFC" }}>
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
              {/* Points (Desktop) */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#eafaf2",
                  borderRadius: 5,
                  p: 1,
                  mr:2
                }}
              >
                <Box component="img" src={Point} alt="points" sx={{ width: 30, height: 30 }} />
                <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745" }}>
                  750{" "}
                  <Typography component="span" sx={{ fontWeight: "normal" }}>pts</Typography>
                </Typography>
              </Box>

              {/* Icons */}
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error"><MailIcon /></Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 5 new notifications" color="inherit">
                <Badge badgeContent={5} color="error"><NotificationsIcon /></Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              {/* Mobile Menu Button */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {renderMobileMenu}
      {renderProfileMenu}
    </>
  );
}


