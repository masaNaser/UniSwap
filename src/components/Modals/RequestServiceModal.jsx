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
import EditIcon from "@mui/icons-material/Edit";
import Point from "../../assets/images/Point.svg";
import CustomButton from "../CustomButton/CustomButton";
import DisabledCustomButton from "../CustomButton/DisabledCustomButton";
import {
  createCollaborationRequest,
  editCollaborationRequest
} from "../../services/collaborationService";

const RequestServiceModal = ({
  open,
  onClose,
  providerId,
  projectTitle,
  projectId,
  providerName,
  pointsBudget: initialPoints,
  isEditMode = false, // جديد: هل نحن في وضع التعديل؟
  editData = null, // جديد: بيانات الطلب للتعديل
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

  // Update fields when modal opens or editData changes
  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        // نحن في وضع التعديل، املأ الفورم بالبيانات الموجودة
        console.log("📝 Edit Data received:", editData);

        setServiceTitle(editData.title || "");
        setServiceDescription(editData.description || "");
        setPointsBudget(editData.pointsOffered || "");

        // تحويل التاريخ إلى فورمات YYYY-MM-DD
        if (editData.deadline) {
          // إذا كان التاريخ بالفورمات "MM/DD/YYYY" (من toLocaleDateString)
          let formattedDate;
          if (editData.deadline.includes('/')) {
            const parts = editData.deadline.split('/');
            // MM/DD/YYYY -> YYYY-MM-DD
            const month = parts[0].padStart(2, '0');
            const day = parts[1].padStart(2, '0');
            const year = parts[2];
            formattedDate = `${year}-${month}-${day}`;
          } else {
            // إذا كان بفورمات ISO أو أي فورمات آخر
            const date = new Date(editData.deadline);
            formattedDate = date.toISOString().split('T')[0];
          }
          console.log("📅 Formatted date:", formattedDate);
          setDeadline(formattedDate);
        }

        // استخرج الـ category من الـ type أو category
        // القيمة تكون "RequestProject" أو "RequestCourse" ونحتاج فقط "Project" أو "Course"
        let categoryValue = "";

        // جرب من editData.category أولاً
        if (editData.category) {
          categoryValue = editData.category.replace("Request", "");
          console.log("✅ Category from editData.category:", categoryValue);
        }
        // إذا ما لقيناها، جرب من editData.type
        else if (editData.type) {
          categoryValue = editData.type.replace("Request", "");
          console.log("✅ Category extracted from type:", categoryValue);
        }

        console.log("🎯 Final category value:", categoryValue);
        setServiceCategory(categoryValue);
      } else {
        // وضع إنشاء طلب جديد
        if (projectTitle) setServiceTitle(projectTitle);
        if (initialPoints) setPointsBudget(initialPoints);
      }
    }
  }, [open, projectTitle, initialPoints, isEditMode, editData]);

  // Handle Submit (Create or Edit)
  const handleSubmit = async () => {
    // التحقق من وجود providerId في حالة الإنشاء
    if (!isEditMode && !providerId) {
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
        type: serviceCategory === "Project" ? "RequestProject" : "RequestCourse",
      };

      // في حالة الإنشاء، أضف providerId
      if (!isEditMode) {
        requestData.providerId = providerId;
      }

      // 🔍 اطبع البيانات قبل الإرسال
      console.log(isEditMode ? "Editing request data:" : "Creating request data:", requestData);
      if (!isEditMode) {
        console.log("Provider ID:", providerId);
      }

      if (!token) {
        setSnackbar({
          open: true,
          message: "You need to login first!",
          severity: "error",
        });
        setIsSubmitting(false);
        return;
      }

      let response;
      if (isEditMode) {
        // تعديل طلب موجود
        response = await editCollaborationRequest(token, editData.id, requestData);
        console.log("✅ Request edited successfully:", response);
      } else {
        // إنشاء طلب جديد
        response = await createCollaborationRequest(token, requestData);
        console.log("✅ Request created successfully:", response);
      }

      // عرض رسالة نجاح
      setSnackbar({
        open: true,
        message: isEditMode ? "Request updated successfully! 🎉" : "Request sent successfully!",
        severity: "success",
      });

      // انتظر شوي قبل ما نسكر المودال عشان المستخدم يشوف الرسالة
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error(isEditMode ? "❌ Error editing request:" : "❌ Error creating request:", error);

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
        `Failed to ${isEditMode ? "update" : "send"} request. Please try again.`;

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });

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
            {isEditMode ? (
              <EditIcon sx={{ color: "#3b82f6" }} />
            ) : (
              <DescriptionIcon sx={{ color: "#3b82f6" }} />
            )}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {isEditMode ? "Edit Request" : "Request Service"}
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
                {isEditMode
                  ? `Editing request sent to ${providerName}`
                  : `You're sending a request to ${providerName}`
                }
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
              startIcon={isEditMode ? <EditIcon /> : <SendIcon />}
              disabled={isSubmitting}
              sx={{ minWidth: "150px" }}
            >
              {isSubmitting
                ? (isEditMode ? "Updating..." : "Sending...")
                : (isEditMode ? "Update Request" : "Send Request")
              }
            </CustomButton>
          ) : (
            <DisabledCustomButton
              startIcon={isEditMode ? <EditIcon /> : <SendIcon />}
              sx={{ minWidth: "150px" }}
            >
              {isEditMode ? "Update Request" : "Send Request"}
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
};

export default RequestServiceModal;