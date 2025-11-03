import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Email, Lock, VpnKey } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import { resetPassword as resetPasswordApi } from "../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function ResetPassword() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const email = location.state?.email || ""; // الإيميل الممرر من ForgetPassword

  const validationSchema = yup.object({
    code: yup.string().required("Code is required"),
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      case 1:
        return { text: "very weak", color: "red" };
      case 2:
        return { text: "weak", color: "orange" };
      case 3:
      case 4:
        return { text: "strong", color: "green" };
      default:
        return { text: "", color: "inherit" };
    }
  };

  const ResetHandle = async (data) => {
    try {
      setLoading(true);
      const response = await resetPasswordApi({ email, ...data });
      if (response.status === 200) {
        // عرض رسالة النجاح
        setSnackbar({
          open: true,
          message: "Password has been reset successfully! ✓",
          severity: "success",
        });

        // الانتقال لصفحة اللوقن بعد ثانية
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.[0] ||
        "Failed to reset password. Please try again.";
      
      // عرض رسالة الخطأ
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 8,
          p: 8,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Reset Password
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit(ResetHandle)}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            {...register("code")}
            fullWidth
            margin="normal"
            label="Code"
            placeholder="xxxx"
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            {...register("newPassword")}
            fullWidth
            margin="normal"
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            variant="outlined"
            required
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            onChange={(e) => {
              register("newPassword").onChange(e);
              checkStrength(e.target.value);
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
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          <CustomButton
            fullWidth
            loading={loading}
            variant="contained"
            sx={{ mt: 5 }}
            type="submit"
          >
            Reset Password
          </CustomButton>
        </Box>
      </Box>

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