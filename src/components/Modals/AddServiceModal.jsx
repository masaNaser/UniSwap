import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Stack,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GenericModal from "../../components/Modals/GenericModal";
import { CreateServices, EditServices } from "../../services/servicesService";
import { getServices } from "../../services/servicesService";
import { getSubServices } from "../../services/subServiceServices";

export default function AddServiceModal({ open, handleClose, onAdded, editingService }) {
  const token = localStorage.getItem("accessToken");

  const [allServices, setAllServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    subServiceId: "",
    name: "",
    description: "",
    avgPoints: "",
    avgDurationDays: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  // تحميل الخدمات الرئيسية
  useEffect(() => {
    if (!open) return;
    const fetchAllServices = async () => {
      try {
        const res = await getServices();
        setAllServices(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllServices();
  }, [open, token]);

  // تحميل الخدمات الفرعية
  useEffect(() => {
    if (!formData.serviceId) {
      setSubServices([]);
      setFormData((prev) => ({ ...prev, subServiceId: "" }));
      return;
    }
    const fetchSubServices = async () => {
      setLoadingSub(true);
      try {
        const res = await getSubServices(token, formData.serviceId);
        setSubServices(res.data || []);
        if (!editingService) setFormData((prev) => ({ ...prev, subServiceId: "" }));
      } catch (err) {
        console.error(err);
      }
      setLoadingSub(false);
    };
    fetchSubServices();
  }, [formData.serviceId, editingService, token]);

  // ملء الفورم عند تعديل الخدمة
  useEffect(() => {
    if (editingService) {
      setFormData({
        serviceId: editingService.serviceId,
        subServiceId: editingService.subServiceId,
        name: editingService.name,
        description: editingService.description,
        avgPoints: editingService.avgPoints,
        avgDurationDays: editingService.avgDurationDays,
        Image: null,
      });
      setImagePreview(editingService.Image || null);
    } else {
      setFormData({
        serviceId: "",
        subServiceId: "",
        name: "",
        description: "",
        avgPoints: "",
        avgDurationDays: "",
        Image: null,
      });
      setImagePreview(null);
    }
  }, [editingService, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData({ ...formData, image: file });

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  } else {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  }
};


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("Name", formData.name);
      fd.append("Description", formData.description);
      fd.append("AvgPoints", formData.avgPoints);
      fd.append("AvgDurationDays", formData.avgDurationDays);
      fd.append("ServiceId", formData.serviceId);
      fd.append("SubServiceId", formData.subServiceId);
      fd.append("Image", formData.Image); // لازم تكون موجودة!
       
      if (!formData.Image) {
  console.log("No image selected!");
}

      if (editingService) {
        await EditServices(token, editingService.id, fd);
        setSnackbar({ open: true, message: "Service updated successfully!", severity: "success" });
      } else {
        await CreateServices(token, fd);
        setSnackbar({ open: true, message: "Service added successfully!", severity: "success" });
      }
      onAdded();
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Operation failed.", severity: "error" });
    }
    setLoading(false);
  };

  return (
    <GenericModal
      open={open}
      onClose={handleClose}
      title={editingService ? "Edit Service" : "Add New Service"}
      icon={<AddIcon color="primary" />}
      onPrimaryAction={handleSubmit}
      primaryButtonText={editingService ? "Update" : "Add"}
      primaryButtonIcon={<AddIcon />}
      isSubmitting={loading}
      snackbar={snackbar}
      onSnackbarClose={() => setSnackbar(null)}
    >
      <Stack spacing={2} mt={1}>
        {/* الخدمة الرئيسية */}
        <TextField
          select
          label="Choose Main Service"
          name="serviceId"
          value={formData.serviceId || ""}
          onChange={handleChange}
          fullWidth
        >
          {allServices.map((service) => (
            <MenuItem key={service.id} value={service.id}>
              {service.name}
            </MenuItem>
          ))}
        </TextField>

        {/* الخدمة الفرعية */}
        <TextField
          select
          label="Choose Sub Service"
          name="subServiceId"
          value={formData.subServiceId || ""}
          onChange={handleChange}
          fullWidth
          disabled={!formData.serviceId || loadingSub}
        >
          {loadingSub && <MenuItem>Loading...</MenuItem>}
          {subServices.map((sub) => (
            <MenuItem key={sub.id} value={sub.id}>
              {sub.name}
            </MenuItem>
          ))}
        </TextField>

        {/* باقي الحقول */}
        <TextField
          label="Service Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Average Points"
          name="avgPoints"
          value={formData.avgPoints}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Average Duration (days)"
          name="avgDurationDays"
          value={formData.avgDurationDays}
          onChange={handleChange}
          fullWidth
        />

        {/* رفع الصورة مع preview */}
        <Stack spacing={1}>
          <Typography variant="body2">Upload Image</Typography>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && (
            <Avatar
              src={imagePreview}
              variant="rounded"
              sx={{ width: 120, height: 120, mt: 1 }}
            />
          )}
        </Stack>
      </Stack>
    </GenericModal>
  );
}
