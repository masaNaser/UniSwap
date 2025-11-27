import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import ServiceCard from "../../../components/Cards/ServiceCard";
import { getServices as getServicesApi } from "../../../services/servicesService";
import {isAdmin} from "../../../utils/authHelpers";
// أيقونات MUI
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CodeIcon from "@mui/icons-material/Code";
import TranslateIcon from "@mui/icons-material/Translate";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

  const adminMode = isAdmin();


console.log("admin",adminMode);
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
  const [services, setServices] = useState([]);

  const fetchService = async () => {
    try {
      const response = await getServicesApi(token);
      console.log(response.data);
      setServices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontSize: "1rem" }}
      >
        Services
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Service Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find the perfect service for your needs
        </Typography>
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
              url={`/app/browse/${service.id}?name=${encodeURIComponent(service.name)}`} // هون راح يوديك ع صفحة SubServices
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
