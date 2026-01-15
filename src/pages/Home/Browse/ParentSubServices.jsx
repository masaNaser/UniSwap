// المواد

import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Breadcrumbs,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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

  const serviceName = params.get("serviceName");
  const subServiceName = params.get("subServiceName");

  const [parentSubServices, setParentSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminMode = isAdmin();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // ✅ إضافة الـ Snackbar للرسائل
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchParentSubServices = async () => {
    try {
      setLoading(true);
      const response = await GetByParentSubService(
        token,
        serviceId,
        subServiceId
      );
      setParentSubServices(response.data);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId && subServiceId) fetchParentSubServices();
  }, [serviceId, subServiceId]);

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      await CreateSubServices(token, serviceId, formData, subServiceId);
      setOpenCreateModal(false);
      setFormData({ name: "" });
      fetchParentSubServices();
      showSnackbar("Subject created successfully!");
    } catch (error) {
      showSnackbar("Error creating subject", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await EditSubServices(token, serviceId, selectedSubject.id, formData);
      setOpenEditModal(false);
      fetchParentSubServices();
      showSnackbar("Subject updated successfully!");
    } catch (error) {
      showSnackbar("Error updating subject", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubject) return;
    setIsSubmitting(true);
    try {
      await DeleteSubServices(token, serviceId, selectedSubject.id);
      setOpenDeleteModal(false);
      setSelectedSubject(null);
      fetchParentSubServices();
      showSnackbar("Subject deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      setOpenDeleteModal(false);
      setSelectedSubject(null);
      // 🔥 هون الرسالة اللي بدك إياها لما يرفض الحذف
      showSnackbar(
        "Cannot delete: please remove summaries inside this subject first",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
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
        <Typography
          component={Link}
          to={`/app/browse/${serviceId}?name=${encodeURIComponent(
            serviceName
          )}`}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          {serviceName}
        </Typography>
        <Typography color="text.primary">{subServiceName}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4">{subServiceName}</Typography>
          <Typography variant="body2" color="text.secondary">
            Select a subject to view content
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <CustomButton
            component={Link}
            to={`/app/browse/${serviceId}?name=${encodeURIComponent(
              serviceName
            )}`}
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
              cardWidth="368px"
              cardHeight="160px"
              titleFontSize="1.2rem"
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
              url={`/app/browse/${serviceId}/${subServiceId}/${
                subject.id
              }/projects?serviceName=${encodeURIComponent(
                serviceName
              )}&subServiceName=${encodeURIComponent(
                subServiceName
              )}&parentSubServiceName=${encodeURIComponent(subject.name)}`}
            />
          </Grid>
        ))}
      </Grid>

      {/* Create & Edit Modals (بقيت كما هي) */}
      <GenericModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
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
        />
      </GenericModal>

      <GenericModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
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

      {/* ✅ المودال المحدث للحذف (Dialog) */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        PaperProps={{
          sx: { borderRadius: "12px", width: "400px", maxWidth: "90%" },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#F59E0B" }} />
          Delete Subject
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedSubject?.name}"? You won't
            be able to revert this!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteModal(false)}
            sx={{ color: "#6B7280", textTransform: "none" }}
          >
            Cancel
          </Button>
          {/* <Button
            onClick={handleConfirmDelete}
            // disabled={isSubmitting}
            variant="contained"
            sx={{
              bgcolor: "#EF4444",
              textTransform: "none",
              "&:hover": { bgcolor: "#DC2626" },
            }}
          >
            {isSubmitting ? "Deleting..." : "Yes, delete it!"}
          </Button> */}
        </DialogActions>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          sx={{
            bgcolor: "#EF4444",
            textTransform: "none",
            "&:hover": { bgcolor: "#DC2626" },
          }}
        >
          Yes, delete it!
        </Button>
      </Dialog>

      {/* ✅ إضافة الـ Snackbar في نهاية الـ Container ليعرض الرسائل */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          sx={{ width: "100%", bgcolor: "#3b82f6" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ParentSubServices;
