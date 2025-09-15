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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
            sx={{ justifyContent: "space-between", width: "100%", bgcolor: "white" }}
          >
            {/* Logo + Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={logo}
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
                  component={Link}
                  to="/feed"
                  color="inherit"
                  sx={{ textTransform: "none", fontSize: "18px" }}
                >
                  Feed
                </Button>
                <Button
                  component={Link}
                  to="/browse"
                  color="inherit"
                  sx={{ textTransform: "none", fontSize: "18px" }}
                >
                  Browse
                </Button>
                <Button
                  component={Link}
                  to="/project"
                  color="inherit"
                  sx={{ textTransform: "none", fontSize: "18px" }}
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
                  maxWidth: windowWidth >= 1029 ? 300 : 400, // ✅ يصغر عند الشاشات الكبيرة
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
                    bgcolor: "#eafaf2",
                    borderRadius: 5,
                    p: 1,
                    mr: 2,
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
                    750{" "}
                    <Typography component="span" sx={{ fontWeight: "normal" }}>
                      pts
                    </Typography>
                  </Typography>
                </Box>
              )}

              {/* Icons */}
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" aria-label="show 5 new notifications" color="inherit">
                <Badge badgeContent={5} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

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
          sx={{ width: "100%", bgcolor: "white", borderBottom: 1, borderColor: "divider" }}
        >
          <Container maxWidth="xl" sx={{ py: 1 }}>
            <Button component={Link} to="/feed" fullWidth sx={{ justifyContent: "center" }}>
              Feed
            </Button>
            <Button component={Link} to="/browse" fullWidth sx={{ justifyContent: "center" }}>
              Browse
            </Button>
            <Button component={Link} to="/project" fullWidth sx={{ justifyContent: "center" }}>
              Projects
            </Button>

            {/* Search (<768px) */}
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

            {/* Points */}
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
                <Typography component="span" sx={{ fontWeight: "bold", color: "#28a745" }}>
                  750{" "}
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