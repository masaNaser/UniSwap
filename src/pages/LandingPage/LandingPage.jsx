import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import CustomButton from "../../shared/CustomButton/CustomButton";
import { Link } from "react-router-dom";
import ServiceCard from "../../components/Cards/ServiceCard";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { Lock, ElectricBoltSharp } from "@mui/icons-material";
export default function LandingPage() {
  const FeatureCard = [
    {
      title: "Student Community",
      description: (
        <>
          Connect with fellow students and build <br />
          meaningful academic relationships
        </>
      ),
      icon: (
        <PeopleOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            verticalAlign: "middle",
            borderRadius: "16px",
            width: "48px",
            height: "48px",
            padding: "9px",
          }}
        />
      ),
    },

    {
      title: "Skill Exchange",
      description: (
        <>
          Trade your expertise for others' help using our <br />
          innovative points system
        </>
      ),
      icon: (
        <ElectricBoltSharp
          sx={{
            bgcolor: "#00C8FF1A",
            verticalAlign: "middle",
            borderRadius: "16px",
            width: "48px",
            height: "48px",
            padding: "9px",
          }}
        />
      ),
    },

    {
      title: "Academic Support",
      description: (
        <>
          Get help with assignments, projects, and exam <br />
          preparation from peers
        </>
      ),
      icon: (
        <ImportContactsTwoToneIcon
          sx={{
            bgcolor: "#00C8FF1A",
            verticalAlign: "middle",
            borderRadius: "16px",
            width: "48px",
            height: "48px",
            padding: "9px",
          }}
        />
      ),
    },

    {
      title: "Real-time Chat",
      description: (
        <>
          Instant messaging and collaboration tools to <br />
          stay connected
        </>
      ),
      icon: (
        <ChatBubbleOutlineOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            verticalAlign: "middle",
            borderRadius: "16px",
            width: "48px",
            height: "48px",
            padding: "9px",
          }}
        />
      ),
    },

    {
      title: "Portfolio Building",
      description: (
        <>
          Showcase your skills and build a strong <br />
          academic portfolio
        </>
      ),
      icon: (
        <WorkspacePremiumOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            verticalAlign: "middle",
            borderRadius: "16px",
            width: "48px",
            height: "48px",
            padding: "9px",
          }}
        />
      ),
    },

    {
      title: "Safe & Secure",
      description: (
        <>
          University-verified platform ensuring a trusted <br />
          learning environment
        </>
      ),
      icon: (
        <ShieldOutlinedIcon
          sx={{
            bgcolor: "#00C8FF1A",
            verticalAlign: "middle",
            borderRadius: "16px",
            width: "48px",
            height: "48px",
            padding: "9px",
          }}
        />
      ),
    },
  ];
  return (
    <Container maxWidth="lg">
      {/* Navbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
          <img
            src="src/assets/images/logo.png"
            alt="UniSwap logo"
            className="logo"
          />
          <Typography
            component="span"
            sx={{ fontWeight: 600, color: "#74767a", fontSize: 18 }}
          >
            UniSwap
          </Typography>
        </Box>

        {/* الزر */}
        <CustomButton
          component={Link}
          to="/register"
          sx={{
            px: { xs: 1, sm: 2 }, // يقل حجم البادينج على الشاشات الصغيرة
            fontSize: { xs: 12, sm: 15 }, // يقل حجم الخط على الشاشات الصغيرة
            minWidth: { xs: 80, sm: 120 }, // الحد الأدنى للعرض
          }}
        >
          Get Started Free
        </CustomButton>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 4,
          gap: 1, // المسافة بين النص والصورة متوسطة
          flexWrap: "wrap", // عشان يكون responsive
        }}
      >
        {/* النص على اليسار */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography
            component={"h2"}
            sx={{
              fontSize: "36px",
              fontWeight: "700",
              lineHeight: "44px",
              color: "#0f172a",
            }}
          >
            Exchange Skills,
            <br />
            <span
              style={{
                background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700",
                fontSize: "36px",
              }}
            >
              Build Future
            </span>
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#74767a",
              mt: 2,
            }}
          >
            Join thousands of students who are transforming their <br />
            university experience through skill sharing, collaboration,
            <br />
            and peer support.
          </Typography>
        </Box>

        {/* الصورة على اليمين */}
        <Box sx={{ flex: 1, minWidth: "300px", textAlign: "right" }}>
          <img
            src="src/assets/images/landing.png"
            alt="landing"
            style={{ maxWidth: "50%", height: "auto", borderRadius: "8px" }}
          />
        </Box>
      </Box>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography
          component={"h3"}
          sx={{ fontSize: "28px", fontWeight: "700", mt: 6, mb: 2 }}
        >
          Everything you need to succeed
        </Typography>
        <Typography sx={{ fontSize: "16px", color: "#74767a", mb: 4 }}>
          From skill sharing to project collaboration, UniSwap provides all the
          tools you need for
          <br />
          academic excellence.
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
  );
}
