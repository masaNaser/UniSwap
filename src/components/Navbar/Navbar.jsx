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
    <MenuItem component={Link} to="/feed" sx={{ justifyContent: "center" }}>Feed</MenuItem>
    <MenuItem component={Link} to="/browse" sx={{ justifyContent: "center" }}>Browse</MenuItem>
    <MenuItem component={Link} to="" sx={{ justifyContent: "center" }}>Projects</MenuItem>

    {/* Search */}
    <MenuItem disableRipple sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
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
    <MenuItem disableRipple sx={{ width: "100%", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // <-- مهم للتمركز
          gap: 1,
          bgcolor: "#eafaf2",
          borderRadius: 5,
          p: 1,
          width: "80%", // تحكم بعرض الصندوق
        }}
      >
        <Box component="img" src={Point} alt="points" sx={{ width: 30, height: 30 }} />
        <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745", textAlign: "center" }}>
          750 <Typography component="span" sx={{ fontWeight: "normal" }}>pts</Typography>
        </Typography>
      </Box>
    </MenuItem>
  </Menu>
);


  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "white !important", color: "black" }} elevation={1}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", width: "100%", bgcolor: "white" }}>
            {/* Logo + Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box component="img" src={logo} alt="logo" sx={{ width: 32, height: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#74767a", display: { xs: "none", sm: "block" } }}>
                UniSwap
              </Typography>
            </Box>

            {/* Desktop Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              <Button component={Link} to="/feed" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>Feed</Button>
              <Button component={Link} to="/browse" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>Browse</Button>
              <Button component={Link} to="" color="inherit" sx={{ textTransform: "none", fontSize: "18px" }}>Projects</Button>
            </Box>

            {/* Desktop Search */}
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
              <Search sx={{ bgcolor: "#F8FAFC" }}>
                <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
                <StyledInputBase placeholder="Search services, users, posts.." inputProps={{ "aria-label": "search" }} />
              </Search>
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Points */}
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1, bgcolor: "#eafaf2", borderRadius: 5, p: 1, mr: 2 }}>
                <Box component="img" src={Point} alt="points" sx={{ width: 30, height: 30 }} />
                <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745" }}>
                  750 <Typography component="span" sx={{ fontWeight: "normal" }}>pts</Typography>
                </Typography>
              </Box>

              {/* Icons */}
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error"><MailIcon /></Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 5 new notifications" color="inherit">
                <Badge badgeContent={5} color="error"><NotificationsIcon /></Badge>
              </IconButton>

              {/* Desktop Profile */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ display: { xs: "none", md: "flex" } }}
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
