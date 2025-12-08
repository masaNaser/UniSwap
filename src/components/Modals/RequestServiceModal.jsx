import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  // Checkbox, // Checkbox/FormControlLabel غير مستخدمة بالشكل المعتاد هنا
  // FormControlLabel, // في هذا المثال، تم استخدام عنصر input عادي بدلاً منها
  // ⬇️ الإضافات المطلوبة للـ Dialog
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, // تم استيراد Button هنا
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import GenericModal from "../Modals/GenericModal";
import {
  createCollaborationRequest,
  editCollaborationRequest,
} from "../../services/collaborationService";
import { useCurrentUser } from "../../Context/CurrentUserContext"; // ✅ أضيفي هاد

const RequestServiceModal = ({
  open,
  onClose,
  providerId,
  projectTitle,
  projectId,
  providerName,
  pointsBudget: initialPoints,
  isEditMode = false,
  editData = null,
}) => {

  const { updateCurrentUser } = useCurrentUser(); // ✅ أضيفي هاد

  const [serviceTitle, setServiceTitle] = useState(projectTitle || "");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [pointsBudget, setPointsBudget] = useState(initialPoints || "");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [clientAcceptPublished, setClientAcceptPublished] = useState(false);

  // ⬅️ حالة جديدة لإدارة Dialog التأكيد
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isDeadlineRequired = serviceCategory === "Project";

  const isRequestFormValid =
    serviceTitle.trim() !== "" &&
    serviceDescription.trim() !== "" &&
    serviceCategory !== "" &&
    pointsBudget !== "" &&
    (!isDeadlineRequired || deadline !== "");

  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        console.log("📝 Edit Data received:", editData);

        setServiceTitle(editData.title || "");
        setServiceDescription(editData.description || "");
        setPointsBudget(editData.pointsOffered || "");
        setClientAcceptPublished(editData.clientAcceptPublished || false);

        if (editData.deadline) {
          const date = new Date(editData.deadline);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          setDeadline(`${year}-${month}-${day}`);
        }

        let categoryValue = "";
        if (editData.category) {
          categoryValue = editData.category.replace("Request", "");
          console.log("🏷️ Category from editData.category:", categoryValue);
        } else if (editData.type) {
          categoryValue = editData.type.replace("Request", "");
          console.log("🏷️ Category extracted from type:", categoryValue);
        }

        console.log("🏷️ Final category value:", categoryValue);
        setServiceCategory(categoryValue);
      } else {
        // ⬅️ تهيئة الـ State عند الفتح لأول مرة (وضع الإنشاء)
        setServiceTitle(projectTitle || "");
        setServiceDescription("");
        setServiceCategory("");
        setPointsBudget(initialPoints || "");
        setDeadline("");
        setClientAcceptPublished(false); // تأكد من إعادة تعيين هذا
      }
    }
  }, [open, projectTitle, initialPoints, isEditMode, editData]);

  // ⬅️ دالة جديدة لفتح الـ Dialog قبل الإرسال
  const handlePreSubmit = () => {
    // نفتح الـ Dialog فقط في وضع الإنشاء (Create) لطلب خدمة جديدة
    if (!isEditMode) {
      setIsConfirmDialogOpen(true);
    } else {
      // في وضع التعديل (Edit)، لا نحتاج لتجميد النقاط، لذا نرسل مباشرة
      handleSubmit();
    }
  };

  // ⬅️ وظيفة الإرسال الفعلي (تمت إعادة تسميتها)
  const handleSubmit = async () => {
    if (isConfirmDialogOpen) {
      setIsConfirmDialogOpen(false);
    }

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

      const requestData = {
        title: serviceTitle,
        description: serviceDescription,
        pointsOffered: parseInt(pointsBudget),
      };

      // ✅ في وضع الإنشاء (Create)
      if (!isEditMode) {
        requestData.type = serviceCategory === "Project" ? "RequestProject" : "Course";
        requestData.providerId = providerId;

        // أضف deadline بس للـ Project
        if (serviceCategory === "Project") {
          requestData.deadline = deadline;
          requestData.clientAcceptPublished = clientAcceptPublished;
        }
      }
      // ✅ في وضع التعديل (Edit)
      else {
        if (serviceCategory === "Project" && deadline) {
          let originalDeadline = null;

          if (editData.deadline) {
            try {
              const date = new Date(editData.deadline);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              originalDeadline = `${year}-${month}-${day}`;
            } catch {
              originalDeadline = "";
            }
          }

          // بس نضيف deadline إذا تغير
          if (deadline !== originalDeadline) {
            requestData.deadline = deadline;
          }
        }

        // أضف clientAcceptPublished بس للـ Project
        if (serviceCategory === "Project") {
          requestData.clientAcceptPublished = clientAcceptPublished;
        }
      }

      console.log(
        isEditMode ? "✏️ Editing request data:" : "➕ Creating request data:",
        requestData
      );

      // ✅ التحقق من الـ token
      if (!token) {
        setSnackbar({
          open: true,
          message: "You need to login first!",
          severity: "error",
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ استدعاء الـ API
      let response;
      if (isEditMode) {
        response = await editCollaborationRequest(
          token,
          editData.id,
          requestData
        );
        console.log("✅ Request edited successfully:", response);
      } else {
        response = await createCollaborationRequest(token, requestData);
        console.log("✅ Request created successfully:", response);
      }

   // ✅ عرض رسالة النجاح
      setSnackbar({
        open: true,
        message: isEditMode
          ? "Request updated successfully!"
          : "Request sent successfully!",
        severity: "success",
      });

      // 🔥 حدّث النقاط في الـ Navbar
      await updateCurrentUser();
      console.log("✅ Points updated in Navbar!");

      // ✅ إغلاق الـ Modal بعد 1.5 ثانية
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      console.error(
        isEditMode ? "❌ Error editing request:" : "❌ Error creating request:",
        error
      );

      if (error.response) {
        console.error("📛 Server Error Response:", error.response.data);
        console.error("📛 Status Code:", error.response.status);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.response?.data ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "send"
        } request. Please try again.`;

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });

      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // ⬅️ أغلق الـ Dialog عند إغلاق الـ Modal
    setIsConfirmDialogOpen(false);
    setServiceTitle(projectTitle || "");
    setServiceDescription("");
    setServiceCategory("");
    setPointsBudget(initialPoints || "");
    setDeadline("");
    setIsSubmitting(false);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const headerInfo = providerName && (
    <Typography variant="body1" sx={{ fontWeight: 500, color: "#1e40af" }}>
      {isEditMode
        ? `Editing request sent to ${providerName}`
        : `You're sending a request to ${providerName}`}
    </Typography>
  );

  return (
    <>
      <GenericModal
        open={open}
        onClose={handleClose}
        title={isEditMode ? "Edit Request" : "Request Service"}
        icon={
          isEditMode ? (
            <EditIcon sx={{ color: "#3b82f6" }} />
          ) : (
            <DescriptionIcon sx={{ color: "#3b82f6" }} />
          )
        }
        headerInfo={headerInfo}
        primaryButtonText={isEditMode ? "Update Request" : "Send Request"}
        primaryButtonIcon={isEditMode ? <EditIcon /> : <SendIcon />}
        onPrimaryAction={handlePreSubmit} // ⬅️ تعديل: استدعاء دالة الفحص المسبق
        isPrimaryDisabled={!isRequestFormValid || isSubmitting}
        isSubmitting={isSubmitting}
        snackbar={snackbar}
        onSnackbarClose={handleSnackbarClose}
      >
        {/* Service Title */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
          >
            Service Title
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
            Description
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
              Request Type
            </Typography>
            <FormControl fullWidth>
              <Select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                displayEmpty
                disabled={isSubmitting || isEditMode}
                sx={{
                  borderRadius: "8px",
                  height: "46px",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                  },
                  ...(isEditMode && {
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed",
                  }),
                }}
              >
                <MenuItem value="" disabled>
                  Select Request Type
                </MenuItem>
                <MenuItem value="Project">Project</MenuItem>
                <MenuItem value="Course">Course</MenuItem>
              </Select>
              {isEditMode && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "11px",
                    mt: 0.5,
                    display: "block",
                  }}
                >
                  Request type cannot be changed after creation
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
            >
              Points Budget
            </Typography>
         <TextField
  fullWidth
  type="number"
  placeholder="e.g., 150"
  value={pointsBudget}
  onChange={(e) => {
    const value = e.target.value;
    // ✅ امنع إدخال صفر أو أرقام سالبة
    if (value === "" || parseInt(value) > 0) {
      setPointsBudget(value);
    }
  }}
  disabled={isSubmitting}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: "#3B82F6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255, 255, 255, 1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6"></circle>
            <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
            <path d="M7 6h1v4"></path>
            <path d="m16.71 13.88.7.71-2.82 2.82"></path>
          </svg>
        </Box>
      </InputAdornment>
    ),
    inputProps: {
      min: 1, // ✅ الحد الأدنى = 1
    },
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "46px",
    },
    // ✅ إخفاء الأسهم (spinner arrows)
    "& input[type=number]": {
      MozAppearance: "textfield", // Firefox
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none", // Chrome, Safari, Edge
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none", // Chrome, Safari, Edge
      margin: 0,
    },
  }}
/>
          </Grid>
        </Grid>

        {/* Deadline - يظهر فقط للـ Project */}
        {serviceCategory === "Project" && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="body2"
              sx={{ mb: 0.7, fontWeight: "medium", color: "text.primary" }}
            >
              Deadline
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={isSubmitting}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
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
          </Box>
        )}

        {/* Checkbox للـ Published - يظهر فقط للـ Project */}
        {serviceCategory === "Project" && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="checkbox"
              checked={clientAcceptPublished}
              onChange={(e) => setClientAcceptPublished(e.target.checked)}
              disabled={isSubmitting}
            />
            <Typography
              variant="span"
              sx={{ fontWeight: "medium", color: "text.primary" }}
            >
              Do you agree to allow this project to be published on the Browse
              page?
            </Typography>
          </Box>
        )}
      </GenericModal>

      {/*  الـ Dialog الخاص بتأكيد تجميد النقاط - يظهر فقط في وضع الإنشاء (Create) */}
      {!isEditMode && (
        <Dialog
          open={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: "16px", p: 1 },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
            Confirm Project Request
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>
              Your points will be temporarily frozen and transferred to{" "}
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {providerName}
              </Typography>{" "}
              once the collaboration is completed. Do you agree?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isSubmitting}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit} // ⬅️ استدعاء دالة الإرسال الفعلية بعد التأكيد
              variant="contained"
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
                background: "linear-gradient(to right, #00C8FF, #8B5FF6)",
                "&:hover": {
                  background: "linear-gradient(to right, #8B5FF6, #00C8FF)",
                },
              }}
            >
              {isSubmitting ? "Processing..." : "I Agree"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default RequestServiceModal;