import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GenericModal from "../../components/Modals/GenericModal";
import { CreateService } from "../../services/profileService";
import { getServices } from "../../services/servicesService";
import { getSubServices } from "../../services/subServiceServices";

export default function AddServiceModal({ open, handleClose, onAdded }) {
  const token = localStorage.getItem("accessToken");
  const [allServices, setAllServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    subServiceId: "",
    description: "",
    avgPoints: "",
    avgDurationDays: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  // 🔹 تحميل الخدمات الرئيسية
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

  // 🔹 تحميل الخدمات الفرعية عند اختيار الرئيسية
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
        setFormData((prev) => ({ ...prev, subServiceId: "" }));
      } catch (err) {
        console.error(err);
      }
      setLoadingSub(false);
    };
    fetchSubServices();
  }, [formData.serviceId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await CreateService(token, formData);
      setSnackbar({
        open: true,
        message: "Service added successfully!",
        severity: "success",
      });
      onAdded();
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add service.",
        severity: "error",
      });
    }
    setLoading(false);
  };

  return (
    <GenericModal
      open={open}
      onClose={handleClose}
      title="Add New Service"
      icon={<AddIcon color="primary" />}
      onPrimaryAction={handleSubmit}
      primaryButtonText="Add"
      primaryButtonIcon={<AddIcon />}
      isSubmitting={loading}
      snackbar={snackbar}
      onSnackbarClose={() => setSnackbar(null)}
    >
      {/* محتوى المودال */}
      <Stack spacing={2} mt={1}>
        {/* الخدمة الرئيسية */}
        <TextField
          select
          label="Choose Main Service"
          name="serviceId"
          value={formData.serviceId}
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
          value={formData.subServiceId}
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
      </Stack>
    </GenericModal>
  );
}
