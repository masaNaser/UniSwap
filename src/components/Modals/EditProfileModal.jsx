import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CustomButton from "../CustomButton/CustomButton";
import { EditProfile } from "../../services/profileService";
import { getImageUrl } from "../../components/utils/imageHelper";  // ⬅️ أضف هاد السطر

const EditProfileModal = ({ open, onClose, userData, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    userName: "",
    bio: "",
    universityMajor: "",
    academicYear: "",
    socialLinks: "",
    skills: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        userName: userData.userName || "",
        bio: userData.bio || "",
        universityMajor: userData.universityMajor || "",
        academicYear: userData.academicYear || "",
        socialLinks: userData.socialLinks?.join(", ") || "",
        skills: userData.skills?.join(", ") || "",
      });
          // ⬅️ استخدم getImageUrl للصور الموجودة من السيرفر
      setProfilePreview(getImageUrl(userData.profilePicture));
      setCoverPreview(getImageUrl(userData.coverImg));
   
    }
  }, [userData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPicture(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login first!",
        severity: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();

      // إضافة الحقول النصية
      if (formData.userName?.trim()) {
        formDataToSend.append("UserName", formData.userName.trim());
      }
      
      if (formData.bio?.trim()) {
        formDataToSend.append("Bio", formData.bio.trim());
      }
      
      if (formData.universityMajor?.trim()) {
        formDataToSend.append("UniversityMajor", formData.universityMajor.trim());
      }
      
      // تحويل AcademicYear لـ number
      if (formData.academicYear) {
        const yearNumber = parseInt(formData.academicYear);
        if (!isNaN(yearNumber)) {
          formDataToSend.append("AcademicYear", yearNumber.toString());
        }
      }

      // معالجة Skills
      const skillsArray = formData.skills
        ?.split(",")
        .map(s => s.trim())
        .filter(Boolean);
      
      if (skillsArray?.length > 0) {
        skillsArray.forEach(skill => {
          formDataToSend.append("Skills", skill);
        });
      }

      // معالجة Social Links
      const linksArray = formData.socialLinks
        ?.split(",")
        .map(l => l.trim())
        .filter(Boolean);
      
      if (linksArray?.length > 0) {
        linksArray.forEach(link => {
          formDataToSend.append("SocialLinks", link);
        });
      }

      // إضافة الصور
      if (profilePicture) {
        formDataToSend.append("ProfilePicture", profilePicture);
      }
      
      if (coverPicture) {
        formDataToSend.append("CoverImg", coverPicture);
      }

      console.log("=== FormData Contents ===");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // // إرسال التعديل
      const response = await EditProfile(token,formDataToSend);
      console.log("📥 Full Response:", response);
      console.log("📊 Response Status:", response.status);
      console.log("📄 Response Data:", response.data);
      
      console.log("✅ Profile edit request sent successfully");
 // ⬅️ هون المهم: نعمل callback للـ parent عشان يحدث البيانات
    if (onProfileUpdated) {
      onProfileUpdated(); // ⬅️ نخبر الـ parent يحدث البيانات
    }
      // إخفاء الـ modal فوراً
      onClose();

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      // ⭐ نعمل refresh بعد ثانية
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error details:", error.response?.data);
      
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to update profile";

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon sx={{ color: "#3b82f6" }} />
            <Typography variant="h6" fontWeight="bold">
              Edit Profile
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Cover Picture */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            {coverPreview && (
              <Box
                sx={{
                  width: "100%",
                  height: 150,
                  backgroundImage: `url(${coverPreview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 2,
                  mb: 1,
                }}
              />
            )}
            <CustomButton component="label">
              Change Cover Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleCoverPictureChange}
              />
            </CustomButton>
          </Box>

          {/* Profile Picture */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Avatar
              src={profilePreview}
              sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
            />
            <CustomButton component="label">
              Change Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </CustomButton>
          </Box>

          {/* Text Fields */}
          <TextField
            fullWidth
            label="Username"
            value={formData.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Bio"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="University Major"
            value={formData.universityMajor}
            onChange={(e) => handleChange("universityMajor", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            // select
            label="Academic Year"
            value={formData.academicYear}
            onChange={(e) => handleChange("academicYear", e.target.value)}
            sx={{ mb: 2 }}
          >
            {/* <MenuItem value="">Select Year</MenuItem>
            <MenuItem value="1">First Year</MenuItem>
            <MenuItem value="2">Second Year</MenuItem>
            <MenuItem value="3">Third Year</MenuItem>
            <MenuItem value="4">Fourth Year</MenuItem>
            <MenuItem value="5">Fifth Year</MenuItem> */}
          </TextField>

          <TextField
            fullWidth
            label="Skills (comma separated)"
            placeholder="e.g., React, Node.js, Python"
            value={formData.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Social Links (comma separated)"
            placeholder="https://github.com/..., https://linkedin.com/..."
            value={formData.socialLinks}
            onChange={(e) => handleChange("socialLinks", e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <CustomButton variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </CustomButton>
        </DialogActions>
      </Dialog>

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
};

export default EditProfileModal;