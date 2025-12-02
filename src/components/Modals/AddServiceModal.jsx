// AddServiceModal.jsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GenericModal from "../../components/Modals/GenericModal";
import { CreateService, EditUserService } from "../../services/profileService";
import { getServices } from "../../services/servicesService";
import { getSubServices } from "../../services/subServiceServices";

export default function AddServiceModal({ open, handleClose, onAdded, editingService }) {
  const token = localStorage.getItem("accessToken");

  const [allServices, setAllServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    subServiceId: "",
    description: "",
    avgPoints: "",
    avgDurationDays: "",
    image: null, // ✅ أضفت الصورة
  });
  const [loading, setLoading] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  // تحميل الخدمات الرئيسية
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const res = await getServices();
        setAllServices(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (open) fetchAllServices();
  }, [open]);

  // تحميل الخدمات الفرعية عند اختيار الخدمة الرئيسية
  useEffect(() => {
    const fetchSubServices = async () => {
      if (!formData.serviceId) {
        setSubServices([]);
        setFormData((prev) => ({ ...prev, subServiceId: "" }));
        return;
      }
      setLoadingSub(true);
      try {
        const res = await getSubServices(token, formData.serviceId);
        setSubServices(res.data || []);
        // لو الخدمة الفرعية موجودة من تعديل سابق نحتفظ بها
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
        description: editingService.description,
        avgPoints: editingService.avgPoints,
        avgDurationDays: editingService.avgDurationDays,
        image: null, // في التعديل، الصورة تبدأ null (إلا إذا اليوزر بده يغيرها)
      });
    } else {
      setFormData({
        serviceId: "",
        subServiceId: "",
        description: "",
        avgPoints: "",
        avgDurationDays: "",
        image: null,
      });
    }
  }, [editingService, open]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ دالة للتعامل مع الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // ✅ تعديل handleSubmit لإرسال FormData
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // إنشاء FormData
      const fd = new FormData();
      fd.append("ServiceId", formData.serviceId);
      fd.append("SubServiceId", formData.subServiceId);
      fd.append("Description", formData.description);
      fd.append("AvgPoints", formData.avgPoints);
      fd.append("AvgDurationDays", formData.avgDurationDays);
      
      // إضافة الصورة إذا موجودة
      if (formData.image) {
        fd.append("Image", formData.image);
      }

      if (editingService) {
        // تعديل الخدمة
        await EditUserService(token, fd, editingService.id);
        setSnackbar({
          open: true,
          message: "Service updated successfully!",
          severity: "success",
        });
      } else {
        // إضافة خدمة جديدة
        await CreateService(token, fd);
        setSnackbar({
          open: true,
          message: "Service added successfully!",
          severity: "success",
        });
      }
      onAdded();
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Operation failed.",
        severity: "error",
      });
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
          required
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
          required
          disabled={!formData.serviceId || loadingSub}
        >
          {loadingSub && <MenuItem disabled>Loading...</MenuItem>}
          {!loadingSub && subServices.length === 0 && formData.serviceId && (
            <MenuItem disabled>No sub-services available</MenuItem>
          )}
          {subServices.map((sub) => (
            <MenuItem key={sub.id} value={sub.id}>
              {sub.name}
            </MenuItem>
          ))}
        </TextField>

        {/* الوصف */}
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          required
        />

        {/* متوسط النقاط */}
        <TextField
          label="Average Points"
          name="avgPoints"
          type="number"
          value={formData.avgPoints}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* متوسط المدة بالأيام */}
        <TextField
          label="Average Duration (days)"
          name="avgDurationDays"
          type="number"
          value={formData.avgDurationDays}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* ✅ إضافة input للصورة */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Service Image (optional)
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
          {formData.image && (
            <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: "block" }}>
              Selected: {formData.image.name}
            </Typography>
          )}
        </Box>
      </Stack>
    </GenericModal>
  );
}