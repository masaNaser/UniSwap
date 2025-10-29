// import React, { useState, useEffect } from "react";
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Typography,
//     Box,
//     TextField,
//     Grid,
//     IconButton,
//     InputAdornment,
//     MenuItem,
//     Select,
//     FormControl,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DescriptionIcon from "@mui/icons-material/Description";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import SendIcon from "@mui/icons-material/Send";
// import Point from "../../assets/images/Point.svg";
// import CustomButton from "../CustomButton/CustomButton";
// import DisabledCustomButton from "../CustomButton/DisabledCustomButton";
// import {createCollaborationRequest} from "../../services/collaborationService"
// const RequestServiceModal = ({ open, onClose, projectTitle,providerId, projectId, pointsBudget: initialPoints }) => {
//     const [serviceTitle, setServiceTitle] = useState(projectTitle || "");
//     const [serviceDescription, setServiceDescription] = useState("");
//     const [serviceCategory, setServiceCategory] = useState("");
//     const [pointsBudget, setPointsBudget] = useState(initialPoints || "");
//     const [deadline, setDeadline] = useState("");
//      const token = localStorage.getItem("accessToken");
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Check if form is valid
//     const isRequestFormValid =
//         serviceTitle.trim() !== "" &&
//         serviceDescription.trim() !== "" &&
//         serviceCategory !== "" &&
//         pointsBudget !== "" &&
//         deadline !== "";

//     // Handle Submit
//     const handleSubmit = async() => {
//         try{
//         setIsSubmitting(true);
//         const requestData = {
//             // title: serviceTitle,
//             // description: serviceDescription,
//             // category: serviceCategory,
//             // pointsOffered: parseInt(pointsBudget),
//             // deadline: deadline,
//             // providerId: providerId, // ⬅️ ID اليوزر اللي بدك تطلب منه
//             // publishProjectId: projectId,
//              title: serviceTitle,
//         description: serviceDescription,
//         pointsOffered: parseInt(pointsBudget),
//         deadline: deadline, // تأكد إنه بالفورمات: "2025-10-30"
//         providerId: providerId, // ⬅️ ID اليوزر اللي بدك تطلب منه
//         type: serviceCategory === "Project" ? "RequestProject" : "RequestCourse"
//         };

//     const response = await createCollaborationRequest(token, requestData);
//       console.log("Request created successfully:", response);

//         handleClose();
    
//     }catch (error) {
//       console.error("Error creating request:", error);
//       // عرض رسالة خطأ
//       alert("Failed to send request. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//     };
  
//     // Handle Close & Reset
//     const handleClose = () => {
//         setServiceTitle(projectTitle || "");
//         setServiceDescription("");
//         setServiceCategory("");
//         setPointsBudget(initialPoints || "");
//         setDeadline("");
//         onClose();
//     };

//     // Update fields when modal opens
//     useEffect(() => {
//         if (open) {
//             if (projectTitle) setServiceTitle(projectTitle);
//             if (initialPoints) setPointsBudget(initialPoints);
//         }
//     }, [open, projectTitle, initialPoints]);

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             maxWidth="sm"
//             fullWidth
//             PaperProps={{
//                 sx: {
//                     borderRadius: "16px",
//                     p: 1,
//                 },
//             }}
//         >
//             <DialogTitle
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     pb: 1.5,
//                 }}
//             >
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <DescriptionIcon sx={{ color: "#3b82f6" }} />
//                     <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                         Request: {projectTitle}
//                     </Typography>
//                 </Box>
//                 <IconButton onClick={handleClose} size="small">
//                     <CloseIcon />
//                 </IconButton>
//             </DialogTitle>

//             <DialogContent sx={{ pt: 1, pb: 1 }}>
//                 {/* Service Title */}
//                 <Box sx={{ mb: 2 }}>
//                     <Typography
//                         variant="body2"
//                         sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
//                     >
//                         Service Title <span style={{ color: "red" }}>*</span>
//                     </Typography>
//                     <TextField
//                         fullWidth
//                         placeholder="What service do you need?"
//                         value={serviceTitle}
//                         onChange={(e) => setServiceTitle(e.target.value)}
//                         sx={{
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "8px",
//                                 height: "46px",
//                             },
//                         }}
//                     />
//                 </Box>

//                 {/* Description */}
//                 <Box sx={{ mb: 2 }}>
//                     <Typography
//                         variant="body2"
//                         sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
//                     >
//                         Description <span style={{ color: "red" }}>*</span>
//                     </Typography>
//                     <TextField
//                         fullWidth
//                         multiline
//                         rows={3}
//                         placeholder="Describe your project in detail..."
//                         value={serviceDescription}
//                         onChange={(e) => setServiceDescription(e.target.value)}
//                         sx={{
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "8px",
//                             },
//                         }}
//                     />
//                 </Box>

//                 {/* Category & Points Budget */}
//                 <Grid container spacing={2} sx={{ mb: 2 }}>
//                     <Grid item xs={6}>
//                         <Typography
//                             variant="body2"
//                             sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
//                         >
//                             Request Type <span style={{ color: "red" }}>*</span>
//                         </Typography>
//                         <FormControl fullWidth>
//                             <Select
//                                 value={serviceCategory}
//                                 onChange={(e) => setServiceCategory(e.target.value)}
//                                 displayEmpty
//                                 sx={{
//                                     borderRadius: "8px",
//                                     height: "46px",
//                                     "& .MuiSelect-select": {
//                                         display: "flex",
//                                         alignItems: "center",
//                                     },
//                                 }}
//                             >
//                                 <MenuItem value="" disabled>
//                                     Select Request Type
//                                 </MenuItem>
//                                 <MenuItem value="Project">Project</MenuItem>
//                                 <MenuItem value="Course">Course</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={6}>
//                         <Typography
//                             variant="body2"
//                             sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
//                         >
//                             Points Budget <span style={{ color: "red" }}>*</span>
//                         </Typography>
//                         <TextField
//                             fullWidth
//                             type="number"
//                             placeholder="e.g., 150"
//                             value={pointsBudget}
//                             onChange={(e) => setPointsBudget(e.target.value)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <img
//                                             src={Point}
//                                             alt="points"
//                                             style={{ width: 24, height: 24 }}
//                                         />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: "8px",
//                                     height: "46px",
//                                 },
//                             }}
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* Deadline */}
//                 <Box sx={{ mb: 1.5 }}>
//                     <Typography
//                         variant="body2"
//                         sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
//                     >
//                         Deadline
//                     </Typography>
//                     <TextField
//                         fullWidth
//                         type="date"
//                         value={deadline}
//                         onChange={(e) => setDeadline(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 20 }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "8px",
//                                 height: "46px",
//                             },
//                         }}
//                     />
//                 </Box>
//             </DialogContent>

//             {/* Buttons*/}
//             <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
//                 <CustomButton
//                     variant="outlined"
//                     onClick={handleClose}
//                     sx={{
//                         minWidth: "100px",
//                         background: "white",
//                         color: "#3b82f6",
//                         border: "1px solid #3b82f6",
//                     }}
//                 >
//                     Cancel
//                 </CustomButton>
//                   {isRequestFormValid ? (
//           <CustomButton
//             onClick={handleSubmit}
//             startIcon={<SendIcon />}
//             disabled={isSubmitting} // ⬅️ disable أثناء الإرسال
//             sx={{ minWidth: "150px" }}
//           >
//             {isSubmitting ? "Sending..." : "Send Request"}
//           </CustomButton>
//         ) : (
//           <DisabledCustomButton startIcon={<SendIcon />} sx={{ minWidth: "150px" }}>
//             Send Request
//           </DisabledCustomButton>
//         )}
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default RequestServiceModal;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import Point from "../../assets/images/Point.svg";
import CustomButton from "../CustomButton/CustomButton";
import DisabledCustomButton from "../CustomButton/DisabledCustomButton";
import { createCollaborationRequest } from "../../services/collaborationService";

const RequestServiceModal = ({
  open,
  onClose,
  providerId,
  projectTitle,
  projectId,
  providerName,
  pointsBudget: initialPoints,
}) => {
  const [serviceTitle, setServiceTitle] = useState(projectTitle || "");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [pointsBudget, setPointsBudget] = useState(initialPoints || "");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
   const token = localStorage.getItem("accessToken");

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check if form is valid
  const isRequestFormValid =
    serviceTitle.trim() !== "" &&
    serviceDescription.trim() !== "" &&
    serviceCategory !== "" &&
    pointsBudget !== "" &&
    deadline !== "";

  // Handle Submit
  const handleSubmit = async () => {
    if (!providerId) {
      setSnackbar({
        open: true,
        message: "Provider ID is missing!",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // جهز البيانات حسب طلب الباك
      const requestData = {
        title: serviceTitle,
        description: serviceDescription,
        pointsOffered: parseInt(pointsBudget),
        deadline: deadline, // بالفورمات: "2025-10-30"
        providerId: providerId,
        type: serviceCategory === "Project" ? "RequestProject" : "RequestCourse",
      };

      // 🔍 اطبع البيانات قبل الإرسال
      console.log("Sending request data:", requestData);
      console.log("Provider ID:", providerId);

      if (!token) {
        setSnackbar({
          open: true,
          message: "You need to login first!",
          severity: "error",
        });
        setIsSubmitting(false);
        return;
      }

      // اعمل الـ API call
      const response = await createCollaborationRequest(token, requestData);

      console.log("✅ Request created successfully:", response);

      // عرض رسالة نجاح
      setSnackbar({
        open: true,
        message: "Request sent successfully!",
        severity: "success",
      });

      // انتظر شوي قبل ما نسكر المودال عشان المستخدم يشوف الرسالة
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("❌ Error creating request:", error);
      
      // 🔍 اطبع تفاصيل الخطأ بالكامل
      if (error.response) {
        console.error("📛 Server Error Response:", error.response.data);
        console.error("📛 Status Code:", error.response.status);
        console.error("📛 Headers:", error.response.headers);
      }

      // عرض رسالة خطأ مفصلة
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.response?.data ||
        error.message ||
        "Failed to send request. Please try again.";

         // فرّغ الفورم مؤقتًا مباشرة بعد النجاح
setServiceTitle(projectTitle || "");
setServiceDescription("");
setServiceCategory("");
setPointsBudget(initialPoints || "");
setDeadline("");

// وقف حالة التحميل
setIsSubmitting(false);

setTimeout(() => {
  handleClose();
}, 1500);

      setIsSubmitting(false);
    }
  };

  // Handle Close & Reset
  const handleClose = () => {
    setServiceTitle(projectTitle || "");
    setServiceDescription("");
    setServiceCategory("");
    setPointsBudget(initialPoints || "");
    setDeadline("");
    setIsSubmitting(false);
    onClose();
  };

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Update fields when modal opens
  useEffect(() => {
    if (open) {
      if (projectTitle) setServiceTitle(projectTitle);
      if (initialPoints) setPointsBudget(initialPoints);
    }
  }, [open, projectTitle, initialPoints]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon sx={{ color: "#3b82f6" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Request Service
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: 1 }}>
              {/* معلومات عن الشخص */}
  {providerName && (
    <Box
      sx={{
        mb: 2.5,
        p: 1.5,
        borderRadius: "10px",
        backgroundColor: "rgba(59,130,246,0.08)",
      }}
    >
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, color: "#1e40af" }}
      >
        You’re sending a request to <strong>{providerName}</strong>
      </Typography>
    </Box>
  )}
          {/* Service Title */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
            >
              Service Title <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="What service do you need?"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "46px",
                },
              }}
            />
          </Box>

          {/* Description */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
            >
              Description <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your project in detail..."
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>

          {/* Category & Points Budget */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
              >
                Request Type <span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  displayEmpty
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: "8px",
                    height: "46px",
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Request Type
                  </MenuItem>
                  <MenuItem value="Project">Project</MenuItem>
                  <MenuItem value="Course">Course</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body2"
                sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
              >
                Points Budget <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="e.g., 150"
                value={pointsBudget}
                onChange={(e) => setPointsBudget(e.target.value)}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={Point}
                        alt="points"
                        style={{ width: 24, height: 24 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "46px",
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Deadline */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
            >
              Deadline <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "46px",
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* Buttons */}
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <CustomButton
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{
              minWidth: "100px",
              background: "white",
              color: "#3b82f6",
              border: "1px solid #3b82f6",
            }}
          >
            Cancel
          </CustomButton>
          {isRequestFormValid ? (
            <CustomButton
              onClick={handleSubmit}
              startIcon={<SendIcon />}
              disabled={isSubmitting}
              sx={{ minWidth: "150px" }}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </CustomButton>
          ) : (
            <DisabledCustomButton startIcon={<SendIcon />} sx={{ minWidth: "150px" }}>
              Send Request
            </DisabledCustomButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RequestServiceModal;