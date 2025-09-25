import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Box, TextField, Typography, InputAdornment } from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../shared/CustomButton/CustomButton";
import { forgotPassword as forgotPasswordApi } from "../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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
          timer: 1000,
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
        timer: 1000,
      });
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };
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
  );
}
