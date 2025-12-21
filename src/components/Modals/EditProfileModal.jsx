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
import {
  Box,
  TextField,
  Avatar,
  IconButton,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import ElectricBoltSharp from "@mui/icons-material/ElectricBoltSharp";
import GenericModal from "./GenericModal";
import { EditProfile } from "../../services/profileService";
import { getImageUrl } from "../../utils/imageHelper";

const EditProfileModal = ({ open, onClose, userData, onProfileUpdated }) => {

  const academicYearOptions = [
    { value: 0, label: "First Year" },
    { value: 1, label: "Second Year" },
    { value: 2, label: "Third Year" },
    { value: 3, label: "Fourth Year" },
    { value: 4, label: "Other" },
  ];

  const [formData, setFormData] = useState({
    userName: "",
    Bio: "",
    UniversityMajor: "",
    AcademicYear: "",
    SocialLinks: "",
    ProfilePicture: null,
    CoverImg: null,
  });

  const [preview, setPreview] = useState({
    ProfilePicture: "",
    CoverImg: "",
  });

  // Skills state for Autocomplete
  const [skills, setSkills] = useState([]);
  const [skillInputValue, setSkillInputValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  // Initialize data when modal opens
  useEffect(() => {
    if (userData && open) {
      console.log("📥 Loading userData into form:", userData);

      const yearMap = {
        "Firstyear": 0,
        "Secondyear": 1,
        "Thirdyear": 2,
        "Fourthyear": 3,
        "another": 4
      };

      setFormData({
        userName: userData.userName || "",
        Bio: userData.bio || "",
        UniversityMajor: userData.universityMajor || "",
        AcademicYear: yearMap[userData.academicYear] ?? "",
        SocialLinks: userData.socialLinks || "",
        ProfilePicture: null,
        CoverImg: null,
      });

      setPreview({
        ProfilePicture: getImageUrl(userData.profilePicture, userData.userName),
        CoverImg: getImageUrl(userData.coverImg, userData.userName),
      });

      // Initialize skills array
      if (userData.skills) {
        const skillsArray = Array.isArray(userData.skills)
          ? userData.skills
          : typeof userData.skills === "string"
            ? userData.skills.split(",").map(s => s.trim()).filter(Boolean)
            : [];
        setSkills(skillsArray);
      } else {
        setSkills([]);
      }
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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("❌ No token found!");
      setSnackbar({
        open: true,
        message: "Please login again!",
        severity: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();

      // Text fields
      if (formData.userName?.trim()) form.append("UserName", formData.userName.trim());
      if (formData.Bio?.trim()) form.append("Bio", formData.Bio.trim());
      if (formData.UniversityMajor?.trim()) form.append("UniversityMajor", formData.UniversityMajor.trim());
      if (formData.AcademicYear !== "" && formData.AcademicYear !== null) {
        form.append("AcademicYear", formData.AcademicYear.toString());
      }

      // Skills → from skills array
      skills.forEach(skill => form.append("Skills", skill));

      // SocialLinks
      if (formData.SocialLinks) {
        let linksArray = [];

        if (Array.isArray(formData.SocialLinks)) {
          linksArray = formData.SocialLinks;
        } else if (typeof formData.SocialLinks === "string") {
          linksArray = formData.SocialLinks.split(",").map(l => l.trim()).filter(Boolean);
        }

        linksArray.forEach(link => form.append("SocialLinks", link));
      }

      // Images
      if (formData.ProfilePicture) form.append("ProfilePicture", formData.ProfilePicture);
      if (formData.CoverImg) form.append("CoverImg", formData.CoverImg);

      // Send to server
      await EditProfile(token, form);
      console.log("✅ Profile updated on server");

      // Fetch updated data
      if (onProfileUpdated) await onProfileUpdated();

      // Show success message
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });

      // Close modal after 1 second
      setTimeout(() => onClose(), 1000);

    } catch (err) {
      console.error("❌ Profile update error:", err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Something went wrong!", severity: "error" });
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
        {/* Profile Picture */}
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

        {/* Cover Image */}
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

        {/* Text Fields */}
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

        <FormControl fullWidth>
          <InputLabel id="academic-year-label">Academic Year</InputLabel>
          <Select
            labelId="academic-year-label"
            name="AcademicYear"
            value={formData.AcademicYear}
            onChange={handleChange}
            label="Academic Year"
            startAdornment={
              <InputAdornment position="start">
                <CalendarMonth />
              </InputAdornment>
            }
          >
            {academicYearOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Social Links (Comma separated)"
          name="SocialLinks"
          value={formData.SocialLinks}
          onChange={handleChange}
          fullWidth
        />

        {/* Skills with Autocomplete */}
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={skills}
          inputValue={skillInputValue}
          onInputChange={(event, newInputValue) => {
            setSkillInputValue(newInputValue);
          }}
          onChange={(event, newValue) => {
            setSkills(newValue);
            setSkillInputValue("");
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  variant="outlined"
                  label={option}
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Skills"
              placeholder={skills.length === 0 ? "Type a skill and press Enter" : ""}
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <ElectricBoltSharp />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
    </GenericModal>
  );
};

export default EditProfileModal;