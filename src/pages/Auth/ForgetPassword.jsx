import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Container,
  Button,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import { forgotPassword as forgotPasswordApi } from "../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Logo from "/logo.png";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);

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
  const ForgetHandle = async (data) => {
    try {
      setLoading(true);
      const response = await forgotPasswordApi(data);

      if (response.status === 200) {
        Swal.fire({
          title: "Code has been sent successfully.",
          icon: "success",
          draggable: true,
          timer: 1500,
          showConfirmButton: false,
        });
        // تمرير الإيميل للفورم الثاني
        navigate("/resetPassword", { state: { email: data.email } });
      }
      console.log(response);
    } catch (error) {
      const errorMessage =
        error.response?.data?.title ||
        "Failed to sent the code. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
        timer: 1500,
      });
      console.log(error);
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
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          maxWidth: "400px",
          mx: "auto",
          mt: 4,
          p:  { xs: 4, sm: 8 },
          boxShadow: 3,
          mb:3,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
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
              error={!!errors.email} 
              helperText={errors.email ? errors.email.message : ""} 
              
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
    </>
  );
}
