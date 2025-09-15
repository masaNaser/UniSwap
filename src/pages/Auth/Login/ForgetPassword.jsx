

import { useRef, useState } from "react";
import { Box, TextField, Button, Typography,  InputAdornment } from "@mui/material";
import {
  Email,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
 import CustomButton from "../../../shared/CustomButton/CustomButton";
import { forgotPassword as forgotPasswordApi } from "../../../services/authService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function ForgetPassword() {
  // const [code, setCode] = useState(["", "", "", ""]);
  // const inputsRef = useRef([]);
  // const navigate = useNavigate();

  // const handleChange = (i, value) => {
  //   if (!/^\d?$/.test(value)) return; // رقم واحد فقط
  //   const newCode = [...code];
  //   newCode[i] = value;
  //   setCode(newCode);
  //   if (value && i < 3) inputsRef.current[i + 1]?.focus();
  // };

  // const handleKeyDown = (i, e) => {
  //   if (e.key === "Backspace" && !code[i] && i > 0) {
  //     inputsRef.current[i - 1]?.focus();
  //   }
  // };

  // const handlePaste = (e) => {
  //   const pasted = e.clipboardData.getData("text").slice(0, 4).split("");
  //   const newCode = [...code];
  //   for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i];
  //   setCode(newCode);
  //   if (pasted.length < 4) inputsRef.current[pasted.length]?.focus();
  // };

  // const handleSend = () => {
  //   const finalCode = code.join("");
  //   if (finalCode === "1234") navigate("/reset-password");
  //   else alert("الكود غير صحيح");
  // };
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
  const ForgetHandle= async(data)=>{
    try{
   const response = await forgotPasswordApi(data);
   console.log(response);
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8, p: 8, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>Enter your email to receive the code</Typography>
      {/* <Box display="flex" justifyContent="space-between" onPaste={handlePaste}>
        {code.map((num, i) => (
          <TextField
            key={i}
            inputRef={(el) => (inputsRef.current[i] = el)}
            value={num}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: 24, width: 50 } }}
          />
        ))}
      </Box> */}
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
       <CustomButton fullWidth variant="contained" sx={{ mt: 5 }} type="submit">Send Code</CustomButton>

   </Box>
    {/* <CustomButton fullWidth variant="contained" sx={{ mt: 5 }} onClick={handleSend}>Send Code</CustomButton> */}
    
    </Box>
  );
}
