import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const ServiceCard = ({ icon, title, description, count, url }) => {
  return (
    <Card
      sx={{
        height: "100%",
        width: "368px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: "12px",
        transition: "0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '1rem' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
          {description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#F1F5F9",
              borderRadius: "12px",
              py: 0.5,
              px: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
            >
              {count} services
            </Typography>
          </Box>
          <IconButton
            component={Link}
            to={url}
            size="small"
            sx={{ color: "inherit" }}
          >
            <ArrowRightAltIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
