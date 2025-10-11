import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ServiceCard from "../../components/Cards/ServiceCard";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { ElectricBoltSharp } from "@mui/icons-material";
import heroImg from "../../assets/images/hero-bg.png";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const FeatureCard = [
    {
      title: "Student Community",
      description: <>Connect with fellow students and build <br /> meaningful academic relationships</>,
      icon: <PeopleOutlinedIcon sx={{ bgcolor: "#00C8FF1A", borderRadius: "16px", width: 48, height: 48, p: 1 }} />,
    },
    {
      title: "Skill Exchange",
      description: <>Trade your expertise for others' help using our <br /> innovative points system</>,
      icon: <ElectricBoltSharp sx={{ bgcolor: "#00C8FF1A", borderRadius: "16px", width: 48, height: 48, p: 1 }} />,
    },
    {
      title: "Academic Support",
      description: <>Get help with assignments, projects, and exam <br /> preparation from peers</>,
      icon: <ImportContactsTwoToneIcon sx={{ bgcolor: "#00C8FF1A", borderRadius: "16px", width: 48, height: 48, p: 1 }} />,
    },
    {
      title: "Real-time Chat",
      description: <>Instant messaging and collaboration tools to <br /> stay connected</>,
      icon: <ChatBubbleOutlineOutlinedIcon sx={{ bgcolor: "#00C8FF1A", borderRadius: "16px", width: 48, height: 48, p: 1 }} />,
    },
    {
      title: "Portfolio Building",
      description: <>Showcase your skills and build a strong <br /> academic portfolio</>,
      icon: <WorkspacePremiumOutlinedIcon sx={{ bgcolor: "#00C8FF1A", borderRadius: "16px", width: 48, height: 48, p: 1 }} />,
    },
    {
      title: "Safe & Secure",
      description: <>University-verified platform ensuring a trusted <br /> learning environment</>,
      icon: <ShieldOutlinedIcon sx={{ bgcolor: "#00C8FF1A", borderRadius: "16px", width: 48, height: 48, p: 1 }} />,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          height: "70px", // 👈 ثبات الارتفاع
          px: { xs: 3, md: 8 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Logo + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="src/assets/images/logo.png"
            alt="UniSwap logo"
            style={{ height: "34px", width: "34px", objectFit: "contain" }}
          />
          <Typography sx={{ fontWeight: 600, fontSize: { xs: 16, sm: 18 }, color: "#74767a" }}>
            UniSwap
          </Typography>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined" // 👈 صار بإطار زي Sign Up
            sx={{
              borderColor: "#004aad",
              color: "#004aad",
              fontWeight: 600,
              borderRadius: "25px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: { xs: 14, sm: 15 },
              "&:hover": {
                backgroundColor: "rgba(0,74,173,0.08)",
                borderColor: "#004aad",
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
              borderColor: "#004aad",
              color: "#004aad",
              fontWeight: 600,
              borderRadius: "25px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: { xs: 14, sm: 15 },
              "&:hover": {
                backgroundColor: "rgba(0,74,173,0.1)",
                borderColor: "#004aad",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
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
            background: "linear-gradient(to right, rgba(0,75,173,0.84) 35%, rgba(0,75,173,0.38) 100%)",
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
              <span style={{ color: "#00C8FF" }}>Build Future</span>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                px: { xs: 1, sm: 0 },
              }}
            >
              Join thousands of students transforming their university experience through skill sharing, collaboration, and peer support.
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
              Get Started Free
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
              color: "#004aad",
            }}
          >
            Everything you need to succeed
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#74767a", mb: 4 }}>
            From skill sharing to project collaboration, UniSwap provides all the tools you need for <br /> academic excellence.
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
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="src/assets/images/logo.png"
                alt="UniSwap logo"
                style={{ height: "36px", width: "36px" }}
              />
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: "#fff" }}>
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
    </>
  );
}
