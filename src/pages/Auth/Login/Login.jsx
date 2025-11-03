import React, { useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email,
  Lock,
  CheckCircle,
  School,
  ElectricBoltSharp,
} from "@mui/icons-material";
import logo from "../../../assets/images/logo.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login as loginApi } from "../../../services/authService";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const validationSchema = yup.object({
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
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //هاي الخطوة عشان نحكي للمكتبة الرياكت هوك فورم انه ما تعمل الفالديشن منها وانما الفالديشن اللي حطيناه باستخدام ال yup
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // تحديد التاب الحالي
  const currentTab = location.pathname === "/login" ? 0 : 1;

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const loginHandle = async (data) => {
    try {
      setLoading(true);
      const response = await loginApi(data);
      console.log(response);
      if (response.status == 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("refreshTokenExpiration", response.data.refreshTokenExpiration);
        // فك التوكن واستخراج اسم اليوزر
        const decoded = jwtDecode(response.data.accessToken);
        const userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        console.log(userId);
        // خزني اسم اليوزر
        localStorage.setItem("userName", userName);
        localStorage.setItem("userId", userId);
        
        // عرض رسالة النجاح
        setSnackbar({
          open: true,
          message: "Login successful! 🎉",
          severity: "success",
        });

        // تأخير الانتقال ثانية واحدة لضمان حفظ التوكن قبل التنقل
        setTimeout(() => {
          navigate("/app/feed");
        }, 1500);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error:", error);
      
      // عرض رسالة الخطأ
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
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
              src={logo}
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
            justifyContent: "center", // الفورم بالمنتصف بالموبايل
            mt: 10, // margin مناسب للشاشات الصغيرة
            gap: { xs: 4, md: 30 },
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
            component="form"
            onSubmit={handleSubmit(loginHandle)}
            sx={{
              width: { xs: "130%", sm: 400 }, // 90% على الموبايل
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

            {/* Fields */}
            <TextField
              fullWidth
              {...register("email")}
              margin="normal"
              label="Email"
              placeholder="john.doe@gmail.com"
              variant="outlined"
              required
              error={errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              {...register("password")}
              margin="normal"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              required
              error={errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={<Checkbox />}
                {...register("rememberMe")}
                label="Remember me"
              />
              <Link component={RouterLink} to="/forgetPassword" variant="body2">
                Forgot password?
              </Link>
            </Box>
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
              {currentTab === 0 ? "Sign In" : "Create Account"}
            </CustomButton>

            <Typography
              sx={{
                mt: 2,
                textAlign: "center",
                fontSize: "12px",
                color: "#475569",
              }}
            >
              <Lock
                sx={{
                  fontSize: 14,
                  color: "#f0c724bf",
                  verticalAlign: "middle",
                  mr: 0.5,
                }}
              />{" "}
              Secure ·
              <School
                sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5, ml: 0.5 }}
              />{" "}
              University Verified ·
              <ElectricBoltSharp
                sx={{
                  fontSize: 14,
                  color: "#f0c724bf",
                  verticalAlign: "middle",
                  mr: 0.5,
                  ml: 0.5,
                }}
              />{" "}
              Free Forever
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ 
            width: "100%",
            bgcolor: snackbar.severity === "success" ? "#3b82f6" : "#EF4444",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}