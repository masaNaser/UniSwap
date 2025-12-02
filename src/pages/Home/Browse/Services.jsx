import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, TextField } from "@mui/material";
import ServiceCard from "../../../components/Cards/ServiceCard";
import { getServices,CreateServices,EditServices,DeleteServices  } from "../../../services/servicesService";
import { isAdmin } from "../../../utils/authHelpers";
// أيقونات MUI
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CodeIcon from "@mui/icons-material/Code";
import TranslateIcon from "@mui/icons-material/Translate";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import CustomButton from "../../../components/CustomButton/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import GenericModal from "../../../components/Modals/GenericModal"
// const adminMode = isAdmin();

// خريطة تربط اسم السيرفس بالأيقونة المناسبة
const iconMap = {
  "Study Support": <SchoolIcon fontSize="large" sx={{ color: "#2196F3" }} />,
  "Personal Development & Productivity": (
    <SelfImprovementIcon fontSize="large" sx={{ color: "#9C27B0" }} />
  ),
  "Career & Scholarship Preparation": (
    <BusinessCenterIcon fontSize="large" sx={{ color: "#FF5722" }} />
  ),
  "Writing, Editing & Translation": (
    <TranslateIcon fontSize="large" sx={{ color: "#FF9800" }} />
  ),
  "Programming & Tech Projects": (
    <CodeIcon fontSize="large" sx={{ color: "#00C853" }} />
  ),
  "Design & Creative": (
    <DesignServicesIcon fontSize="large" sx={{ color: "#6A67FE" }} />
  ),
};

const Services = () => {
  const token = localStorage.getItem("accessToken");
  const adminMode = isAdmin(); // <-- حطها هون
   const [services, setServices] = useState([]);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Form data
  const [formData, setFormData] = useState({ name: "", description: "", image: null, });

  const fetchService = async () => {
    try {
      const response = await getServices(token);
      console.log(response.data);
      setServices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

    const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

    
  // Create Service
   const handleCreateService = async () => {
    const fd = new FormData();
    fd.append("Name", formData.name);
    fd.append("Description", formData.description);
    if (formData.image) fd.append("Image", formData.image);

    setIsSubmitting(true);
    try {
     const response= await CreateServices(token, fd);
     console.log("creatSer",response);
      setOpenCreateModal(false);
      fetchService();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Service
  const handleUpdateService = async () => {
    const fd = new FormData();
    fd.append("Name", formData.name);
    fd.append("Description", formData.description);
    if (formData.image) fd.append("Image", formData.image);

    setIsSubmitting(true);
    try {
     const response= await EditServices(token, selectedService.id, fd);
     console.log("edit,",response);
      setOpenEditModal(false);
    // تحديث الخدمات في الواجهة مباشرة
    setServices(prev =>
      prev.map(s =>
        s.id === selectedService.id ? response.data : s
      )
    );  
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleUpdateService = async () => {
  //   if (!formData.name.trim() || !formData.description.trim()) {
  //     showSnackbar("Please fill all fields", "error");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     await EditServices(token, selectedService.id, formData);
  //     showSnackbar("Service updated successfully!", "success");
  //     setOpenEditModal(false);
  //     setFormData({ name: "", description: "" });
  //     fetchServices();
  //   } catch (error) {
  //     console.error(error);
  //     showSnackbar("Failed to update service", "error");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

    // Delete Service
  const confirmDeleteService = async () => {
    setIsSubmitting(true);
    try {
      await DeleteServices(token, selectedService.id);
      setOpenDeleteModal(false);
      fetchService();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontSize: "1rem" }}
      >
        Services
      </Typography>

      <Box sx={{ mb: 4, display:"flex", justifyContent:"space-between" }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Service Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find the perfect service for your needs
          </Typography>
        </Box>
        {adminMode && (
          <CustomButton
            variant="contained"
            onClick={() => setOpenCreateModal(true)}
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
          >
            Create
          </CustomButton>
        )}{" "}
      </Box>

      <Grid container spacing={3} sx={{ mb: "55px" }}>
        {services.map((service) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
            <ServiceCard
              title={service.name}
              description={service.description}
              icon={
                iconMap[service.name] || (
                  <DesignServicesIcon fontSize="large" sx={{ color: "#888" }} />
                )
              }
              count={`${service.subServices.length} services`}
              url={`/app/browse/${service.id}?name=${encodeURIComponent(
                service.name
              )}`} // هون راح يوديك ع صفحة SubServices
              adminMode={adminMode} // ⬅️ أهم خطوة
                 onEdit={() => {
                setSelectedService(service);
                setFormData({
                  name: service.name,
                  description: service.description,
                  image: service.image,
                });
                setOpenEditModal(true);
              }}
              onDelete={() => {
                setSelectedService(service);
                setOpenDeleteModal(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

        {/* Create Modal */}
      <GenericModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title="Create New Service"
        icon={<AddIcon sx={{ color: "#3b82f6" }} />}
        primaryButtonText="Create Service"
        primaryButtonIcon={<AddIcon />}
        onPrimaryAction={handleCreateService}
        isSubmitting={isSubmitting}
        snackbar={snackbar}
        onSnackbarClose={handleSnackbarClose}
      >
        <TextField
          fullWidth
          label="Service Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
        />
           <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          style={{ marginTop: 15 }}
        />
      </GenericModal>

       {/* Edit Modal */}
      <GenericModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="Edit Service"
        icon={<DesignServicesIcon sx={{ color: "#3b82f6" }} />}
        primaryButtonText="Update Service"
        onPrimaryAction={handleUpdateService}
        isSubmitting={isSubmitting}
        snackbar={snackbar}
        onSnackbarClose={handleSnackbarClose}
      >
        <TextField
          fullWidth
          label="Service Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
        />
          <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          style={{ marginTop: 15 }}
        />
      </GenericModal>

      {/* Delete Confirmation Modal */}
      <GenericModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Service"
        primaryButtonText="Delete"
        onPrimaryAction={confirmDeleteService}
        isSubmitting={isSubmitting}
        snackbar={snackbar}
        onSnackbarClose={handleSnackbarClose}
        maxWidth="xs"
      >
        <Typography>
          Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
        </Typography>
      </GenericModal>
    </Container>
  );
};

export default Services;
