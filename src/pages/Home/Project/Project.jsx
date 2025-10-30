import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Grid,
} from "@mui/material";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useState, useEffect } from "react";
import ProjectHeader from "./ProjectHeader";
import StatCard from "./StatsSection";
import FilterSection from "../../../components/Filter/FilterSection";
import AllStatusProjectCard from "../../../components/Cards/AllStatusProjectCard";
import RequestProjectCard from "../../../components/Cards/RequestProjectCard";
import {
  getClientdashboard,
  getServiceProviderDashboard,
  getDashboard,
} from "../../../services/projectService";

export default function Project() {
  const [value, setValue] = useState(0);
  const [providerData, setProviderData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequests, setShowRequests] = useState(false);

  const token = localStorage.getItem("accessToken");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // MOCK DATA
  const mockProviderProjects = [
    {
      id: 1,
      status: "Active",
      title: "E-commerce Website Development",
      description:
        "Build a modern e-commerce platform with React and Node.js including payment integration and admin panel.",
      clientInitials: "SC",
      clientName: "Sarah Chen",
      clientRole: "Client",
      clientTime: "2 hours ago",
      dueDate: "2/15/2024",
      category: "Web Development",
    },
    {
      id: 2,
      status: "Pending",
      title: "Mobile App UI/UX Design",
      description:
        "Create a beautiful and intuitive mobile app design for a fitness tracking application.",
      clientInitials: "MJ",
      clientName: "Michael Johnson",
      clientRole: "Client",
      clientTime: "5 hours ago",
      dueDate: "2/20/2024",
      category: "Design",
    },
    {
      id: 3,
      status: "Completed",
      title: "Data Analysis Project",
      description:
        "Analyze sales data and create comprehensive reports with insights and recommendations.",
      clientInitials: "EW",
      clientName: "Emma Wilson",
      clientRole: "Client",
      clientTime: "1 day ago",
      dueDate: "2/10/2024",
      category: "Data Science",
    },
    {
      id: 4,
      status: "Overdue",
      title: "Content Writing for Blog",
      description:
        "Write 10 SEO-optimized blog posts about digital marketing strategies and trends.",
      clientInitials: "DL",
      clientName: "David Lee",
      clientRole: "Client",
      clientTime: "3 days ago",
      dueDate: "2/5/2024",
      category: "Content Writing",
    },
    {
      id: 5,
      status: "Active",
      title: "Social Media Campaign",
      description:
        "Plan and execute a comprehensive social media marketing campaign.",
      clientInitials: "RP",
      clientName: "Rachel Park",
      clientRole: "Client",
      clientTime: "6 hours ago",
      dueDate: "2/18/2024",
      category: "Marketing",
    },
  ];

  const mockClientProjects = [
    {
      id: 6,
      status: "Active",
      title: "Logo Design for Startup",
      description:
        "Need a professional logo design for a new tech startup company.",
      clientInitials: "JD",
      clientName: "John Doe",
      clientRole: "Provider",
      clientTime: "1 hour ago",
      dueDate: "2/25/2024",
      category: "Graphic Design",
    },
    {
      id: 7,
      status: "Completed",
      title: "Website Redesign",
      description: "Complete redesign of company website with modern UI/UX.",
      clientInitials: "AS",
      clientName: "Anna Smith",
      clientRole: "Provider",
      clientTime: "2 days ago",
      dueDate: "2/8/2024",
      category: "Web Design",
    },
    {
      id: 8,
      status: "Pending",
      title: "SEO Optimization",
      description:
        "Optimize website for search engines and improve ranking.",
      clientInitials: "BP",
      clientName: "Brian Powell",
      clientRole: "Provider",
      clientTime: "4 hours ago",
      dueDate: "2/22/2024",
      category: "Marketing",
    },
  ];

  useEffect(() => {
    fetchProjectsData();
  }, [token, statusFilter, value]);

  const fetchProjectsData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (value === 0) {
        const providerResponse = await getServiceProviderDashboard(
          token,
          "provider",
          statusFilter
        );
        setProviderData(providerResponse.data);
      } else {
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

  const fetchPendingRequests = async () => {
    try {
      setLoadingRequests(true);

      // جلب الـ Requests حسب الـ view (Provider أو Client)
      const view = value === 0 ? "Provider" : "client";
      const response = await getDashboard(token, view, "Pending");

      setPendingRequests(response.data.projects || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleRequestsClick = () => {
    setShowRequests((prev) => !prev);

    // إذا بدك تفتح الـ Requests، اجلبهم
    if (!showRequests) {
      fetchPendingRequests();
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setShowRequests(false);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleStatusSelect = (value) => {
    setStatusFilter(value);
    setShowRequests(false);
  };

  const calculateProgress = (value, total) =>
    total === 0 ? 0 : (value / total) * 100;

  const filterProviderProjects = () => {
    if (showRequests) {
      return mockProviderProjects.filter((p) => p.status === "Pending");
    }
    return mockProviderProjects.filter((project) => {
      const matchesStatus =
        statusFilter === "All Status" || project.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch && project.status !== "Pending";
    });
  };

  const filterClientProjects = () => {
    if (showRequests) {
      return mockClientProjects.filter((p) => p.status === "Pending");
    }
    return mockClientProjects.filter((project) => {
      const matchesStatus =
        statusFilter === "All Status" || project.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch && project.status !== "Pending";
    });
  };

  const filteredProviderProjects = filterProviderProjects();
  const filteredClientProjects = filterClientProjects();

  const providerStats = providerData?.summary || {};
  const clientStats = clientData?.summary || {};

  const filterItems = [
    {
      type: "menu",
      label: statusFilter,
      items: [
        { label: "All Status", value: "All Status" },
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
                  justifyContent="center"
                  gap={8}
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
                    <Box display="flex" flexDirection="column">
                      <Typography
                        fontWeight="bold"
                        color={value === 0 ? "#FFF" : "#686f78ff"}
                      >
                        Projects I'm Working On
                      </Typography>
                      <Typography
                        variant="body2"
                        color={value === 0 ? "#FFF" : "#686f78ff"}
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
                    <Box display="flex" flexDirection="column">
                      <Typography
                        fontWeight="bold"
                        color={value === 1 ? "#FFF" : "#686f78ff"}
                      >
                        Projects I Requested
                      </Typography>
                      <Typography
                        variant="body2"
                        color={value === 1 ? "#FFF" : "#686f78ff"}
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
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Provider Section */}
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

            <Box sx={{ mt: 5 }}>
              <FilterSection
                searchPlaceholder="Search projects..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                items={filterItems}
              />
            </Box>

            <Box sx={{ mt: 4, mb: 10 }}>
              {loadingRequests ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : showRequests ? (
                pendingRequests.length > 0 ? (
                  <Grid container spacing={3}>
                    {pendingRequests.map((request) => (
                      <Grid item xs={12} sm={6} lg={4} key={request.id}>
                        <RequestProjectCard
                          {...request}
                          isProvider={true}
                          onRequestHandled={fetchPendingRequests}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    textAlign="center"
                    py={8}
                    bgcolor="#f9fafb"
                    borderRadius={2}
                  >
                    <Typography variant="h6" color="text.secondary">
                      No pending requests found
                    </Typography>
                  </Box>
                )
              ) : filteredProviderProjects.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredProviderProjects.map((project) => (
                    <Grid item xs={12} sm={6} lg={4} key={project.id}>
                      <AllStatusProjectCard {...project} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  textAlign="center"
                  py={8}
                  bgcolor="#f9fafb"
                  borderRadius={2}
                >
                  <Typography variant="h6" color="text.secondary">
                    No projects found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Try adjusting your filters or search query
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Client Section */}
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
                progress={calculateProgress(
                  clientStats.active,
                  clientStats.total
                )}
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
                progress={calculateProgress(
                  clientStats.completed,
                  clientStats.total
                )}
              />
              <StatCard
                value={clientStats.overdue || 0}
                label="Overdue"
                color="#DC2626"
                progress={calculateProgress(
                  clientStats.overdue,
                  clientStats.total
                )}
              />
            </Box>

            <Box sx={{ mt: 5 }}>
              <FilterSection
                searchPlaceholder="Search projects..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                items={filterItems}
              />
            </Box>

            <Box sx={{ mt: 4, mb: 10 }}>
              {loadingRequests ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : showRequests ? (
                pendingRequests.length > 0 ? (
                  <Grid container spacing={3}>
                    {pendingRequests.map((request) => (
                      <Grid item xs={12} sm={6} lg={4} key={request.id}>
                        <RequestProjectCard
                          {...request}
                          isProvider={false}
                          onRequestHandled={fetchPendingRequests}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    textAlign="center"
                    py={8}
                    bgcolor="#f9fafb"
                    borderRadius={2}
                  >
                    <Typography variant="h6" color="text.secondary">
                      No pending requests found
                    </Typography>
                  </Box>
                )
              ) : filteredClientProjects.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredClientProjects.map((project) => (
                    <Grid item xs={12} sm={6} lg={4} key={project.id}>
                      <AllStatusProjectCard {...project} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  textAlign="center"
                  py={8}
                  bgcolor="#f9fafb"
                  borderRadius={2}
                >
                  <Typography variant="h6" color="text.secondary">
                    No projects found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Try adjusting your filters or search query
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}