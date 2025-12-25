import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, Breadcrumbs, TextField, CircularProgress } from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import CustomButton from "../../../components/CustomButton/CustomButton";
import ServiceCard from "../../../components/Cards/ServiceCard";
import {
  getSubServices,
  CreateSubServices,
  EditSubServices,
  DeleteSubServices,
} from "../../../services/subServiceServices";
import GenericModal from "../../../components/Modals/GenericModal";
import { isAdmin, getToken } from "../../../utils/authHelpers";
import AddIcon from "@mui/icons-material/Add";

const SubServices = () => {
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  const { id } = useParams(); // id الخدمة من الرابط
  const [subservices, setSubServices] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const serviceName = params.get("name"); // الاسم اللي جاي من الرابط
  const adminMode = isAdmin(); // <-- مهم جدًا يكون هون

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedSub, setSelectedSub] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: "" });

  const [loading, setLoading] = useState(true);

  // جلب الداتا
  const fetchSubServices = async () => {
    try {
      setLoading(true);
      const response = await getSubServices(token, id);
      console.log("fetchSubServices", response.data);
      setSubServices(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!id) return;
    fetchSubServices();
  }, [id]);

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const response = await CreateSubServices(token, id, formData);
      console.log("creatSub", response);
      setOpenCreateModal(false);
      fetchSubServices(); z
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await EditSubServices(token, id, selectedSub.id, formData);
      setOpenEditModal(false);
      fetchSubServices();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await DeleteSubServices(token, id, selectedSub.id);
      setOpenDeleteModal(false);
      fetchSubServices();
    } finally {
      setIsSubmitting(false);
    }
  };

  // لو ما في id أو بيانات
  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Category not found!
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
      {/* المسار */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Typography
          component={Link}
          to="/app/browse"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Services
        </Typography>
        <Typography color="text.primary">{serviceName}</Typography>
      </Breadcrumbs>

      {/* العنوان والوصف */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap:"wrap"
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {serviceName}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <CustomButton
            component={Link}
            to="/app/browse"
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
              Create
            </CustomButton>
          )}
        </Box>
      </Box>

      {/* عرض الـ subservices */}
      <Grid container spacing={3} sx={{ mb: "55px" }}>
        {subservices.map((sub) => (
          <Grid item xs={12} sm={6} md={4} key={sub.id}>
            <ServiceCard
              title={sub.name}
              cardWidth="368px"
              cardHeight="160px"
              titleFontSize="1.2rem"
              url={
                serviceName === "Study Support"
                  ? `/app/browse/${id}/${sub.id}/subjects?serviceName=${encodeURIComponent(
                    serviceName
                  )}&subServiceName=${encodeURIComponent(sub.name)}`
                  : `/app/services/${sub.id}/projects?name=${encodeURIComponent(
                    sub.name
                  )}&parentId=${id}&parentName=${encodeURIComponent(serviceName)}`
              }
              adminMode={adminMode}
              onEdit={() => {
                setSelectedSub(sub);
                setFormData({ name: sub.name });
                setOpenEditModal(true);
              }}
              onDelete={() => {
                setSelectedSub(sub);
                setOpenDeleteModal(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* CREATE */}
      <GenericModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        title="Create Sub-Service"
        primaryButtonText="Create"
        onPrimaryAction={handleCreate}
        isSubmitting={isSubmitting}
      >
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
        />
      </GenericModal>

      {/* EDIT */}
      <GenericModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="Edit Sub-Service"
        primaryButtonText="Update"
        onPrimaryAction={handleUpdate}
        isSubmitting={isSubmitting}
      >
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
        />
      </GenericModal>

      {/* DELETE */}
      <GenericModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete"
        primaryButtonText="Delete"
        onPrimaryAction={handleDelete}
        isSubmitting={isSubmitting}
      >
        <Typography>
          Are you sure you want to delete "{selectedSub?.name}"?
        </Typography>
      </GenericModal>
    </Container>
  );
};

export default SubServices;