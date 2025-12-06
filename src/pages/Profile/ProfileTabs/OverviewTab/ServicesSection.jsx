// ServicesSection.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTheme } from "@mui/material/styles";
import {
  GetUserService,
  RemoveService,
  GetUserServiceById,
  EditUserService,
} from "../../../../services/profileService";
import AddServiceModal from "../../../../components/Modals/AddServiceModal";
import { useProfile } from "../../../../Context/ProfileContext";

export default function ServicesSection() {
  const theme = useTheme();
  const token = localStorage.getItem("accessToken");
  const { isMyProfile, userData } = useProfile();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // ✅ States للـ Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let res;
      if (isMyProfile) {
        res = await GetUserService(token);
      } else {
        res = await GetUserServiceById(token, userData.id);
      }
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [isMyProfile, userData]);

  // ✅ فتح Delete Dialog
  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteDialog(true);
  };

  // ✅ تأكيد الحذف
  const handleConfirmDelete = async () => {
    try {
      await RemoveService(token, serviceToDelete.id);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      setDeleteDialog(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteDialog(false);
      setServiceToDelete(null);
    }
  };

  // ✅ إلغاء الحذف
  const handleCancelDelete = () => {
    setDeleteDialog(false);
    setServiceToDelete(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditingService(null);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: "12px",
          border: "1px solid rgba(226, 232, 240, 1)",
          boxShadow: "none",
          maxWidth: "700px",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mb={2}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <WorkOutlineIcon color="primary" />
              <Typography sx={{ fontWeight: 400, fontSize: "16px" }}>
                My Services
              </Typography>
            </Stack>

            {isMyProfile && (
              <AddIcon
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  fontSize: 28,
                }}
                onClick={() => setOpenModal(true)}
              />
            )}
          </Stack>

          {loading && <Typography>Loading...</Typography>}

          {!loading && services.length === 0 && (
            <Typography>No services added yet.</Typography>
          )}

          {!loading &&
            services.map((s) => (
              <Box
                key={s.id}
                sx={{
                  p: 2,
                  border: "1px solid #e2e8f0",
                  borderRadius: 1,
                  position: "relative",
                  mb: 1,
                  backgroundColor: "rgba(248, 250, 252, 1)",
                  backgroundColor:theme.palette.mode === 'dark' ? '#323232ff' : 'rgba(248, 250, 252, 1)',

                }}
              >
                {isMyProfile && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      position: "absolute",
                      top: 8,
                      right: 8,
                      gap: 1,
                    }}
                  >
                    <EditIcon
                      sx={{ cursor: "pointer", color: "info.main" }}
                      onClick={() => handleEdit(s)}
                    />
                    <DeleteIcon
                      sx={{ cursor: "pointer", color: "error.main" }}
                      onClick={() => handleDeleteClick(s)} // ✅ غيّرت هون
                    />
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    sx={{ fontWeight: 600, color: "rgba(15, 23, 42, 1)" }}
                  >
                    {s.subServiceName}
                  </Typography>
                  <Typography>{s.description}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 0.5,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {s.avgPoints}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {s.avgDurationDays}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

          <AddServiceModal
            open={openModal}
            handleClose={handleModalClose}
            onAdded={fetchServices}
            editingService={editingService}
          />
        </CardContent>
      </Card>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#F59E0B" }} />
          Delete Service
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{serviceToDelete?.subServiceName}"? You won't be able to revert this!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: "#6B7280",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#EF4444",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#DC2626",
              },
            }}
          >
            Yes, delete it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}