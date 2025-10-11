import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import ServiceCard from "../../../components/Cards/ServiceCard";
import { getServices as getServicesApi } from "../../../services/servicesService";

const Services = () => {
  const token = localStorage.getItem("accessToken");
  const [services, setServices] = useState([]); //بنخزن الداتا اللي بالريسبونس عشان نقدر نعرض الداتا بالريتيرن

  const fetchService = async () => {
    try {
      const response = await getServicesApi(token);
      console.log(response);
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
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <ServiceCard
              title={service.name}
              description={service.description}
              icon={
                <img
                  src={service.image}
                  alt={service.name}
                  style={{ width: 40, height: 40 }}
                />
              }
              count={service.subServices.length}
url={`/app/browse/${service.id}?name=${encodeURIComponent(service.name)}`}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services;
