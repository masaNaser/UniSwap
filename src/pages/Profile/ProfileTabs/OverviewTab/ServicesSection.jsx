import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Box,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { GetUserService, RemoveService } from "../../../../services/profileService";
import AddServiceModal from "../../../../components/Modals/AddServiceModal";

export default function ServicesSection() {
  const token  = localStorage.getItem("accessToken");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await GetUserService(token);
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleRemove = async (serviceId) => {
    try {
      await RemoveService(token, serviceId);
      setServices((prev) => prev.filter((s) => s.subServiceId !== serviceId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: "12px",
        border: "1px solid rgba(226, 232, 240, 1)",
        boxShadow: "none",
        maxWidth: "700px",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <WorkOutlineIcon color="primary" />
          <Typography sx={{ fontWeight: 400, fontSize: "16px" }}>
            My Services
          </Typography>
        </Stack>

        <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
          Add Service
        </Button>

        {loading && <Typography>Loading...</Typography>}

        {!loading && services.length === 0 && (
          <Typography>No services added yet.</Typography>
        )}

        {!loading &&
          services.map((s) => (
            <Box
              key={s.subServiceId}
              sx={{
                p: 1,
                border: "1px solid #e2e8f0",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography>
                {s.description} — {s.avgPoints} pts — {s.avgDurationDays}
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={() => handleRemove(s.subServiceId)}
              >
                Delete
              </Button>
            </Box>
          ))}

        {/* مودال الإضافة */}
        <AddServiceModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          onAdded={fetchServices}
        />
      </CardContent>
    </Card>
  );
}
