import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  Button,
} from "@mui/material";

export default function RequestProjectCard({
  status = "Pending Request",
  title,
  clientInitials,
  userName,
  offeredPoints,
  sentDate,
  description,
  isProvider = true, // جديد: يخبرنا إذا كان المستخدم provider
}) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        width: 350,
        height: 310,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#FBBF24",
            }}
          />
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: "#FEF3C7",
              color: "#D97706",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 24,
              borderRadius: "8px",
              px: 1,
            }}
          />
        </Stack>

        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 700, mb: 2, color: "#1F2937" }}
        >
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#4299e1",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {clientInitials}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Offered: {offeredPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sent: {sentDate}
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "#4B5563",
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: "auto" }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#D1D5DB",
              color: "#4B5563",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              flexGrow: 1,
            }}
          >
            View
          </Button>

          {isProvider && (
            <>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#EF4444",
                  color: "#EF4444",
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  flexGrow: 1,
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976D2",
                  "&:hover": {
                    backgroundColor: "#1565C0",
                  },
                  color: "white",
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  boxShadow: "none",
                  flexGrow: 1,
                }}
              >
                Approve
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
