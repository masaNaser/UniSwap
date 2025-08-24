// import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, Badge, Avatar, IconButton } from "@mui/material";
// import { Search, Notifications, Chat } from "@mui/icons-material";

// export default function Navbar() {
//   return (
//     <>
//  <nav>
//     <AppBar position="static" color="white" elevation={1}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
//         {/* Left: Logo + Name */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <img src="src/assets/images/logo.png" alt="logo" style={{ width: 32, height: 32 }} />
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             UniSwap
//           </Typography>
//         </Box>

//         {/* Middle: Links + Search */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
//           <Button color="inherit">Feed</Button>
//           <Button color="inherit">Browse</Button>
//           <Button color="inherit">Projects</Button>

//           <TextField
//             placeholder="Search services, users, posts..."
//             size="small"
//             sx={{ width: 300 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Box>

//         {/* Right: Points + Notifications + Messages + Avatar */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Button variant="contained" sx={{ borderRadius: 5, bgcolor: "#eafaf2", color: "#28a745" }}>
//             750 pts
//           </Button>

//           <IconButton>
//             <Badge badgeContent={3} color="error">
//               <Notifications />
//             </Badge>
//           </IconButton>

//           <IconButton>
//             <Badge badgeContent={2} color="success">
//               <Chat />
//             </Badge>
//           </IconButton>

//           <Avatar alt="Profile" src="/user.jpg" />
//         </Box>
//       </Toolbar>
//     </AppBar>
//     </nav>
//     </>
//   );
// }













import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {AppBar,
  Button,
  Box,
  Toolbar,
  Badge,
  MenuItem,
  Menu,
  IconButton,
  Typography,
  InputBase,
} 
from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import "../Navbar/Navbar.css"
import { Link } from 'react-router-dom';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  // '&:hover': {
  //   backgroundColor: alpha(theme.palette.common.white, 0.25),
  // },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(0.5em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
    
    
  },
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

   const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

   const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
    <div className="container">
      <div className="navbar">
         <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="white" elevation={0}>
        <Toolbar sx={{  justifyContent: "space-between"}}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography> */}
              {/* Left: Logo + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src="src/assets/images/logo.png" alt="logo" style={{ width: 32, height: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            UniSwap
          </Typography>

        </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Button component={Link} to="" color="inherit"   sx={{ textTransform: "none", fontSize:"18px" }}>Feed</Button>
                <Button component={Link} to="" color="inherit"   sx={{ textTransform: "none", fontSize:"18px"  }}>Browse</Button>
                <Button component={Link} to="" color="inherit"   sx={{ textTransform: "none", fontSize:"18px"  }}>Projects</Button>
           </Box>

          <Search  sx={{bgcolor:"#F8FAFC"}}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search services,users,posts.."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <div className='lastSide'>
           <Box sx={{ 
  display: "flex",
   alignItems: "center", 
   gap: 3,
   mr:2,
   bgcolor: "#eafaf2",
   borderRadius: 5,
   p:1
 }}>
  {/* صورة */}
  <Box
    component="img"
    src="src\assets\images\Point.svg" // مسار الصورة
    alt="points"
    sx={{ width: 30, height: 30 }}
  />

  {/* الزر */}
  <Typography sx={{ fontWeight: "bold", color: "#28a745" }}>
    750 <Typography component="span" sx={{ fontWeight: "normal" }}>pts</Typography>
  </Typography>
              </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 5 new notifications"
              color="inherit"
            >
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
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
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
         </Box>
      </div>
    </div>
    </>
  );
}
