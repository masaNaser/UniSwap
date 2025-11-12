import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { CreateService } from "../../services/profileService";
import { getServices } from "../../services/servicesService"; // نفترض في API لكل الخدمات العامة

export default function AddServiceModal({ open, handleClose, onAdded }) {
  const token = localStorage.getItem("accessToken");

  const [allServices, setAllServices] = useState([]);
  const [formData, setFormData] = useState({
    subServiceId: "",
    description: "",
    avgPoints: "",
    avgDurationDays: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 جلب كل الخدمات العامة من المنصة
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await CreateService(token, formData);
      onAdded(); // تحديث القائمة بعد الإضافة
      handleClose();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Service</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Choose Main Service"
            name="subServiceId"
            value={formData.subServiceId}
            onChange={handleChange}
            fullWidth
          >
            {allServices.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Average Points (e.g., 100-300)"
            name="avgPoints"
            value={formData.avgPoints}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Average Duration (e.g., 1 month)"
            name="avgDurationDays"
            value={formData.avgDurationDays}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
