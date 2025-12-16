import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
} from "@mui/material";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useState, useEffect } from "react";
import ProviderDashboard from "./dashboards/ProviderDashboard";
import ClientDashboard from "./dashboards/ClientDashboard";
import {
  getClientdashboard,
  getServiceProviderDashboard,
} from "../../../services/projectService";
import { mapProjectsWithStatus } from "../../../utils/projectStatusMapper";
import { useLocation } from 'react-router-dom';

export default function Project() {
  const location = useLocation();
  const notificationData = location.state;

  // Initialize from localStorage to persist across page refreshes
  const [value, setValue] = useState(() => {
    if (notificationData?.isProvider !== undefined) {
      return notificationData.isProvider ? 0 : 1;
    }
    const saved = localStorage.getItem("projectTabIndex");
    return saved ? parseInt(saved) : 0;
  });

  const [highlightedRequestId, setHighlightedRequestId] = useState(
    notificationData?.requestId || null
  );

  const [showRequestsFromNotif, setShowRequestsFromNotif] = useState(() => {
    if (notificationData?.showRequests !== undefined) {
      return notificationData.showRequests;
    }
    const providerRequests = localStorage.getItem("providerShowRequests");
    const clientRequests = localStorage.getItem("clientShowRequests");
    
    const currentTab = notificationData?.isProvider !== undefined 
      ? (notificationData.isProvider ? 0 : 1)
      : (localStorage.getItem("projectTabIndex") ? parseInt(localStorage.getItem("projectTabIndex")) : 0);
    
    if (currentTab === 0) {
      return providerRequests ? JSON.parse(providerRequests) : false;
    } else {
      return clientRequests ? JSON.parse(clientRequests) : false;
    }
  });

  const [providerData, setProviderData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem("statusFilter") || "All Status";
  });

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    localStorage.setItem("projectTabIndex", value.toString());
  }, [value]);

  useEffect(() => {
    localStorage.setItem("statusFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [token, statusFilter]);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [providerResponse, clientResponse] = await Promise.all([
        getServiceProviderDashboard(token, "Provider", statusFilter),
        getClientdashboard(token, "client", statusFilter),
      ]);

      console.log("Provider Response:", providerResponse);
      console.log("Client Response:", clientResponse);

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
    const providerRequests = localStorage.getItem("providerShowRequests");
    const clientRequests = localStorage.getItem("clientShowRequests");
    
    if (newValue === 0) {
      setShowRequestsFromNotif(providerRequests ? JSON.parse(providerRequests) : false);
    } else {
      setShowRequestsFromNotif(clientRequests ? JSON.parse(clientRequests) : false);
    }
  };

  const handleRefresh = async () => {
    const providerRequests = localStorage.getItem("providerShowRequests");
    const clientRequests = localStorage.getItem("clientShowRequests");
    
    if (value === 0) {
      setShowRequestsFromNotif(providerRequests ? JSON.parse(providerRequests) : false);
    } else {
      setShowRequestsFromNotif(clientRequests ? JSON.parse(clientRequests) : false);
    }
    
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
            orientation="horizontal"
            variant="fullWidth"
            sx={{
              width: "100%",
              "& .MuiTabs-flexContainer": {
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 1, md: 0 },
              },
              "& .MuiTab-root": {
                textTransform: "none",
                borderRadius: "20px",
                px: { xs: 1.5, md: 1 },
                py: { xs: 1.5, md: 1 },
                flex: 1,
                maxWidth: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#FFFFFFCC",
                color: "#686f78ff",
                width: { xs: "100%", md: "auto" },
              },
              "& .Mui-selected": {
                background:
                  "linear-gradient(to right, #0EA4E8 0%, #0284C7 100%)",
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
                  justifyContent={{ xs: "space-between", md: "center" }}
                  gap={{ xs: 1, md: 8 }}
                  width="100%"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    alignItems="center"
                  >
                    <VolunteerActivismOutlinedIcon
                      sx={{
                        color: value === 0 ? "#FFF" : "#686f78ff",
                      }}
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography
                        fontWeight="bold"
                        color={value === 0 ? "#FFF" : "#686f78ff"}
                        fontSize={{ xs: "0.8rem", md: "1rem" }}
                      >
                        Projects I'm Working On
                      </Typography>
                      <Typography
                        variant="body2"
                        color={value === 0 ? "#FFF" : "#686f78ff"}
                        fontSize={{ xs: "0.65rem", md: "0.875rem" }}
                        sx={{ display: { xs: "none", sm: "block" } }}
                      >
                        Providing services to others
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={providerStats.total || 0}
                    size="small"
                    sx={{
                      bgcolor:
                        value === 0
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(100, 180, 207, 0.2)",
                      color: value === 0 ? "#FFF" : "#3b82f6",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      px: 1,
                      height: { xs: "24px", md: "auto" },
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
                  justifyContent={{ xs: "space-between", md: "center" }}
                  gap={{ xs: 1, md: 8 }}
                  width="100%"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    alignItems="center"
                  >
                    <WorkOutlineIcon
                      sx={{
                        color: value === 1 ? "#FFF" : "#686f78ff",
                      }}
                    />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography
                        fontWeight="bold"
                        color={value === 1 ? "#FFF" : "#686f78ff"}
                        fontSize={{ xs: "0.8rem", md: "1rem" }}
                      >
                        Projects I Requested
                      </Typography>
                      <Typography
                        variant="body2"
                        color={value === 1 ? "#FFF" : "#686f78ff"}
                        fontSize={{ xs: "0.65rem", md: "0.875rem" }}
                        sx={{ display: { xs: "none", sm: "block" } }}
                      >
                        Services I need from others
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={clientStats.total || 0}
                    size="small"
                    sx={{
                      bgcolor:
                        value === 1
                          ? "rgba(255, 255, 255, 0.4)"
                          : "rgba(100, 180, 207, 0.2)",
                      color: value === 1 ? "#FFF" : "#3b82f6",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      px: 1,
                      height: { xs: "24px", md: "auto" },
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {value === 0 && (
          <ProviderDashboard
            data={providerData}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRefresh={handleRefresh}
            highlightedRequestId={highlightedRequestId}
            initialShowRequests={showRequestsFromNotif}
          />
        )}

        {value === 1 && (
          <ClientDashboard
            data={clientData}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onRefresh={handleRefresh}
            highlightedRequestId={highlightedRequestId}
            initialShowRequests={showRequestsFromNotif}
          />
        )}
      </Container>
    </Box>
  );
}