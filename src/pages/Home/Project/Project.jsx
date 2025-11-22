import { Box, Typography, Container, Tabs, Tab, Chip, CircularProgress } from "@mui/material";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useState, useEffect } from "react";
import ProviderDashboard from "./dashboards/ProviderDashboard";
import ClientDashboard from "./dashboards/ClientDashboard";
import {
  getClientdashboard,
  getServiceProviderDashboard,
} from "../../../services/projectService";
import { mapProjectsWithStatus } from "../../../utils/projectStatusMapper"; // ✅ Import mapper

export default function Project() {
  // Initialize from localStorage to persist across page refreshes
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem("projectTabIndex");
    return saved ? parseInt(saved) : 0;
  });
  const [providerData, setProviderData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem("statusFilter") || "All Status";
  });

  const token = localStorage.getItem("accessToken");

  // Save tab index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("projectTabIndex", value.toString());
  }, [value]);

  // Save status filter to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("statusFilter", statusFilter);
  }, [statusFilter]);

  // ✅ FIXED: Fetch data when statusFilter changes
  useEffect(() => {
    fetchAllDashboardData();
  }, [token, statusFilter]);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ FIXED: Pass statusFilter to API calls
      const [providerResponse, clientResponse] = await Promise.all([
        getServiceProviderDashboard(token, "Provider", statusFilter),
        getClientdashboard(token, "client", statusFilter),
      ]);

      console.log("Provider Response:", providerResponse);
      console.log("Client Response:", clientResponse);

      // ✅ Map status numbers to strings
      const mappedProviderData = {
        ...providerResponse.data,
        items: mapProjectsWithStatus(providerResponse.data.items),
      };

      const mappedClientData = {
        ...clientResponse.data,
        items: mapProjectsWithStatus(clientResponse.data.items),
      };

      setProviderData(mappedProviderData);
      setClientData(mappedClientData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRefresh = async () => {
    await fetchAllDashboardData();
  };

  const providerStats = providerData?.summary || {};
  const clientStats = clientData?.summary || {};

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Projects
        </Typography>
        <Typography component="span" color="#686f78ff">
          Manage your services and requests in one place
        </Typography>

        {/* Tabs */}
        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              width: "100%",
              "& .MuiTab-root": {
                textTransform: "none",
                borderRadius: "20px",
                px: 1,
                py: 1,
                flex: 1,
                maxWidth: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#FFFFFFCC",
                color: "#686f78ff",
              },
              "& .Mui-selected": {
                background: "linear-gradient(to right, #0EA4E8 0%, #0284C7 100%)",
                color: "#FFFFFF",
              },
            }}
          >
            <Tab
              disableRipple
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={8}
                  width="100%"
                >
                  <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                    <VolunteerActivismOutlinedIcon
                      sx={{
                        color: value === 0 ? "#FFF" : "#686f78ff",
                      }}
                    />
                    <Box display="flex" flexDirection="column">
                      <Typography fontWeight="bold" color={value === 0 ? "#FFF" : "#686f78ff"}>
                        Projects I'm Working On
                      </Typography>
                      <Typography variant="body2" color={value === 0 ? "#FFF" : "#686f78ff"}>
                        Providing services to others
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={providerStats.total || 0}
                    size="small"
                    sx={{
                      bgcolor: value === 0 ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 180, 207, 0.2)",
                      color: value === 0 ? "#FFF" : "#3b82f6",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                </Box>
              }
            />

            <Tab
              disableRipple
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={8}
                  width="100%"
                >
                  <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                    <WorkOutlineIcon
                      sx={{
                        color: value === 1 ? "#FFF" : "#686f78ff",
                      }}
                    />
                    <Box display="flex" flexDirection="column">
                      <Typography fontWeight="bold" color={value === 1 ? "#FFF" : "#686f78ff"}>
                        Projects I Requested
                      </Typography>
                      <Typography variant="body2" color={value === 1 ? "#FFF" : "#686f78ff"}>
                        Services I need from others
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={clientStats.total || 0}
                    size="small"
                    sx={{
                      bgcolor: value === 1 ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 180, 207, 0.2)",
                      color: value === 1 ? "#FFF" : "#3b82f6",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      px: 1,
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Provider Dashboard */}
        {value === 0 && (
          <ProviderDashboard
            data={providerData}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRefresh={handleRefresh}
          />
        )}

        {/* Client Dashboard */}
        {value === 1 && (
          <ClientDashboard
            data={clientData}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRefresh={handleRefresh}
          />
        )}
      </Container>
    </Box>
  );
}