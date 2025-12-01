import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  LinearProgress,
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

  const navigate = useNavigate();
  const email = location.state?.email || "";

  // -------------------- VALIDATION --------------------
  const validationSchema = yup.object({
    code: yup.string().required("Code is required"),
     newPassword: yup
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

const checkStrength = (value) => {
  let score = 0;
  if (value.length >= 8) score++;          // طول ≥ 8
  if (/[A-Z]/.test(value)) score++;        // حرف كبير
  if (/[a-z]/.test(value)) score++;        // حرف صغير
  if (/[0-9]/.test(value)) score++;        // رقم
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
  // -------------------- TIMER 15 MINUTES --------------------
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [codeExpired, setCodeExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCodeExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // -------------------- HANDLE SUBMIT --------------------
  const ResetHandle = async (data) => {
    try {
      if (codeExpired) {
        Swal.fire({
          icon: "error",
          title: "Code expired",
          text: "Please request a new verification code.",
        });
        return;
      }

      setLoading(true);
      const response = await resetPasswordApi({ email, ...data });

      if (response.status === 200) {
        Swal.fire({
          title: "Password reset successfully.",
          icon: "success",
          timer: 1500,
        });
        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.[0] ||
        "Failed to reset password. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  return (
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

      {/* TIMER UNDER THE TITLE */}
      <Box sx={{ mb: 3, mt: -1 }}>
        {!codeExpired ? (
          <Box
            sx={{
              display: "inline-block",
              bgcolor: "#3B82F6",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 3,
              fontSize: "20px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            Code valid for: {minutes}:{seconds < 10 ? "0" + seconds : seconds}
          </Box>
        ) : (
          <Typography
            color="error"
            sx={{ fontWeight: "bold", fontSize: "20px" }}
          >
            Code expired. Please request a new one.
          </Typography>
        )}
      </Box>

      <Box component={"form"} onSubmit={handleSubmit(ResetHandle)}>
        {/* EMAIL (DISABLED) */}
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

        {/* CODE INPUT */}
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

        {/* NEW PASSWORD */}
        <TextField
          {...register("newPassword")}
          fullWidth
          margin="normal"
          label="New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          error={errors.newPassword}
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

        {/* PASSWORD STRENGTH */}
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

        {/* CONFIRM PASSWORD */}
        <TextField
          {...register("confirmPassword")}
          fullWidth
          margin="normal"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
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

        {/* SUBMIT BUTTON */}
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
  );
}
