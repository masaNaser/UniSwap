<<<<<<< HEAD


// import React, { useState } from "react";
// import "../Login/Login.css";
=======
// import React, { useState } from "react";
// import "../Login/Login.css"
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
// import {
//   Box,
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Link,
//   Tabs,
//   Tab,
<<<<<<< HEAD
//   Container,
//   InputAdornment,
//   Typography,
// } from "@mui/material";
// import { Email, Lock, CheckCircle,School,ElectricBoltSharp  } from "@mui/icons-material";
// import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function Login() {
//   const [showPassword, setshowPassword] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // نحدد التاب حسب الرابط الحالي
//   const currentTab = location.pathname === "/login" ? 0 : 1;

//   return (
//     <>
//       {/* Navbar */}
//       <Box className="nav">
//         <Button
//           startIcon={<KeyboardBackspaceIcon />}
//           color="inherit"
//           sx={{ textTransform: "none", color: "#74767a" }}
//         >
//           Back
//         </Button>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "center",
//             gap: "6px",
//           }}
//         >
//           <Box>
//             <img
//               src="src/assets/images/logo.png"
//               alt="UniSwap logo"
//               className="logo"
//             />
//           </Box>
//           <Typography
//             component={"span"}
//             sx={{
//               fontWeight: "600",
//               color: "#74767a",
//               fontSize: "14px",
//             }}
//           >
//             UniSwap
//           </Typography>
//         </Box>
//       </Box>

//       {/* Content */}
//       <Container maxWidth="lg" className="soso container">
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: {
//                xs: "column", // في الموبايل (xs - sm)
//                md: "row",    // من md وفوق (ديسكتوب)
//                 } ,
//              alignItems: "center",
//             justifyContent: "space-between",
//             mt: "120px",
//             gap: 6,
//           }}
//         >
//           {/* LEFT SECTION */}
//           <Box sx={{ flex: 1 }}>
//             <Typography
//               component={"h2"}
//               sx={{
//                 fontSize: "36px",
//                 fontWeight: "700",
//                 lineHeight: "44px",
//                 color: "#0f172a",
//               }}
//             >
//               Join the Future of <br />
//               <Typography
//                 component={"span"}
//                 sx={{
//                   background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   fontWeight: "700",
//                   fontSize: "36px",
//                 }}
//               >
//                 Student Collaboration
//               </Typography>
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 2,
//                 fontSize: "18px",
//                 color: "#475569",
//                 lineHeight: "28px",
//               }}
//             >
//               Connect with fellow students, exchange skills, and build lasting
//               academic relationships in a safe, university-verified environment.
//             </Typography>

//             {/* Features list */}
//             <Box sx={{ mt: 3 }}>
//               {[
//                 "Connect with students across universities",
//                 "Exchange skills using our points system",
//                 "Build your academic portfolio",
//                 "Access to exclusive study groups",
//                 "Real-time collaboration tools",
//               ].map((text, i) => (
//                 <Box
//                   key={i}
//                   sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
//                 >
//                   <CheckCircle sx={{ color: "#22c55e", mr: 1 }} />
//                   <Typography sx={{ color: "#0f172a" }}>{text}</Typography>
//                 </Box>
//               ))}
//             </Box>

//             {/* University Verified card */}
//             <Box
//               sx={{
//                 mt: 4,
//                 p: 2.5,
//                 borderRadius: 3,
//                 bgcolor: "#F8FAFC",
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: 2,
//                 boxShadow: "inset 0 0 4px #e2e8f0",
//                 maxWidth: "500px",
//               }}
//             >
//               <Box>
//                 <Typography sx={{ fontWeight: "600", color: "#0f172a" }}>
//                   University Verified
//                 </Typography>
//                 <Typography sx={{ fontSize: "14px", color: "#475569" }}>
//                   Join 5,000+ students from 25+ universities already using
//                   UniSwap to enhance their academic journey.
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* RIGHT SECTION (Form) */}
//           <Box
//             sx={{
//               width: 400,
//               p: 4,
//               borderRadius: 4,
//               boxShadow: 3,
//               bgcolor: "white",
//             }}
//           >
//             <Box sx={{ textAlign: "center", mb: 3 }}>
//               <Typography
//                 sx={{
//                   fontSize: "20px",
//                   fontWeight: "600",
//                   color: "#0f172a",
//                 }}
//               >
//                 Welcome to UniSwap
//               </Typography>
//               <Typography sx={{ fontSize: "14px", color: "#475569" }}>
//                 Your academic collaboration starts here
//               </Typography>
//             </Box>

//             {/* Tabs */}
//             <Tabs
//               value={currentTab}
//               onChange={(e, newValue) => {
//                 if (newValue === 0) navigate("/login");
//                 if (newValue === 1) navigate("/register");
//               }}
//               centered
//                 textColor="inherit"
//               sx={{
//                 bgcolor: "#F1F5F9",
//                 borderRadius: "50px",
//                 minHeight: "40px",
//                 "& .MuiTab-root": { //لما الـ Tab ينعمل له select
//                   textTransform: "none",
//                   fontWeight: 600,
//                   color: "#475569",
//                   borderRadius: "50px",
//                   minHeight: "40px",
//                   minWidth: "120px",
//                   margin: "4px",
//                 },
//                 "& .Mui-selected": {
//                   background: "#FFFFFF",
//                   color: "#0F172A !important",
//                 },
//                 "& .MuiTabs-indicator": {
//                   display: "none",
//                 },
//               }}
//             >
//               <Tab label="Sign In" />
//               <Tab label="Sign Up" />
//             </Tabs>

//             {/* Form */}
//             <Box component={"form"} sx={{ padding: "35px 0 0 0"}}>
//               <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Email"
//                 placeholder="john.doe@gmail.com"
//                 variant="outlined"
//                 required
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Email />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Password"
//                 placeholder="Enter your password"
//                 type={showPassword ? "text" : "password"}
//                 variant="outlined"
//                 required
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Lock />
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mt: 1,
//                 }}
//               >
//                 <FormControlLabel control={<Checkbox />} label="Remember me" />
//                 <Link href="#" variant="body2">
//                   Forgot password?
//                 </Link>
//               </Box>

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   mt: 2,
//                   py: 1.5,
//                   fontSize: 16,
//                   textTransform: "none",
//                   borderRadius: 3,
//                   opacity: 0.5,
//                   background: "linear-gradient(to right,#00C8FF,#8B5FF6)",
//                   "&:hover": { opacity: 0.9 },
//                 }}
//               >
//                 {currentTab === 0 ? "Sign In" : "Create Account"}
//               </Button>
//                 <Typography sx={{ mt: 2, textAlign: "center", fontSize: "12px", color: "#475569" }}>
//                  <Lock sx={{ fontSize: 14,color: "#f0c724bf", verticalAlign: "middle", mr: 0.5 }} /> Secure ·
//                  <School sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5, ml: 0.5 }} /> University Verified ·
//                  <ElectricBoltSharp sx={{ fontSize: 14,color: "#f0c724bf",verticalAlign: "middle", mr: 0.5, ml: 0.5 }} /> Free Forever
//              </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Container>
=======
//   Container ,
//   InputAdornment,
//   Typography,
// } from "@mui/material";
// import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// export default function Login() {
//   const [tab, setTab] = useState(0);
//    const[showPassword,setshowPassword] = useState(false);
//   return (
//     <>
 
//     <Container maxWidth="xl" >
//       <Box className="nav">
//         <Button startIcon={<KeyboardBackspaceIcon />} color="inherit" sx={{ textTransform: "none" }}>Back</Button>
//         <Box sx={{
//           display:'flex',
//           flexDirection:'row',
//           alignItems:'center',
//           gap:'3px',
//         }}>
//           <img src="src/assets/images/logo.png" alt="UniSwap logo" className="logo"/>
//           <Typography component={'span'}>UniSwap</Typography>
//         </Box>
//       </Box>
//       </Container>
// <Container maxWidth="xl" >
//   <Box sx={{
//         display:"flex",
//         flexDirection:"row",
//         alignItems:"center"
//       }}>
//     <Box className="right-side">
//       <Typography component={'h2'}>Join the Future of<br/>Student Collaboration</Typography>
//       <Typography component={'p'} color="#475569" sx={{fontSize:"18px"}}>Connect with fellow students, exchange skills, and build lasting academic relationships in a safe, university-verified environment.</Typography>
//     </Box>

//      <Box className="left-side"
//      sx={{
//      width: 400,
//      p: 4,
//      borderRadius: 16,
//      boxShadow: 3,
//      bgcolor: "white",
//      // border: "4px solid", // لازم تحددي عرض البوردر
//      // borderImage: "linear-gradient(to right, #6a11cb, #2575fc) 1",
//      borderImageSlice: 1, // مهم عشان يظهر التدرج على البوردر
//      marginTop: "130px"
//   }}>
//     <Box>
//       <Typography component={'span'} className="heading1">Welcome to UniSwap</Typography>
//       <Typography component={'p'} className="heading2">Your academic collaboration starts here</Typography>
//     </Box>

//     <Tabs
//       value={tab}
//       onChange={(e, newValue) => setTab(newValue)}
//       centered
//       sx={{
//     mb: 3,
//     "& .MuiTab-root:focus": { outline: "none" }, // يشيل البوردر الأسود
//       mx: "auto", // يخلي الفورم بالوسط
//           "& .MuiTab-root": {
//                 fontWeight: "600",
//                 textTransform: "none",
//               },
//               "& .Mui-selected": {
//                 color: "#6a11cb !important",
//               },
//               "& .MuiTabs-indicator": {
//                 background:
//                   "linear-gradient(to right, #6a11cb, #2575fc)",
//                 height: "3px",
//                 borderRadius: "3px",
//               },
//        }}>
//      <Tab label="Sign In" />
//      <Tab label="Sign Up" />
//    </Tabs>

//      <Box component={'form'}>
//     {/* Email */}
// <TextField
//   fullWidth
//   margin="normal"
//   label="Email"
//   placeholder="john.doe@gmail.com"
//   variant="outlined"
//   color="secondary"
//   required
//   InputProps={{
//     startAdornment: (
//       <InputAdornment position="start">
//         <Email />
//       </InputAdornment>
//     ),
//   }}
// />

//     {/* Password */}
//         <TextField
//             fullWidth
//             margin="normal"
//             label="Password"
//             placeholder="Enter your password"
//             type={showPassword ? "text" : "password"}
//             variant="outlined"
//             required
//             color="secondary"
//              InputProps={{
//               startAdornment: (
//       <InputAdornment position="start">
//         <Lock />
//       </InputAdornment>
//     )
//             //    endAdornment: (
//             //        <IconButton
//             //          onClick={() => setshowPassword(!showPassword)}
//             //        >
//             //          {showPassword ? <VisibilityOff /> : <Visibility />}
//             //       </IconButton>
//             //    ),
          
//   }}
//     />
//     {/* Remember me + Forgot */}
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         mt: 1,
//       }}
//     >
//       <FormControlLabel control={<Checkbox />} label="Remember me" />
//       <Link href="#" variant="body2">
//         Forgot password?
//       </Link>
//     </Box>

//     {/* Button */}
//       <Button
//         type="submit"
//         fullWidth
//         variant="contained"
//         sx={{
//           mt: 2,
//           py: 1.5,
//           borderRadius: 3,
//           background: "linear-gradient(to right, #447bdd7a, #6fa0f6b0, #b974e6, #cd8ce994)",
//                transition: "0.3s",
//                   "&:hover": {
//                     transform: "scale(1.03)",
//                     // boxShadow: "0 6px 20px #cf9bf2ff",
//                   },
//          }}
//       >
//         {tab === 0 ? "Sign In" : "Create Account"}
//       </Button>
//      </Box>
//      </Box>

//   </Box>
// </Container>
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
//     </>
//   );
// }


<<<<<<< HEAD
=======


>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
import React, { useState } from "react";
import "../Login/Login.css";
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
} from "@mui/material";
<<<<<<< HEAD
import { Email, Lock, CheckCircle, School, ElectricBoltSharp } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // تحديد التاب الحالي
  const currentTab = location.pathname === "/login" ? 0 : 1;

  return (
    <>
      {/* Navbar */}
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
          <Button startIcon={<KeyboardBackspaceIcon />} color="inherit" sx={{ textTransform: "none",color: "#74767a"  }}>
            Back
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px", ml: 2 }}>
            <img src="src/assets/images/logo.png" alt="UniSwap logo" className="logo" />
            <Typography component={"span"} sx={{ fontWeight: "600", color: "#74767a", fontSize: "14px" }}>
              UniSwap
            </Typography>
          </Box>
        </Box>
      </Container>
      {/* Content */}
      <Container maxWidth="lg" className="container">
        <Box className="soso" sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "center", // الفورم بالمنتصف بالموبايل
          mt: 10, // margin مناسب للشاشات الصغيرة
          gap: { xs: 4, md: 30 },
        }}>
        {/* LEFT SECTION */}
        <Box sx={{ flex: 1, maxWidth: "600px" }}>
          <Typography component={"h2"} sx={{ fontSize: "36px", fontWeight: "700", lineHeight: "44px", color: "#0f172a" }}>
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

          <Typography sx={{ mt: 2, fontSize: "18px", color: "#475569", lineHeight: "28px" }}>
            Connect with fellow students, exchange skills, and build lasting academic relationships in a safe, university-verified environment.
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
              <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <CheckCircle sx={{ color: "#22c55e", mr: 1 }} />
                <Typography sx={{ color: "#0f172a" }}>{text}</Typography>
              </Box>
            ))}
          </Box>

          {/* University Verified card */}
          <Box sx={{ mt: 4, p: 2.5, borderRadius: 3, bgcolor: "#aae2f12a", display: "flex", alignItems: "flex-start", gap: 2, boxShadow: "inset 0 0 4px #e2e8f0", maxWidth: "500px" }}>
            <Box>
              <Typography sx={{ fontWeight: "600", color: "#0f172a" }}>University Verified</Typography>
              <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                Join 5,000+ students from 25+ universities already using UniSwap to enhance their academic journey.
=======
import { Email, Lock, CheckCircle } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [tab, setTab] = useState(0);
  const [showPassword, setshowPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <Box className="nav">
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          color="inherit"
          sx={{ textTransform: "none",color:"#74767a"}}
        >
          Back
        </Button>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "6px" }}>
          <Box >
            <img src="src/assets/images/logo.png" alt="UniSwap logo" className="logo"/>
          </Box>
          <Typography component={"span"} sx={{ fontWeight: "600" ,color:"#74767a",fontSize:"14px"}}>
            UniSwap
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" className="container">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mt: "120px",
            gap: 6,
          }}
        >
          {/* LEFT SECTION (Text + Features) */}
          <Box sx={{ flex: 1, maxWidth: "600px"}}>
            <Typography
              component={"h2"}
              sx={{
                fontSize: "36px",
                fontWeight: "700",
                lineHeight: "44px",
                color: "#0f172a",
              }} >
              Join the Future of <br />
              <Typography
                component={"span"}
                sx={{
                  background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "700",
                  fontSize: "36px",
                }}>
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

            {/* Features list */}
            <Box sx={{ mt: 3 }}>
              {[
                "Connect with students across universities",
                "Exchange skills using our points system",
                "Build your academic portfolio",
                "Access to exclusive study groups",
                "Real-time collaboration tools",
              ].map((text, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
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
                bgcolor: "#F8FAFC",
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                boxShadow: "inset 0 0 4px #e2e8f0",
                maxWidth: "500px",
              }}
            >
              {/* الدائرة اللي بالبداية  */}
              {/* <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#e0f2fe",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
              </Box> */}
              <Box>
                <Typography sx={{ fontWeight: "600", color: "#0f172a" }}>
                  University Verified
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                  Join 5,000+ students from 25+ universities already using UniSwap to
                  enhance their academic journey.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT SECTION (Form) */}
          <Box
            sx={{
              width: 400,
              p: 4,
              borderRadius: 4,
              boxShadow: 3,
              bgcolor: "white",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              {/* <Box>
                <img src="src/assets/images/uniswap2-04.png" alt="UniSwap logo" className="logo"/>
              </Box> */}
              <Typography sx={{ fontSize: "20px", fontWeight: "600", color: "#0f172a" }}>
                Welcome to UniSwap
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#475569" }}>
                Your academic collaboration starts here
              </Typography>
            </Box>

            {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(e, newValue) =>
              {
                setTab(newValue)
                  if (newValue === 0) navigate("/login")
                  if (newValue === 1) navigate("/register")
              }}
            centered
             sx={{
              bgcolor: "#F1F5F9",         // خلفية الـ Tabs أبيض
              borderRadius: "50px",       // كامل الحواف دائرية
              minHeight: "40px",
             "& .MuiTab-root": {
              textTransform: "none",
             fontWeight: 600,
             color: "#475569",         // لون الخط الغير محدد
              borderRadius: "50px",     // كل Tab دائرة
               minHeight: "40px",
              minWidth: "120px",        // عرض ثابت للـ Tab
             margin: "4px",             // مسافة بين Tabs
    },
    "& .Mui-selected": {
      background: "#FFFFFF", // لون الـ Tab المحدد
      color: "#0F172A",            // لون الخط للـ Tab المحدد أبيض
    },
    "& .MuiTabs-indicator": {
      display: "none",          // نخفي الخط تحت الـ Tab
    },
  }}
>
  <Tab label="Sign In" />
  <Tab label="Sign Up" />
</Tabs>

            {/* Form */}
            <Box component={"form"}>
              <TextField
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

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                required
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
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize:16,
                  textTransform: "none",
                  borderRadius: 3,
                  opacity:0.5,
                  background: "linear-gradient(to right,#00C8FF,#8B5FF6)",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                {tab === 0 ? "Sign In" : "Create Account"}
              </Button>

              <Typography
                sx={{
                  mt: 2,
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#475569",
                }}
              >
                🔒 Secure · 🎓 University Verified · ✨ Free Forever
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
              </Typography>
            </Box>
          </Box>
        </Box>
<<<<<<< HEAD

        {/* RIGHT SECTION (Form) */}
        <Box
          component="form"
          sx={{
            width: { xs: "130%", sm: 400 }, // 90% على الموبايل
            p: 4,
            borderRadius: 4,
            boxShadow: 3,
            bgcolor: "white",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography sx={{ fontSize: "20px", fontWeight: "600", color: "#0f172a" }}>
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
              mb: 3,
              "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minWidth: "120px", margin: "4px" },
              "& .Mui-selected": { background: "#FFFFFF", color: "#0F172A !important" },
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Fields */}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            placeholder="john.doe@gmail.com"
            variant="outlined"
            required
            InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            required
            InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Link href="#" variant="body2">Forgot password?</Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: 16,
              textTransform: "none",
              borderRadius: 3,
              background: "linear-gradient(to right,#00C8FF,#8B5FF6)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            {currentTab === 0 ? "Sign In" : "Create Account"}
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center", fontSize: "12px", color: "#475569" }}>
            <Lock sx={{ fontSize: 14,color: "#f0c724bf", verticalAlign: "middle", mr: 0.5 }} /> Secure ·
            <School sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5, ml: 0.5 }} /> University Verified ·
            <ElectricBoltSharp sx={{ fontSize: 14,color: "#f0c724bf",verticalAlign: "middle", mr: 0.5, ml: 0.5 }} /> Free Forever
          </Typography>
        </Box>
        </Box>
=======
>>>>>>> 1bfb1582988c644e02de2386c09cbb3e3ab50b24
      </Container>
    </>
  );
}
