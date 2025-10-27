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
import ProjectHeader from "./ProjectHeader";
import StatCard from "./StatsSection";
import FilterSection from "../../../components/Filter/FilterSection";
import {
  getClientdashboard,
  getServiceProviderDashboard,
} from "../../../services/projectService";

export default function Project() {
  const [value, setValue] = useState(0);
  const [providerData, setProviderData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data when tab or filter changes
  useEffect(() => {
    fetchProjectsData();
  }, [token, statusFilter, value]);

  const fetchProjectsData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (value === 0) {
        // Provider tab - fetch only provider data
        const providerResponse = await getServiceProviderDashboard(
          token,
          "provider",
          statusFilter
        );
        setProviderData(providerResponse.data);
      } else {
        // Client tab - fetch only client data
        const clientResponse = await getClientdashboard(
          token,
          "client",
          statusFilter
        );
        setClientData(clientResponse.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusSelect = (value) => {
    setStatusFilter(value);
  };

  const handleRequestsClick = () => {
    console.log("Requests button clicked");
    // Add your logic here
  };

  const calculateProgress = (value, total) =>
    total === 0 ? 0 : (value / total) * 100;

  if (loading) {
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
  }

  if (error) {
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
  }

  const providerStats = providerData?.summary || {};
  const clientStats = clientData?.summary || {};

  // Filter items for both tabs
  const filterItems = [
    {
      type: "menu",
      label: statusFilter,
      items: [
        { label: "Active", value: "Active" },
        { label: "Completed", value: "Completed" },
        { label: "Overdue", value: "Overdue" },
      ],
      onSelect: handleStatusSelect,
    },
    {
      type: "button",
      label: "Requests",
      onClick: handleRequestsClick,
    },
  ];

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
                color: "#686f78ff", // اللون الأساسي للـ Tab الغير محدد
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
                        color: value === 0 ? "#FFF" : "#686f78ff", // أيقونة تبع provider
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
                      color: value === 0 ? "#FFF" : "#3b82f6", // رقم أبيض لو selected وأزرق لو لا
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
                        color: value === 1 ? "#FFF" : "#686f78ff", // أيقونة تبع client
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

        {/* Provider Tab */}
        {value === 0 && (
          <>
            <ProjectHeader
              title="Services I'm Providing"
              status="Active Services"
              description="Projects where you're helping other students with your skills and expertise, building your reputation and earning points."
            />

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 5 }}>
              <StatCard
                value={providerStats.total || 0}
                label="Total Projects"
                color="#00c853"
                progress={100}
              />
              <StatCard
                value={providerStats.active || 0}
                label="Active"
                color="#059669"
                progress={calculateProgress(
                  providerStats.active,
                  providerStats.total
                )}
              />
              <StatCard
                value={providerStats.pendingRequests || 0}
                label="Pending"
                color="#F59E0B"
                progress={calculateProgress(
                  providerStats.pendingRequests,
                  providerStats.total
                )}
              />
              <StatCard
                value={providerStats.completed || 0}
                label="Completed"
                color="#0284C7"
                progress={calculateProgress(
                  providerStats.completed,
                  providerStats.total
                )}
              />
              <StatCard
                value={providerStats.overdue || 0}
                label="Overdue"
                color="#DC2626"
                progress={calculateProgress(
                  providerStats.overdue,
                  providerStats.total
                )}
              />
            </Box>

            <Box sx={{ mt: 5, width: "100%" }}>
              <FilterSection
                searchPlaceholder="Search projects..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                items={filterItems}
              />
            </Box>
          </>
        )}

        {/* Client Tab */}
        {value === 1 && (
          <>
            <ProjectHeader
              title="Services I'm Requesting"
              status="Requested Services"
              description="Projects where you're asking for help from others to learn, collaborate, or get tasks done."
            />

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 5 }}>
              <StatCard
                value={clientStats.total || 0}
                label="Total Requests"
                color="#00c853"
                progress={100}
              />
              <StatCard
                value={clientStats.active || 0}
                label="Active"
                color="#059669"
                progress={calculateProgress(clientStats.active, clientStats.total)}
              />
              <StatCard
                value={clientStats.pendingRequests || 0}
                label="Pending"
                color="#F59E0B"
                progress={calculateProgress(
                  clientStats.pendingRequests,
                  clientStats.total
                )}
              />
              <StatCard
                value={clientStats.completed || 0}
                label="Completed"
                color="#0284C7"
                progress={calculateProgress(clientStats.completed, clientStats.total)}
              />
              <StatCard
                value={clientStats.overdue || 0}
                label="Overdue"
                color="#DC2626"
                progress={calculateProgress(clientStats.overdue, clientStats.total)}
              />
            </Box>

            <Box sx={{ mt: 5, width: "100%" }}>
              <FilterSection
                searchPlaceholder="Search projects..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                items={filterItems}
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}