import React, { useState } from "react";
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
  IconButton,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  School,
  ElectricBoltSharp,
  CalendarMonth,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Logo from "../../../assets/images/logo.png";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { register as registerApi } from "../../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearProgress } from "@mui/material";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
export default function Register() {
  // const validationSchema = yup.object({
  //   userName: yup
  //     .string()
  //     .required("User Name is required")
  //     .min(5, "User Name must be at least 5 characters"),
  //   email: yup
  //     .string()
  //     .required("Email is required")
  //     .email("Invalid email address"),
  //   password: yup
  //     .string()
  //     .required("Password is required")
  //     .min(8, "Password must be at least 8 characters")
  //     .matches(
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  //     ),
  //   confirmPassword: yup
  //     .string()
  //     .required("Please confirm your password")
  //     .oneOf([yup.ref("password")], "Passwords must match"),
  // });
  const theme = useTheme();
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
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one digit")
      .matches(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checkStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++; // طول ≥ 8
    if (/[A-Z]/.test(value)) score++; // حرف كبير
    if (/[a-z]/.test(value)) score++; // حرف صغير
    if (/[0-9]/.test(value)) score++; // رقم
    if (/[^A-Za-z0-9]/.test(value)) score++; // حرف خاص
    setPasswordStrength(score);
  };
  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return { text: "", color: "inherit" };
      case 1:
        return { text: "very weak", color: "red" };
      case 2:
        return { text: "weak", color: "orange" };
      case 3:
        return { text: "medium", color: "yellow" };
      case 4:
        return { text: "strong", color: "green" };
      case 5:
        return { text: "very strong", color: "darkgreen" };
      default:
        return { text: "", color: "inherit" };
    }
  };
  const [skills, setSkills] = useState([]); // skills as array
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
      userName: data.userName.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
      skills: skills,
      universityMajor: data.universityMajor.toUpperCase(),
      academicYear: data.academicYear.trim(),
    };

    console.log("Final Data Sent:", JSON.stringify(finalData));

    try {
      setLoading(true);
      const response = await registerApi(finalData);
      console.log(response);
      if (response.status === 200) {
        Swal.fire({
          title:
            "Registration successful! Please check your email to verify your account.",
          icon: "success",
          draggable: true,
          timer: 1500,
        });
        navigate("/login");
      }
    } catch (error) {
      console.log("Full Error Response:", error.response);
      const msg = error.response?.data.detail || "An error occurred";
      Swal.fire({
        icon: "error",
        title: "Register failed",
        text: msg,
        // timer: 1500,
      });
      console.error("Registration error:", error);
    } finally {
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
              src={Logo}
              alt="UniSwap logo"
              style={{ height: "36px", width: "36px" }}
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
            mt: { xs: 4, md: "70px" },
            gap: { xs: 4, md: 8 },
            flexWrap: "wrap",
            pb: 5,
            px: { xs: 2, md: 0 },
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
                // color: "#0f172a",
                color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
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
                  <Typography
                    sx={{
                      color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
                    }}
                  >
                    {text}
                  </Typography>
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
                <Typography
                  sx={{
                    fontWeight: "600",
                    color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
                  }}
                >
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
              width: { xs: "100%", sm: "400px" },
              maxWidth: "400px",
              p: 4,
              borderRadius: 4,
              boxShadow: 3,
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#FFFFFF",
              mx: { xs: "auto", md: 0 },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: theme.palette.mode === "dark" ? "#fff" : "#0f172a",
                }}
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
                // bgcolor: "#F1F5F9",
                bgcolor:theme.palette.mode === "dark" ? "#565555ff" : "#F1F5F9",
                borderRadius: "50px",
                minHeight: "40px",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#0F172A",
                  borderRadius: "50px",
                  minHeight: "40px",
                  minWidth: { xs: "100px", sm: "120px" }, // ✅ غيّرت هون
                  fontSize: { xs: "13px", sm: "14px" }, // ✅ وزدت هاي
                  margin: "4px",
                  padding: { xs: "6px 12px", sm: "6px 16px" }, // ✅ وهاي
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
                placeholder="JohnDoe"
                variant="outlined"
                error={errors.userName}
                helperText={errors.userName?.message}
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
                placeholder="johndoe@gmail.com"
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
                  register("password").onChange(e);
                  checkStrength(e.target.value);
                }}
                sx={{
                  // تخفية أيقونة الـ browser
                  "& input::-ms-reveal, & input::-ms-clear": {
                    display: "none",
                  },
                  "& input::-webkit-credentials-auto-fill-button": {
                    display: "none",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#fff"
                                  : "inherit",
                            }}
                          />
                        ) : (
                          <Visibility
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#fff"
                                  : "inherit",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {passwordStrength > 0 && (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 5) * 100} // نسبة من 0 إلى 100%
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mt: 1,
                      bgcolor: "#e0e0e0", // خلفية رمادية خفيفة
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getStrengthLabel().color, // اللون حسب القوة
                      },
                    }}
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                variant="outlined"
                required
                error={errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{
                  // تخفية أيقونة الـ browser
                  "& input::-ms-reveal, & input::-ms-clear": {
                    display: "none",
                  },
                  "& input::-webkit-credentials-auto-fill-button": {
                    display: "none",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#fff"
                                  : "inherit",
                            }}
                          />
                        ) : (
                          <Visibility
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#fff"
                                  : "inherit",
                            }}
                          />
                        )}
                      </IconButton>
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
                placeholder="Computer Systems Engineering"
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
                placeholder="5"
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

              <CustomButton
                type="submit"
                fullWidth
                loading={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: 16,
                }}
              >
                Create Account
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
