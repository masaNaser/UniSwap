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
import {
  GetUserService,
  RemoveService,
  GetUserServiceById
} from "../../../../services/profileService";
import AddServiceModal from "../../../../components/Modals/AddServiceModal";
import { useProfile } from "../../../../Context/ProfileContext";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
export default function ServicesSection() {
  const token = localStorage.getItem("accessToken");
  const { isMyProfile,userData  } = useProfile();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

const fetchServices = async () => {
  setLoading(true);
  try {
    let res;
    if (isMyProfile) {
      // خدماتي أنا
      res = await GetUserService(token); // أو GetMyService(token) لو عندك دالة منفصلة
    } else {
      // خدمات مستخدم آخر
      res = await GetUserServiceById(token, userData.id);
    }
    setServices(res.data || []);
  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};

// جلب الخدمات عند تحميل المكون أو تغيير isMyProfile أو userData  
//بدون ما نخلي اليوز ايفيكت تعتمد ع اليوزر داتا او قيمة الايز ماي بروفايل رح يعرض خدماتي مثلا عند كل اليوزر
useEffect(() => {
  fetchServices();
}, [isMyProfile, userData]);


  const handleRemove = async (id) => {
    try {
      await RemoveService(token, id);
      setServices((prev) => prev.filter((s) => s.id !== id));
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
                position: "relative", // مهم عشان نقدر نحط الأيقونة بالزاوية
                mb: 1,
                backgroundColor: "rgba(248, 250, 252, 1)",
                width: "300px",
              }}
            >
              {/* أيقونة الحذف */}
              {isMyProfile && (
                <DeleteIcon
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    cursor: "pointer",
                    color: "error.main",
                  }}
                  onClick={() => handleRemove(s.id)}
                />
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
