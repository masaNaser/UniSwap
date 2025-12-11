import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  LinearProgress,
  IconButton,
  Container
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles"; import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import { changePassword } from "../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  // -------------------- VALIDATION --------------------
  const validationSchema = yup.object({
    OldPassword: yup.string().required("Old password is required"),
    NewPassword: yup
      .string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one digit")
      .matches(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    ConfirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("NewPassword")], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
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
        return { text: "medium", color: "gold" };
      case 4:
        return { text: "strong", color: "green" };
      case 5:
        return { text: "very strong", color: "darkgreen" };
      default:
        return { text: "", color: "inherit" };
    }
  };

  // -------------------- HANDLE SUBMIT --------------------
  const ResetHandle = async (data) => {
    const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);

      const body = {
        OldPassword: data.OldPassword,
        NewPassword: data.NewPassword,
        ConfirmPassword: data.ConfirmPassword,
      };

      const response = await changePassword(body, token);
      console.log("Change Password Response:", response);
      if (response.status === 200) {
        Swal.fire({
          title: "Password changed successfully.",
          icon: "success",
          timer: 1500,
        });
        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.[0] ||
        "Failed to change password. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Change Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <CustomButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </CustomButton>
      </Box>

      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 8,
          p: 8,
          boxShadow: 3,
          borderRadius: 2,
          mb: 5,
        }}
      >
        <Typography variant="h6" mb={2}>
          Change Password
        </Typography>

        <Box component={"form"} onSubmit={handleSubmit(ResetHandle)}>
          {/* OLD PASSWORD */}
          <TextField
            {...register("OldPassword")}
            fullWidth
            margin="normal"
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            placeholder="Enter Old password"
            variant="outlined"
            required
            error={errors.OldPassword}
            helperText={errors.OldPassword?.message}
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
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    edge="end"
                  >
                    {showOldPassword ? (
                      <VisibilityOff
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "inherit",
                        }}
                      />
                    ) : (
                      <Visibility
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "inherit",
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* NEW PASSWORD */}
          <TextField
            {...register("NewPassword")}
            fullWidth
            margin="normal"
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter New password"
            variant="outlined"
            required
            error={errors.NewPassword}
            helperText={errors.NewPassword?.message}
            onChange={(e) => {
              register("NewPassword").onChange(e);
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
                            theme.palette.mode === "dark" ? "#fff" : "inherit",
                        }}
                      />
                    ) : (
                      <Visibility
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "inherit",
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* PASSWORD STRENGTH */}
          {passwordStrength > 0 && (
            <>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength / 5) * 100}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  mt: 1,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: getStrengthLabel().color,
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
            {...register("ConfirmPassword")}
            fullWidth
            margin="normal"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            variant="outlined"
            required
            error={errors.ConfirmPassword}
            helperText={errors.ConfirmPassword?.message}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "inherit",
                        }}
                      />
                    ) : (
                      <Visibility
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "#fff" : "inherit",
                        }}
                      />
                    )}
                  </IconButton>
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
            Change Password
          </CustomButton>
        </Box>
      </Box>
    </Container>
  );
}
