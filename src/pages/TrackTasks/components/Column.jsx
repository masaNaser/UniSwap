import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import TaskCard from "./TaskCard"; // رح نعمله بعد شوي

export default function Column({ status, tasks }) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 330,
        minHeight: "70vh",
        p: 2,
        borderRadius: 3,
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---- Title ---- */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {status}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {tasks.length} Tasks
        </Typography>
      </Box>

      {/* ---- Tasks List ---- */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </Paper>
  );
}
