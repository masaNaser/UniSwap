// import React, { useState, useEffect } from "react";
// import { Typography, Box, TextField, Avatar } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import GenericModal from "../Modals/GenericModal";
// import CustomButton from "../CustomButton/CustomButton";
// import { EditProfile } from "../../services/profileService";
// import { getImageUrl } from "../../utils/imageHelper";

// const EditProfileModal = ({ open, onClose, userData, onProfileUpdated }) => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     bio: "",
//     universityMajor: "",
//     academicYear: "",
//     socialLinks: "",
//     skills: "",
//   });

//   const [profilePicture, setProfilePicture] = useState(null);
//   const [coverPicture, setCoverPicture] = useState(null);
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     if (userData && open) {
//       setFormData({
//         userName: userData.userName || "",
//         bio: userData.bio || "",
//         universityMajor: userData.universityMajor || "",
//         academicYear: userData.academicYear || "",
//         socialLinks: userData.socialLinks?.join(", ") || "",
//         skills: userData.skills?.join(", ") || "",
//       });
//       // فقط نحدث الصور لو ما في preview جديد (يعني المستخدم ما غيرهم)
//       if (!profilePicture) {
//         setProfilePreview(getImageUrl(userData.profilePicture));
//       }
//       if (!coverPicture) {
//         setCoverPreview(getImageUrl(userData.coverImg));
//       }
//     }
//   }, [userData, open]);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleProfilePictureChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfilePicture(file);
//       setProfilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleCoverPictureChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCoverPicture(file);
//       setCoverPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       setSnackbar({
//         open: true,
//         message: "Please login first!",
//         severity: "error",
//       });
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const formDataToSend = new FormData();

//       if (formData.userName?.trim()) {
//         formDataToSend.append("UserName", formData.userName.trim());
//       }

//       if (formData.bio?.trim()) {
//         formDataToSend.append("Bio", formData.bio.trim());
//       }

//       if (formData.universityMajor?.trim()) {
//         formDataToSend.append(
//           "UniversityMajor",
//           formData.universityMajor.trim()
//         );
//       }

//       if (formData.academicYear) {
//         const yearNumber = parseInt(formData.academicYear);
//         if (!isNaN(yearNumber)) {
//           formDataToSend.append("AcademicYear", yearNumber.toString());
//         }
//       }

//       const skillsArray = formData.skills
//         ?.split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       if (skillsArray?.length > 0) {
//         skillsArray.forEach((skill) => {
//           formDataToSend.append("Skills", skill);
//         });
//       }

//       const linksArray = formData.socialLinks
//         ?.split(",")
//         .map((l) => l.trim())
//         .filter(Boolean);

//       if (linksArray?.length > 0) {
//         linksArray.forEach((link) => {
//           formDataToSend.append("SocialLinks", link);
//         });
//       }

//       if (profilePicture) {
//         formDataToSend.append("ProfilePicture", profilePicture);
//       }

//       if (coverPicture) {
//         formDataToSend.append("CoverImg", coverPicture);
//       }

//       console.log("=== FormData Contents ===");
//       for (let pair of formDataToSend.entries()) {
//         console.log(pair[0] + ": " + pair[1]);
//       }

//       const response = await EditProfile(token, formDataToSend);
//       console.log("✅ Profile edit request sent successfully");

//       // أغلق المودال أولاً
//       onClose();

//       // أظهر رسالة النجاح
//       setSnackbar({
//         open: true,
//         message: "Profile updated successfully!",
//         severity: "success",
//       });

//       // انتظر شوية عشان الصور تتحمل على السيرفر، بعدين حدث البيانات
//       setTimeout(() => {
//         if (onProfileUpdated) {
//           onProfileUpdated();
//         }
//         // نظف الـ states
//         setProfilePicture(null);
//         setCoverPicture(null);
//       }, 800);
//     } catch (error) {
//       console.error("Error updating profile:", error);

//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.title ||
//         error.message ||
//         "Failed to update profile";

//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: "error",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   // دالة لإعادة تعيين المودال عند الإغلاق
//   const handleModalClose = () => {
//     // نظف الصور المؤقتة
//     // setProfilePicture(null);
//     // setCoverPicture(null);
//     onClose();
//   };

//   const isFormValid = formData.userName?.trim() !== "";

//   return (
//     <GenericModal
//       open={open}
//       onClose={handleModalClose}
//       title="Edit Profile"
//       icon={<EditIcon sx={{ color: "#3b82f6" }} />}
//       primaryButtonText="Save Changes"
//       primaryButtonIcon={<EditIcon />}
//       onPrimaryAction={handleSubmit}
//       isPrimaryDisabled={!isFormValid}
//       isSubmitting={isSubmitting}
//       snackbar={snackbar}
//       onSnackbarClose={handleSnackbarClose}
//     >
//       {/* Cover Picture */}
//       <Box sx={{ mb: 3, textAlign: "center" }}>
//         {coverPreview && (
//           <Box
//             sx={{
//               width: "100%",
//               height: 150,
//               backgroundImage: `url(${coverPreview})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               borderRadius: 2,
//               mb: 1,
//             }}
//           />
//         )}
//         <CustomButton component="label">
//           Change Cover Picture
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={handleCoverPictureChange}
//           />
//         </CustomButton>
//       </Box>

//       {/* Profile Picture */}
//       <Box sx={{ mb: 2, textAlign: "center" }}>
//         <Avatar
//           src={profilePreview}
//           sx={{ width: 100, height: 100, mx: "auto", mb: 1 }}
//         />
//         <CustomButton
//           type="submit"
//           component="label"
//           fullWidth
//           sx={{
//             mt: 2,
//             py: 1.5,
//             fontSize: 16,
//           }}
//         >
//           Change Profile Picture
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={handleProfilePictureChange}
//           />
//         </CustomButton>
//       </Box>

//       {/* Text Fields */}
//       <TextField
//         fullWidth
//         label="Username"
//         value={formData.userName}
//         onChange={(e) => handleChange("userName", e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <TextField
//         fullWidth
//         multiline
//         rows={3}
//         label="Bio"
//         value={formData.bio}
//         onChange={(e) => handleChange("bio", e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <TextField
//         fullWidth
//         label="University Major"
//         value={formData.universityMajor}
//         onChange={(e) => handleChange("universityMajor", e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <TextField
//         fullWidth
//         label="Academic Year"
//         value={formData.academicYear}
//         onChange={(e) => handleChange("academicYear", e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <TextField
//         fullWidth
//         label="Skills (comma separated)"
//         placeholder="e.g., React, Node.js, Python"
//         value={formData.skills}
//         onChange={(e) => handleChange("skills", e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <TextField
//         fullWidth
//         label="Social Links (comma separated)"
//         placeholder="https://github.com/..., https://linkedin.com/..."
//         value={formData.socialLinks}
//         onChange={(e) => handleChange("socialLinks", e.target.value)}
//       />
//     </GenericModal>
//   );
// };

// export default EditProfileModal;

import React, { useState, useEffect } from "react";
import { Box, TextField, Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import GenericModal from "./GenericModal";
import { EditProfile } from "../../services/profileService";
import { getImageUrl } from "../../utils/imageHelper";

const EditProfileModal = ({ open, onClose, userData, onProfileUpdated }) => {
  const token = localStorage.getItem("accessToken");
  
  const [formData, setFormData] = useState({
    userName: "",
    Bio: "",
    UniversityMajor: "",
    AcademicYear: "",
    SocialLinks: "",
    Skills: "",
    ProfilePicture: null,
    CoverImg: null,
  });

  const [preview, setPreview] = useState({
    ProfilePicture: "",
    CoverImg: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  // تحميل الداتا لأول مرة
  useEffect(() => {
    if (userData && open) {
      console.log("📥 Loading userData into form:", userData);
      
      setFormData({
        userName: userData.userName || "",
        Bio: userData.bio || "",
        UniversityMajor: userData.universityMajor || "",
        AcademicYear: userData.academicYear || "",
        SocialLinks: userData.socialLinks || "",
        Skills: userData.skills || "",
        ProfilePicture: null,
        CoverImg: null,
      });

      setPreview({
        ProfilePicture: getImageUrl(userData.profilePicture, userData.userName),
        CoverImg: getImageUrl(userData.coverImg, userData.userName),
      });
    }
  }, [userData, open]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((p) => ({ ...p, [type]: file }));
    setPreview((p) => ({ ...p, [type]: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("userName", formData.userName);
      form.append("Bio", formData.Bio);
      form.append("UniversityMajor", formData.UniversityMajor);
      form.append("AcademicYear", formData.AcademicYear);
      form.append("SocialLinks", formData.SocialLinks);
      form.append("Skills", formData.Skills);

      if (formData.ProfilePicture) {
        form.append("ProfilePicture", formData.ProfilePicture);
      }

      if (formData.CoverImg) {
        form.append("CoverImg", formData.CoverImg);
      }

      console.log("📤 Sending profile update...");
      await EditProfile(token, form);
      console.log("✅ Profile updated on server");

      // ⬇️ الآن اجلب البيانات الجديدة (التأخير موجود في ProfileHeader)
      const updatedData = await onProfileUpdated();
      console.log("✅ Fresh data received:", updatedData);

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      // أغلق المودال بعد ثانية واحدة
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err) {
      console.error("❌ Profile update error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Something went wrong!",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title="Edit Profile"
      primaryButtonText="Save"
      onPrimaryAction={handleSubmit}
      isSubmitting={isSubmitting}
      snackbar={snackbar}
      onSnackbarClose={() => setSnackbar(null)}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        {/* صورة البروفايل */}
        <Box textAlign="center">
          <Avatar
            src={preview.ProfilePicture}
            sx={{ width: 90, height: 90, margin: "auto" }}
          />
          <IconButton component="label">
            <PhotoCameraIcon />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageChange(e, "ProfilePicture")}
            />
          </IconButton>
        </Box>

        {/* الغلاف */}
        <Box textAlign="center">
          <img
            src={preview.CoverImg}
            alt="cover"
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <IconButton component="label">
            <PhotoCameraIcon />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageChange(e, "CoverImg")}
            />
          </IconButton>
        </Box>

        {/* الحقول النصية */}
        <TextField
          label="Username"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Bio"
          name="Bio"
          value={formData.Bio}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />

        <TextField
          label="Major"
          name="UniversityMajor"
          value={formData.UniversityMajor}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Academic Year"
          name="AcademicYear"
          value={formData.AcademicYear}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Social Links (Comma separated)"
          name="SocialLinks"
          value={formData.SocialLinks}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Skills (Comma separated)"
          name="Skills"
          value={formData.Skills}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </GenericModal>
  );
};

export default EditProfileModal;