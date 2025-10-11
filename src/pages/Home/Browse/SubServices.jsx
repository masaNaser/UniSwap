import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Breadcrumbs,
} from "@mui/material";
import { Link, useParams, useLocation} from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomButton from "../../../shared/CustomButton/CustomButton";
import ServiceCard from "../../../components/Cards/ServiceCard";
import { getSubServices as getSubServicesApi } from "../../../services/subServiceServices";

const SubServices = () => {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams(); // id الخدمة من الرابط
  const [subservices, setSubServices] = useState([]);
  const location = useLocation();
const params = new URLSearchParams(location.search);
const serviceName = params.get("name"); // الاسم اللي جاي من الرابط
  // جلب الداتا
  const fetchSubServices = async () => {
    try {
      const response = await getSubServicesApi(token, id);
      console.log(response.data);
      setSubServices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchSubServices();
  }, [id]);

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
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {serviceName}
          </Typography>
        </Box>
        <CustomButton
          component={Link}
          to="/app/browse"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </CustomButton>
      </Box>

      {/* عرض الـ subservices */}
      <Grid container spacing={3} sx={{ mb: "55px" }}>
        {subservices.map((sub) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}key={sub.id}>
            <ServiceCard
              title={sub.name}
             count="3 projects"
            url={`/app/services/${sub.id}/projects?name=${encodeURIComponent(sub.name)}&parentId=${id}&parentName=${encodeURIComponent(serviceName)}`}  // هون راح يوديك ع صفحة SubServiceProjects
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubServices;
