import React, { useState } from "react";
import "../Login/Login.css";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Tabs,
  Tab,
  Container,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Email, Lock, CheckCircle, Person, Business,School,ElectricBoltSharp  } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomButton from "../../../components/CustomButton/CustomButton";

export default function Register() {
  const [showPassword, setshowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // التاب الحالي حسب الرابط
  const currentTab = location.pathname === "/login" ? 0 : 1;

  const { register: formRegister, handleSubmit } = useForm();

  const registerHandle = (data) => {
    console.log(data);
  };

  return (
    <>
       {/* Navbar */}
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
          <Button startIcon={<KeyboardBackspaceIcon />} color="inherit" sx={{ textTransform: "none",color: "#74767a"  }}>
            Back
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", ml: 2 }}>
            <img src="src/assets/images/logo.png" alt="UniSwap logo" className="logo" />
            <Typography component={"span"} sx={{ fontWeight: "600", color: "#74767a", fontSize: "14px" }}>
              UniSwap
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Content */}
      <Container maxWidth="lg" className="container" >
        <Box
          sx={{
            display: "flex",
  flexDirection: {
      xs: "column", // في الموبايل (xs - sm)
      md: "row",    // من md وفوق (ديسكتوب)
    },     
  alignItems: {
        xs: "center", // بالموبايل بالنص
        md: "flex-start", // بالديسكتوب عادي
      },
                  justifyContent: "space-between",
            mt: "120px",
   gap: {
       xs: 4, // gap صغير بالموبايل
      md: 0.5  // gap أكبر بالديسكتوب
    },
                flexWrap:"wrap"
          }}
        >
          {/* LEFT SECTION */}
          <Box sx={{ flex: 1, maxWidth: "600px" }}>
            <Typography component={"h2"} sx={{ fontSize: "36px", fontWeight: "700", lineHeight: "44px", color: "#0f172a" }}>
              Join the Future of <br />
              <Typography
                component={"span"}
                sx={{
                  background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "700",
                  fontSize: "36px",
                }}
              >
                Student Collaboration
              </Typography>
            </Typography>

            <Typography sx={{ mt: 2, fontSize: "18px", color: "#475569", lineHeight: "28px" }}>
              Connect with fellow students, exchange skills, and build lasting academic relationships in a safe, university-verified environment.
            </Typography>

            {/* Features list */}
            <Box sx={{ mt: 3 }}>
              {[
                "Connect with students across universities",
                "Exchange skills using our points system",
                "Build your academic portfolio",
                "Access to exclusive study groups",
                "Real-time collaboration tools",
              ].map((text, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <CheckCircle sx={{ color: "#22c55e", mr: 1 }} />
                  <Typography sx={{ color: "#0f172a" }}>{text}</Typography>
                </Box>
              ))}
            </Box>
              {/* University Verified card */}
            <Box sx={{ mt: 4, p: 2.5, borderRadius: 3, bgcolor: "#aae2f12a", display: "flex", alignItems: "flex-start", gap: 2, boxShadow: "inset 0 0 4px #e2e8f0", maxWidth: "500px" }}>
                <Box>
                        <Typography sx={{ fontWeight: "600", color: "#0f172a" }}>University Verified</Typography>
                        <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                         Join 5,000+ students from 25+ universities already using UniSwap to enhance their academic journey.
                        </Typography>
                        </Box>
                        </Box>
          </Box>

          {/* RIGHT SECTION (Form) */}
          <Box sx={{width: 400 ,  p: 4, borderRadius: 4, boxShadow: 3, bgcolor: "white"}}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography sx={{ fontSize: "20px", fontWeight: "600", color: "#0f172a" }}>
                Welcome to UniSwap
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                Your academic collaboration starts here
              </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => {
                if (newValue === 0) navigate("/login");
                if (newValue === 1) navigate("/register");
              }}
              centered
                textColor="inherit"
              sx={{
                bgcolor: "#F1F5F9",
                borderRadius: "50px",
                minHeight: "40px",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#0F172A",
                  borderRadius: "50px",
                  minHeight: "40px",
                  minWidth: "120px",
                  margin: "4px",
                },
                "& .Mui-selected": {
                  background: "#FFFFFF",
                  color: "#0F172A",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {/* Form */}
            <Box component={"form"} sx={{ padding: "35px 0 0 0"}} onSubmit={handleSubmit(registerHandle)}>
              <TextField
                {...formRegister("fullName")}
                fullWidth
                margin="normal"
                label="Full Name"
                placeholder="john Doe"
                variant="outlined"
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
              />

              <TextField
                {...formRegister("Email")}
                fullWidth
                margin="normal"
                label="Email"
                placeholder="john.doe@gmail.edu"
                variant="outlined"
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
              />

              <TextField
                {...formRegister("UniversityName")}
                fullWidth
                margin="normal"
                label="University"
                placeholder="University Name"
                variant="outlined"
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><Business /></InputAdornment> }}
              />

              <TextField
                {...formRegister("Password")}
                fullWidth
                margin="normal"
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
              />

              <TextField
                {...formRegister("ConfirmPass")}
                fullWidth
                margin="normal"
                label="Confirm Password"
                placeholder="Confirm your password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
              />

              <Box sx={{ bgcolor: "#F8FAFC", p: "3px 5px", mt: "15px", borderRadius: "10px" }}>
                <Typography component={"p"} sx={{ fontFamily: "Outfit", fontSize: "11px" }}>
                  By signing up, you agree to our Terms of Service and Privacy Policy.<br />
                  Your university email will be verified before account activation.
                </Typography>
              </Box>

           <CustomButton
  type="submit"
  fullWidth
  sx={{
    mt: 2,
    py: 1.5,
    fontSize: 16,
    borderRadius: 3,
    opacity: 0.5,
  }}
>
  {currentTab === 0 ? "Sign In" : "Create Account"}
</CustomButton>
             <Typography sx={{ mt: 2, textAlign: "center", fontSize: "12px", color: "#475569" }}>
                 <Lock sx={{ fontSize: 14,color: "#f0c724bf", verticalAlign: "middle", mr: 0.5 }} /> Secure ·
                 <School sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5, ml: 0.5 }} /> University Verified ·
                 <ElectricBoltSharp sx={{ fontSize: 14,color: "#f0c724bf",verticalAlign: "middle", mr: 0.5, ml: 0.5 }} /> Free Forever
             </Typography>

            </Box>
          </Box>
        </Box>
      </Container>

      </>
  );
}