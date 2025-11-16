import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlagIcon from "@mui/icons-material/Flag";

export default function TaskCard({ task }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: "grab",
        transition: "0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* ---- Title ---- */}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
        {task.title}
      </Typography>

      {/* ---- Description ---- */}
      {task.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </Typography>
      )}

      {/* ---- Deadline + Priority ---- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        {/* Deadline */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CalendarMonthIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {task.deadline || "No deadline"}
          </Typography>
        </Box>

        {/* Priority */}
        {task.priority && (
          <Chip
            label={task.priority}
            size="small"
            icon={<FlagIcon />}
            sx={{
              fontSize: "11px",
              height: "22px",
              background:
                task.priority === "High"
                  ? "#fee2e2"
                  : task.priority === "Medium"
                  ? "#fef9c3"
                  : "#dcfce7",
              color:
                task.priority === "High"
                  ? "#dc2626"
                  : task.priority === "Medium"
                  ? "#ca8a04"
                  : "#15803d",
              "& .MuiChip-icon": {
                fontSize: "14px !important",
                color:
                  task.priority === "High"
                    ? "#dc2626"
                    : task.priority === "Medium"
                    ? "#ca8a04"
                    : "#15803d",
              },
            }}
          />
        )}
      </Box>
    </Paper>
  );
}
