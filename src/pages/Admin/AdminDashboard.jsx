// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery
} from "@mui/material";

import {
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { GetDashboard } from "../../services/adminService";
import SelectActionCard from "../../components/Cards/Cards";
import UsersTap from "./components/DashboardTabs/UsersTap";
import ReportsTap from "./components/DashboardTabs/ReportsTap";
import AnalyticsTap from "./components/DashboardTabs/AnalyticsTap";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem("userName");
  const [currentTab, setCurrentTab] = useState(0);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await GetDashboard(token);
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError("فشل تحميل البيانات");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // -----------------------
  // Responsive (⋮) Menu Logic
  // -----------------------
  const isMobile = useMediaQuery("(max-width:618px)");
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // -----------------------

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
            <Typography variant="body1" color="text.secondary">Welcome back, {userName}</Typography>
          </Box>

          {/* -------------------------
              Responsive Actions Here
          -------------------------- */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            
            {/* Desktop Buttons */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 3 }}>
                <CustomButton variant="outlined" onClick={handleLogout}>
                  <LogoutIcon sx={{ marginRight: 2 }} />
                  Sign out
                </CustomButton>

                <CustomButton
                  variant="contained"
                  onClick={() => navigate("/app/browse")}
                >
                  Go to Browse
                </CustomButton>
              </Box>
            )}

            {/* Mobile menu */}
            {isMobile && (
              <>
                <IconButton onClick={openMenu}>
                  <MoreVertIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      navigate("/app/browse");
                    }}
                  >
                    Go to Browse
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* STATS CARDS */}
        <div className="cards-section">
          <SelectActionCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ fontSize: 28, color: "#1976d2" }} />}
            iconBgColor="#e3f2fd"
          />

          <SelectActionCard
            title="Active Services"
            value={stats.services}
            icon={<BusinessCenterIcon sx={{ fontSize: 28, color: "#2e7d32" }} />}
            iconBgColor="#e8f5e9"
          />

          <SelectActionCard
            title="Total Points Awarded"
            value={stats.totalPointsAwarded}
            icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 28, color: "#ed6c02" }} />}
            iconBgColor="#fff3e0"
          />

          <SelectActionCard
            title="Reports Pending"
            value={stats.pendingReports}
            icon={<WarningIcon sx={{ fontSize: 28, color: "#d32f2f" }} />}
            iconBgColor="#ffebee"
          />
        </div>

        {/* TABS */}
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ borderRadius: 3, m: 4, width: "fit-content", maxWidth: "100%", overflowX: "auto", whiteSpace: "nowrap", mx: "auto" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              TabIndicatorProps={{ style: { display: "none" } }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 48, px: 10 }}
            >
              {["Users", "Reports", "Analytics"].map((label, index) => (
                <Tab
                  key={label}
                  label={label}
                  sx={{
                    textTransform: "none",
                    minWidth: "auto",
                    marginRight: 40,
                    fontWeight: currentTab === index ? "bold" : "normal",
                    fontSize: "16px",
                    background: currentTab === index
                      ? "linear-gradient(to right, rgba(2, 132, 199, 0.8), rgba(152, 16, 250, 0.8))"
                      : "none",
                    WebkitBackgroundClip: currentTab === index ? "text" : "none",
                    WebkitTextFillColor: currentTab === index ? "transparent" : "black",
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          {/* TAB CONTENT */}
          {currentTab === 0 && <UsersTap />}
          {currentTab === 1 && <ReportsTap onReportReviewed={fetchStats} />}
          {currentTab === 2 && <AnalyticsTap />}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
