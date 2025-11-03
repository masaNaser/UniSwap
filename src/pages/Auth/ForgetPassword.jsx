import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import { forgotPassword as forgotPasswordApi } from "../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const ForgetHandle = async (data) => {
    try {
      setLoading(true);
      const response = await forgotPasswordApi(data);

      if (response.status === 200) {
        // عرض رسالة النجاح
        setSnackbar({
          open: true,
          message: "Code has been sent successfully! ✓",
          severity: "success",
        });

        // تمرير الإيميل للفورم الثاني بعد ثانية
        setTimeout(() => {
          navigate("/resetPassword", { state: { email: data.email } });
        }, 1000);
      }
      console.log(response);
    } catch (error) {
      const errorMessage =
        error.response?.data?.title ||
        "Failed to send the code. Please try again.";
      
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
          Enter your email to receive the code
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit(ForgetHandle)}>
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
          <CustomButton
            fullWidth
            variant="contained"
            loading={loading}
            sx={{ mt: 5 }}
            type="submit"
          >
            Send Code
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