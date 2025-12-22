import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ServiceCard from "../../components/Cards/ServiceCard";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { ElectricBoltSharp } from "@mui/icons-material";
import Logo from "/logo.png";
import heroImg from "../../assets/images/hero-bg.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { isAdmin, getToken } from "../../utils/authHelpers";

export default function LandingPage() {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const FeatureCard = [
    {
      title: "Student Community",
      description:
        "Connect with fellow students and build meaningful academic relationships",
      icon: (
        <PeopleOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            borderRadius: "16px",
            width: 48,
            height: 48,
            p: 1,
          }}
        />
      ),
    },
    {
      title: "Skill Exchange",
      description:
        "Trade your expertise for others' help using our innovative points system",
      icon: (
        <ElectricBoltSharp
          sx={{
            bgcolor: "#00C8FF1A",
            borderRadius: "16px",
            width: 48,
            height: 48,
            p: 1,
          }}
        />
      ),
    },
    {
      title: "Academic Support",
      description:
        "Get help with assignments, projects, and exam preparation from peers",
      icon: (
        <ImportContactsTwoToneIcon
          sx={{
            bgcolor: "#00C8FF1A",
            borderRadius: "16px",
            width: 48,
            height: 48,
            p: 1,
          }}
        />
      ),
    },
    {
      title: "Real-time Chat",
      description:
        "Instant messaging and collaboration tools to stay connected",
      icon: (
        <ChatBubbleOutlineOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            borderRadius: "16px",
            width: 48,
            height: 48,
            p: 1,
          }}
        />
      ),
    },
    {
      title: "Portfolio Building",
      description: "Showcase your skills and build a strong academic portfolio",
      icon: (
        <WorkspacePremiumOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            borderRadius: "16px",
            width: 48,
            height: 48,
            p: 1,
          }}
        />
      ),
    },
    {
      title: "Safe & Secure",
      description:
        "University-verified platform ensuring a trusted learning environment",
      icon: (
        <ShieldOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            borderRadius: "16px",
            width: 48,
            height: 48,
            p: 1,
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ overflowX: "hidden", width: "100%" }}>
      {/* Navbar - Fixed */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "70px",
          px: { xs: 3, md: 8 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: scrolled
            ? theme.palette.mode === "dark"
              ? "rgba(45, 45, 45, 0.7)"
              : "rgba(255, 255, 255, 0.85)"
            : theme.palette.mode === "dark"
            ? "rgba(45, 45, 45, 0.4)"
            : "rgba(255, 255, 255, 0.84)",
          backdropFilter: "blur(15px)",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src={Logo}
            alt="UniSwap logo"
            sx={{ width: 56, height: 50 }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { sm: "1rem", md: "1.8rem" },
              color: "#74767a",
            }}
          >
            UniSwap
          </Typography>
        </Box>

        {/* Desktop Buttons - التعديل هنا فقط */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            "@media (max-width:433px)": { display: "none" },
          }}
        >
          {token ? (
            <>
              <Button
                onClick={() => navigate(isAdmin() ? "/admin" : "/app/feed")}
                variant="outlined"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderWidth: "2px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  ":hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#fff" : "#004aad",
                    color: theme.palette.mode === "dark" ? "black" : "#fff",
                  },
                }}
              >
                Feed
              </Button>
              {/* <Button
                component={Link}
                to="/register"
                variant="outlined"
                      sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderWidth: "2px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  ":hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#fff" : "#004aad",
                    color: theme.palette.mode === "dark" ? "black" : "#fff",
                    ":hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#fff" : "#004aad",
                      color: theme.palette.mode === "dark" ? "black" : "#fff",
                    },
                  },
                }}
              >
                Sign Up
              </Button> */}
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderWidth: "2px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  ":hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#fff" : "#004aad",
                    color: theme.palette.mode === "dark" ? "black" : "#fff",
                    ":hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#fff" : "#004aad",
                      color: theme.palette.mode === "dark" ? "black" : "#fff",
                    },
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                      sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderWidth: "2px",
                  fontWeight: 700,
                  borderRadius: "25px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  ":hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#fff" : "#004aad",
                    color: theme.palette.mode === "dark" ? "black" : "#fff",
                    ":hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#fff" : "#004aad",
                      color: theme.palette.mode === "dark" ? "black" : "#fff",
                    },
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <Box
          sx={{
            display: "none",
            "@media (max-width:433px)": { display: "flex" },
          }}
        >
          <IconButton onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon
              sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#004aad" }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Mobile Menu Collapse */}
      <Collapse in={menuOpen}>
        <Box
          sx={{
            position: "fixed",
            top: 70,
            left: 0,
            right: 0,
            zIndex: 999,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "#363636ffF5"
                : "rgba(255,255,255,0.98)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            gap: 2,
            py: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            "@media (min-width:434px)": { display: "none" },
          }}
        >
          {token ? (
            <>
              <Button
                onClick={() => navigate(isAdmin() ? "/admin" : "/app/feed")}
                variant="outlined"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderRadius: "25px",
                  px: 3,
                  textTransform: "none",
                }}
              >
                Feed
              </Button>
              {/* <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderRadius: "25px",
                  px: 3,
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button> */}
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderRadius: "25px",
                  px: 3,
                  textTransform: "none",
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderColor:
                    theme.palette.mode === "dark" ? "#fff" : "#004aad",
                  borderRadius: "25px",
                  px: 3,
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Collapse>

      {/* Content Container - with paddingTop */}
      <Box sx={{ paddingTop: "70px" }}>
        {" "}
        {/* 🔥 هون المهم! */}
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "auto", sm: "90vh", md: "100vh" },
            minHeight: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "white",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,75,173,0.84) 35%, rgba(0,75,173,0.38) 100%)",
              zIndex: 2,
            }}
          />
          <Container
            sx={{
              position: "relative",
              zIndex: 3,
              textAlign: { xs: "center", md: "left" },
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              py: { xs: 8, sm: 10 },
              px: { xs: 3, sm: 6, md: 8 },
            }}
          >
            <Box sx={{ maxWidth: "600px", mx: { xs: "auto", md: 0 } }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "30px", sm: "36px", md: "48px" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Exchange Skills, <br />
                <span style={{ color: "#52a1d9" }}>Build Future</span>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  color: "rgba(255,255,255,0.9)",
                  mb: 4,
                  px: { xs: 1, sm: 0 },
                }}
              >
                Join thousands of students transforming their university
                experience through skill sharing, collaboration, and peer
                support.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                sx={{
                  borderColor: "#fff",
                  color: "#fff",
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: "30px",
                  textTransform: "none",
                  fontSize: { xs: "14px", sm: "16px" },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderColor: "#fff",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </Container>
        </Box>
        {/* Features Section */}
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              component={"h3"}
              sx={{
                fontSize: "28px",
                fontWeight: "700",
                mt: 6,
                mb: 2,
                color: "#52a1d9",
              }}
            >
              Everything you need to succeed
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#74767a", mb: 4 }}>
              From skill sharing to project collaboration, UniSwap provides all
              the tools you need for <br /> academic excellence.
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ mb: "55px" }}>
            {FeatureCard.map((Feature) => (
              <Grid item xs={12} sm={6} md={4} key={Feature.title}>
                <ServiceCard
                  icon={Feature.icon}
                  title={Feature.title}
                  description={Feature.description}
                  verticalHeader
                />
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* Footer */}
        <Box
          sx={{
            background: "rgba(0, 75, 173, 0.84)",
            color: "white",
            py: 3,
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img
                  src={Logo}
                  alt="UniSwap logo"
                  style={{ height: "36px", width: "36px" }}
                />
                <Typography
                  sx={{ fontWeight: 600, fontSize: 18, color: "#fff" }}
                >
                  UniSwap
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: 14, color: "rgba(255, 255, 255, 0.84)" }}
              >
                Empowering students to learn, share, and grow together.
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.84)",
                }}
              >
                © {new Date().getFullYear()} UniSwap. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
