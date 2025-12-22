

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
import { getToken } from "../../utils/authHelpers";

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
const token = getToken();
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