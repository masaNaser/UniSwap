import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  LinearProgress,
  Box,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ActiveProjects } from "../../../../../services/adminService";
import { getToken } from "../../../../../utils/authHelpers";

export default function ActiveProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getToken();
        const response = await ActiveProjects(token);
        console.log("ActiveProjects", response);
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#D1FAE5", color: "#059669" };
      case "Overdue":
        return { backgroundColor: "#FEE2E2", color: "#DC2626" };
      case "Completed":
        return { backgroundColor: "#DBEAFE", color: "#0284C7" };
      case "InReview":
        return { backgroundColor: "#F3E8FF", color: "#A855F7" };
      default:
        return { backgroundColor: "#EFF6FF", color: "#000" };
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "#fff",
          border: "1px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor:theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
          border: "1px solid #f1f5f9",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  // عرض بطاقات للموبايل
  if (isMobile) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor:theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
          border: "1px solid #f1f5f9",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          mb={3}
          sx={{ color: "#1e293b" }}
        >
          Active Projects
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projects.map((project) => (
            <Box
              key={project.projectId}
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  sx={{ flex: 1 }}
                >
                  {project.projectName}
                </Typography>
                <Chip
                  label={project.status}
                  size="small"
                  sx={{
                    fontWeight: "600",
                    fontSize: { xs: "10px", sm: "12px" },
                    height: { xs: "22px", sm: "26px" },
                    px: { xs: 1, sm: 1.5 },
                    borderRadius: "6px",
                    ...getStatusStyle(project.status),
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="caption" fontWeight="600">
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                     bgcolor: "#e2e8f0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#0284C7",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 120px" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Client
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {project.clientName}
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 120px" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Provider
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {project.providerName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  // عرض جدول للشاشات الكبيرة
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor:theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
        border: "1px solid #f1f5f9",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        mb={3}
        sx={{ color:theme.palette.mode === "dark" ? "#f0f9ff" : "#1e293b" }}
      >
        Active Projects
      </Typography>

      <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table stickyHeader sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color:theme.palette.mode === "dark" ? "#e0e0e0" : "#64748b",
                  fontWeight: 500,
                  bgcolor:theme.palette.mode === "dark" ? "#424242" : "#f1f5f9",
                  fontSize: "0.875rem",
                }}
              >
                Project Name
              </TableCell>
              <TableCell
                sx={{
                  color:theme.palette.mode === "dark" ? "#e0e0e0" : "#64748b",
                  fontWeight: 500,
                  bgcolor:theme.palette.mode === "dark" ? "#424242" : "#f1f5f9",
                  fontSize: "0.875rem",
                }}
              >
                Progress
              </TableCell>
              <TableCell
                sx={{
                  color:theme.palette.mode === "dark" ? "#e0e0e0" : "#64748b",
                  fontWeight: 500,
                  bgcolor:theme.palette.mode === "dark" ? "#424242" : "#f1f5f9",
                  fontSize: "0.875rem",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color:theme.palette.mode === "dark" ? "#e0e0e0" : "#64748b",
                  fontWeight: 500,
                  bgcolor:theme.palette.mode === "dark" ? "#424242" : "#f1f5f9",
                  fontSize: "0.875rem",
                }}
              >
                Client
              </TableCell>
              <TableCell
                sx={{
                  color:theme.palette.mode === "dark" ? "#e0e0e0" : "#64748b",
                  fontWeight: 500,
                  bgcolor:theme.palette.mode === "dark" ? "#424242" : "#f1f5f9",
                  fontSize: "0.875rem",
                }}
              >
                Provider
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.projectId}
                sx={{
                  "&:last-child td": { border: 0 },
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                <TableCell sx={{ fontSize: "0.875rem", width: "30%" }}>
                  {project.projectName}
                </TableCell>

                <TableCell  sx={{ width: "20%" }} >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: "center" }}
                    >
                      {project.progress}%
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#0284C7",
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                </TableCell>

                <TableCell  sx={{ width: "15%" }}>
               <Chip
  label={project.status}
  size="small"
  sx={{
    fontWeight: 600,
    fontSize: "0.75rem",
    height: 24,

    whiteSpace: "nowrap",
    overflow: "visible",
    textOverflow: "unset",
    maxWidth: "none",

    ...getStatusStyle(project.status),
  }}
/>

                </TableCell>

                <TableCell sx={{ fontSize: "0.875rem" , width: "17.5%" }}>
                  {project.clientName}
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem" , width: "17.5%" }}>
                  {project.providerName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
