import * as React from "react";
import { Box, TextField, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function FiltersSection() {
  const [status, setStatus] = React.useState("");
  const [priority, setPriority] = React.useState("");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // عمودي على الشاشات الصغيرة وأفقي على الكبيرة
        gap: 2,
        alignItems: { xs: "stretch", sm: "center" }, // لتمديد العناصر في العمود
        p: 3,
        bgcolor: "#FFFFFFF2",
        borderRadius: 3,
      }}
    >
      {/* Search Input */}
      <TextField
        sx={{ bgcolor: "#E2E8F0" }}
        fullWidth
        variant="outlined"
        placeholder="Search projects..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Status Dropdown */}
      <TextField
        select
        label="All Status"
        value={status}
        onChange={handleStatusChange}
        sx={{
          minWidth: { xs: "100%", sm: 170 },
          bgcolor: "#E2E8F0",
        }}
      >
        <MenuItem value="">All Status</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </TextField>

      {/* Priority Dropdown */}
      <TextField
        select
        label="All Priorities"
        value={priority}
        onChange={handlePriorityChange}
        sx={{
          minWidth: { xs: "100%", sm: 170 },
          bgcolor: "#E2E8F0",
        }}
      >
        <MenuItem value="">All Priorities</MenuItem>
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </TextField>
    </Box>
  );
}
