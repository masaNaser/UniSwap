import React, { useState } from "react";
import "../Login/Login.css"
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Tabs,
  Tab,
  Container ,
  InputAdornment,
} from "@mui/material";
import { Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
export default function Register() {
   const [tab, setTab] = useState(0);
   const[showPassword,setshowPassword] = useState(false);
  return (
    <>
    <Container >
  {/* NavBar */}
      <div className="nav">
        <Button startIcon={<KeyboardBackspaceIcon />} color="inherit" sx={{ textTransform: "none" }}>
          Back
        </Button>

        <div >
          <img src="\src\assets\Logo.png" alt="UniSwap logo" className="logo"/>
        </div>
      </div>
 <Box
  sx={{
    width: 400,
    p: 4,
    borderRadius: 16,
    boxShadow: 3,
    bgcolor: "white",
    border: "4px solid", // لازم تحددي عرض البوردر
    // borderImage: "linear-gradient(to right, #6a11cb, #2575fc) 1",
    borderImageSlice: 1, // مهم عشان يظهر التدرج على البوردر
    marginTop: "130px"
  }}
>
    <div sx={{display:"flex"}}>
        <span className="heading1">Welcome to UniSwap</span>
        <p className="heading2">Your academic collaboration starts here</p>
    </div>

    <Tabs
  value={tab}
  onChange={(e, newValue) => setTab(newValue)}
  centered
  sx={{
    mb: 3,
    "& .MuiTab-root:focus": { outline: "none" }, // يشيل البوردر الأسود
      mx: "auto", // يخلي الفورم بالوسط
  }}
>
  <Tab label="Sign In" />
  <Tab label="Sign Up" />
</Tabs>

  <form>
    <TextField
  fullWidth
  margin="normal"
  label="full name"
  placeholder="john Doe"
  variant="outlined"
  color="secondary"
  required
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Person />
      </InputAdornment>
    ),
  }}
/>
    {/* Email */}
<TextField
  fullWidth
  margin="normal"
  label="Email"
  placeholder="john.doe@gmail.com"
  variant="outlined"
  color="secondary"
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
  fullWidth
  margin="normal"
  label="University"
  placeholder="University Name"
  variant="outlined"
  color="secondary"
  required
  // InputProps={{
  //   startAdornment: (
  //     <InputAdornment position="start">
  //       <Person />
  //     </InputAdornment>
  //   ),
  // }}
/>
    {/* Password */}
        <TextField
            fullWidth
            margin="normal"
            label="Password"
            placeholder="Create a strong password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            required
            color="secondary"
             InputProps={{
              startAdornment: (
      <InputAdornment position="start">
        <Lock />
      </InputAdornment>
    )
            //    endAdornment: (
            //        <IconButton
            //          onClick={() => setshowPassword(!showPassword)}
            //        >
            //          {showPassword ? <VisibilityOff /> : <Visibility />}
            //       </IconButton>
            //    ),
          
  }}
    />
           <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            placeholder="Confirm your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            required
            color="secondary"
             InputProps={{
              startAdornment: (
      <InputAdornment position="start">
        <Lock />
      </InputAdornment>
    )
            //    endAdornment: (
            //        <IconButton
            //          onClick={() => setshowPassword(!showPassword)}
            //        >
            //          {showPassword ? <VisibilityOff /> : <Visibility />}
            //       </IconButton>
            //    ),
          
  }}
    />
    <div>
      <p className="Creatcontent">By signing up, you agree to our Terms of Service and Privacy Policy.<br/>
         Your university email will be verified before account activation.</p>
    </div>
    {/* Button */}
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{
        mt: 2,
        py: 1.5,
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
      }}
    >
      {tab === 0 ? "Sign In" : "Sign Up"}
    </Button>
  </form>
</Box>
</Container>
    </>
  );
}


