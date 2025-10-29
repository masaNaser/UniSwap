import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Chip, Stack } from "@mui/material";
import { CalendarToday, BusinessCenter } from "@mui/icons-material";

export default function AllStatusProjectCard({
  status = "Active",
  title = "E-commerce Website Development",
  description = "Build a modern e-commerce platform with React and Node.js including payment integration and admin panel.",
  clientInitials = "SC",
  clientName = "Sarah Chen",
  clientRole = "Client",
  clientTime = "2 hours ago",
  dueDate = "2/15/2024",
  category = "Web Development",
}) {
  const getStatusStyles = (status) => {
    const styles = {
      Active: { bg: "#ECFDF5", text: "#059669", dotColor: "#10B981" },
      Completed: { bg: "#EFF6FF", text: "#0284C7", dotColor: "#0EA5E9" },
      Overdue: { bg: "#FEF2F2", text: "#DC2626", dotColor: "#EF4444" },
    };
    return styles[status] || styles.Active;
  };

  const statusStyles = getStatusStyles(status);

  return (
    <Card
      sx={{
        width: 350,
        height: 310,
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box
            sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusStyles.dotColor }}
          />
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: statusStyles.bg,
              color: statusStyles.text,
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 24,
              borderRadius: "8px",
              px: 1,
            }}
          />
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1F2937", fontSize: "1.1rem" }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "#6B7280",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: "auto" }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "#3B82F6", fontWeight: 600, fontSize: "0.9rem" }}>
            {clientInitials}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
              {clientName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
              {clientRole} • {clientTime}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            mt: "auto",
            borderTop: "1px solid #F3F4F6",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CalendarToday sx={{ fontSize: 16, color: "#6B7280" }} />
            <Typography variant="body2" sx={{ color: "#4B5563", fontWeight: 500 }}>
              Due: {dueDate}
            </Typography>
          </Stack>

          <Chip
            label={category}
            size="small"
            icon={<BusinessCenter sx={{ fontSize: 14 }} />}
            sx={{
              backgroundColor: "#F3F4F6",
              color: "#4B5563",
              fontWeight: 500,
              fontSize: "0.75rem",
              height: 26,
              borderRadius: "8px",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
