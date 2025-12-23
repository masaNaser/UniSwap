import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, Breadcrumbs, TextField, CircularProgress } from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../../../components/CustomButton/CustomButton";
import ServiceCard from "../../../components/Cards/ServiceCard";
import GenericModal from "../../../components/Modals/GenericModal";
import { GetByParentSubService } from "../../../services/studySupportService";
import {
  CreateSubServices,
  EditSubServices,
  DeleteSubServices,
} from "../../../services/subServiceServices";
import { isAdmin, getToken } from "../../../utils/authHelpers";

const ParentSubServices = () => {
  const token = getToken();
  const { serviceId, subServiceId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const serviceName = params.get("serviceName"); // Study Support
  const subServiceName = params.get("subServiceName"); // Computer Engineering

  const [parentSubServices, setParentSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminMode = isAdmin();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // جلب المواد (ParentSubServices)
  const fetchParentSubServices = async () => {
    try {
      setLoading(true);
      const response = await GetByParentSubService(token, serviceId, subServiceId);
      console.log("Parent SubServices:", response.data);
      setParentSubServices(response.data);
    } catch (err) {
      console.error("Error fetching parent subservices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId && subServiceId) {
      fetchParentSubServices();
    }
  }, [serviceId, subServiceId]);

  // Create Subject (ParentSubService)
  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      console.log("🔍 Creating with:", {
        serviceId: serviceId,
        name: formData.name,
        parentSubServiceId: subServiceId // 🔥 تأكدي إنه موجود
      });
      // 🔥 استخدام CreateSubServices مع parentSubServiceId
      const response = await CreateSubServices(token, serviceId, formData, subServiceId);
      console.log("✅ Created:", response.data);

      setOpenCreateModal(false);
      setFormData({ name: "" });
      fetchParentSubServices();
    } catch (error) {
      console.error("Error creating subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Subject
  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      // 🔥 استخدام EditSubServices
      await EditSubServices(token, serviceId, selectedSubject.id, formData);

      setOpenEditModal(false);
      setFormData({ name: "" });
      fetchParentSubServices();
    } catch (error) {
      console.error("Error updating subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Subject
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      // 🔥 استخدام DeleteSubServices
      await DeleteSubServices(token, serviceId, selectedSubject.id);

      setOpenDeleteModal(false);
      setSelectedSubject(null);
      fetchParentSubServices();
    } catch (error) {
      console.error("Error deleting subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!serviceId || !subServiceId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Invalid parameters!
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Typography
          component={Link}
          to="/app/browse"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Services
        </Typography>
        <Typography
          component={Link}
          to={`/app/browse/${serviceId}?name=${encodeURIComponent(serviceName)}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {serviceName}
        </Typography>
        <Typography color="text.primary">{subServiceName}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {subServiceName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a subject to view projects
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomButton
            component={Link}
            to={`/app/browse/${serviceId}?name=${encodeURIComponent(serviceName)}`}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Back
          </CustomButton>
          {adminMode && (
            <CustomButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setFormData({ name: "" });
                setOpenCreateModal(true);
              }}
            >
              Create Subject
            </CustomButton>
          )}
        </Box>
      </Box>

      {/* Grid of Subjects */}
      <Grid container spacing={3} sx={{ mb: "55px" }}>
        {parentSubServices.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <ServiceCard
              title={subject.name}
              description={subject.description || ""}
              titleFontSize="1.2rem"
              cardWidth="368px"
              cardHeight="160px"
              url={`/app/browse/${serviceId}/${subServiceId}/${subject.id}/projects?serviceName=${encodeURIComponent(
                serviceName
              )}&subServiceName=${encodeURIComponent(
                subServiceName
              )}&parentSubServiceName=${encodeURIComponent(subject.name)}`}
              adminMode={adminMode}
              onEdit={() => {
                setSelectedSubject(subject);
                setFormData({ name: subject.name });
                setOpenEditModal(true);
              }}
              onDelete={() => {
                setSelectedSubject(subject);
                setOpenDeleteModal(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Create Modal */}
      <GenericModal
        open={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setFormData({ name: "" });
        }}
        title="Create Subject"
        primaryButtonText="Create"
        onPrimaryAction={handleCreate}
        isSubmitting={isSubmitting}
      >
        <TextField
          fullWidth
          label="Subject Name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
          placeholder="e.g., Data Structures"
        />
      </GenericModal>

      {/* Edit Modal */}
      <GenericModal
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setFormData({ name: "" });
        }}
        title="Edit Subject"
        primaryButtonText="Update"
        onPrimaryAction={handleUpdate}
        isSubmitting={isSubmitting}
      >
        <TextField
          fullWidth
          label="Subject Name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
        />
      </GenericModal>

      {/* Delete Modal */}
      <GenericModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedSubject(null);
        }}
        title="Delete Subject"
        primaryButtonText="Delete"
        onPrimaryAction={handleDelete}
        isSubmitting={isSubmitting}
      >
        <Typography>
          Are you sure you want to delete "{selectedSubject?.name}"?
        </Typography>
      </GenericModal>
    </Container>
  );
};

export default ParentSubServices;