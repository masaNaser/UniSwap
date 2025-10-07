import React, { useState } from "react";
import "../Login/Login.css";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Typography,
  Container,
  Tabs,
  Tab,
  Autocomplete,
  Chip,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  School,
  ElectricBoltSharp,
  CalendarMonth,
  CheckCircle,
} from "@mui/icons-material";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomButton from "../../../shared/CustomButton/CustomButton";
import { register as registerApi } from "../../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearProgress } from "@mui/material"; // ضيفيها فوق مع باقي الـ imports
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
export default function Register() {
  const validationSchema = yup.object({
    userName: yup
      .string()
      .required("User Name is required")
      .min(5, "User Name must be at least 5 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    setPasswordStrength(score);
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return { text: "", color: "inherit" };
      case 1:
        return { text: "very week", color: "red" };
      case 2:
        return { text: "week", color: "orange" };
      case 3:
      case 4:
        return { text: "strong", color: "green" };
      default:
        return { text: "", color: "inherit" };
    }
  };
  const [showPassword, setshowPassword] = useState(false);
  const [skills, setSkills] = useState([]); // skills as array
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname === "/login" ? 0 : 1;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    //هاي الخطوة عشان نحكي للمكتبة الرياكت هوك فورم انه ما تعمل الفالديشن منها وانما الفالديشن اللي حطيناه باستخدام ال yup
    resolver: yupResolver(validationSchema),
  });

  const registerHandle = async (data) => {
    const finalData = {
      userName: data.userName.replace(/\s/g, ""), // إزالة الفراغات
      email: data.email.trim(),
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
      skills: skills.length ? skills : [], // تأكد array
      universityMajor: data.universityMajor.trim(),
      academicYear: data.academicYear.trim(),
    };


    console.log(finalData);

    try {
      setLoading(true);
      const response = await registerApi(finalData);
      console.log(response);
      if (response.status == 200) {
        Swal.fire({
          title:
            "Registration successful! Please check your email to verify your account.",
          icon: "success",
          draggable: true,
          timer: 2000,
        });
        navigate("/login");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred";
      Swal.fire({
        icon: "error",
        title: "Register failed",
        text: msg,
        timer: 2000,
      });
      console.error("Registration error:", error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
          <Button
            startIcon={<KeyboardBackspaceIcon />}
            color="inherit"
            sx={{ textTransform: "none", color: "#74767a" }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: "6px", ml: 2 }}
          >
            <img
              src="src/assets/images/logo.png"
              alt="UniSwap logo"
              className="logo"
            />
            <Typography
              component={"span"}
              sx={{ fontWeight: "600", color: "#74767a", fontSize: "14px" }}
            >
              UniSwap
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Content */}
      <Container maxWidth="lg" className="container">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "space-between",
            mt: "70px",
            gap: { xs: 4, md: 0.5 },
            flexWrap: "wrap",
            pb: 5,
          }}
        >
          {/* LEFT SECTION */}
          <Box sx={{ flex: 1, maxWidth: "600px" }}>
            <Typography
              component={"h2"}
              sx={{
                fontSize: "36px",
                fontWeight: "700",
                lineHeight: "44px",
                color: "#0f172a",
              }}
            >
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

            <Typography
              sx={{
                mt: 2,
                fontSize: "18px",
                color: "#475569",
                lineHeight: "28px",
              }}
            >
              Connect with fellow students, exchange skills, and build lasting
              academic relationships in a safe, university-verified environment.
            </Typography>

            {/* Features */}
            <Box sx={{ mt: 3 }}>
              {[
                "Connect with students across universities",
                "Exchange skills using our points system",
                "Build your academic portfolio",
                "Access to exclusive study groups",
                "Real-time collaboration tools",
              ].map((text, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                >
                  <CheckCircle sx={{ color: "#22c55e", mr: 1 }} />
                  <Typography sx={{ color: "#0f172a" }}>{text}</Typography>
                </Box>
              ))}
            </Box>

            {/* University Verified card */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#aae2f12a",
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                boxShadow: "inset 0 0 4px #e2e8f0",
                maxWidth: "500px",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: "600", color: "#0f172a" }}>
                  University Verified
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                  Join 5,000+ students from 25+ universities already using
                  UniSwap to enhance their academic journey.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT SECTION (Form) */}
          <Box
            sx={{
              width: 400,
              p: 4,
              borderRadius: 4,
              boxShadow: 3,
              bgcolor: "white",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "600", color: "#0f172a" }}
              >
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
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {/* Form */}
            <Box
              component={"form"}
              sx={{ padding: "35px 0 0 0" }}
              onSubmit={handleSubmit(registerHandle)}
            >
              <TextField
                {...register("userName")}
                fullWidth
                margin="normal"
                label="User Name"
                placeholder="john doe"
                variant="outlined"
                error={errors.userName}
                helperText={errors.userName?.message}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register("email")}
                fullWidth
                margin="normal"
                label="Email"
                placeholder="john.doe@gmail.com"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register("password")}
                fullWidth
                margin="normal"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                variant="outlined"
                required
                error={errors.password}
                helperText={errors.password?.message}
                onChange={(e) => {
                  // خلي الريأكت هوك فورم يقرأ القيمة
                  register("password").onChange(e);
                  checkStrength(e.target.value); // حساب قوة الباسورد
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />

              {passwordStrength > 0 && (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 4) * 100}
                    sx={{ height: 8, borderRadius: 5, mt: 1 }}
                    color={
                      passwordStrength < 2
                        ? "error"
                        : passwordStrength === 2
                          ? "warning"
                          : "success"
                    }
                  />
                  <Typography sx={{ mt: 1, color: getStrengthLabel().color }}>
                    {getStrengthLabel().text}
                  </Typography>
                </>
              )}

              <TextField
                {...register("confirmPassword")}
                fullWidth
                margin="normal"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                variant="outlined"
                required
                error={errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Skills Input with Chips */}
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={skills}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(event, newValue) => {
                  setSkills(newValue);
                  setValue("skills", newValue);
                  setInputValue(""); // نمسح النص بعد إدخال skill
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        variant="outlined"
                        label={option}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    // 👇 هون الشرط: يظهر placeholder فقط إذا skills فاضي
                    placeholder={
                      skills.length === 0 ? "Type a skill and press Enter" : ""
                    }
                    margin="normal"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <ElectricBoltSharp />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                {...register("universityMajor")}
                fullWidth
                margin="normal"
                label="University Major"
                placeholder="cse"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <School />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register("academicYear")}
                fullWidth
                margin="normal"
                label="Academic Year"
                placeholder="5th year"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth />
                    </InputAdornment>
                  ),
                }}
              />

              <CustomButton type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
                Create Account
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
