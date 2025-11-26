// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

import { GetDashboard } from "../../services/adminService";
import SelectActionCard from "../../components/Cards/Cards";
import UsersTap from "./components/DashboardTabs/UsersTap";
import ReportsTap from "./components/DashboardTabs/ReportsTap";
import AnalyticsTap from "./components/DashboardTabs/AnalyticsTap";
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem("userName");
  const [currentTab, setCurrentTab] = useState(0); // 👈 إدارة الـ Tabs

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await GetDashboard(token);
        console.log("dash :", response);
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
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
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {userName}
          </Typography>
        </Box>

        {/* Stats Cards Grid */}
        <div className="cards-section">
          <SelectActionCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ fontSize: 28, color: "#1976d2" }} />}
            iconBgColor="#e3f2fd"
          />

          {/* Active Services */}
          {/* <StatsCard
              title="Active Services"
              value={stats.services}
              icon={<BusinessCenterIcon />}
              iconColor="#2e7d32"
              iconBgColor="#e8f5e9"
            /> */}
          <SelectActionCard
            title="Active Services"
            value={stats.services}
            icon={
              <BusinessCenterIcon sx={{ fontSize: 28, color: "#2e7d32" }} />
            }
            iconBgColor="#e8f5e9"
          />

          {/* Total Points Awarded */}
          <SelectActionCard
            title="Total Points Awarded"
            value={stats.totalPointsAwarded}
            icon={
              <WorkspacePremiumOutlinedIcon
                sx={{ fontSize: 28, color: "#ed6c02" }}
              />
            }
            iconBgColor="#fff3e0"
          />

          {/* Reports Pending */}
          <SelectActionCard
            title="Reports Pending"
            value={stats.pendingReports}
            icon={<WarningIcon sx={{ fontSize: 28, color: "#d32f2f" }} />}
            iconBgColor="#ffebee"
          />
        </div>

        {/* 📑 Tabs - ثابتة */}
        <Box sx={{ bgcolor: "white", borderRadius: 2, mb: 3, mt:5 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Users" />
            <Tab label="Services" />
            <Tab label="Reports" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* 🔄 محتوى الـ Tab - متغير */}
        <Box>
          {/* {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                 <RecentActivity /> 
              </Grid>
              <Grid item xs={12} md={6}>
                <QuickStats stats={stats} /> 
              </Grid>
            </Grid>
          )} */}

          {currentTab === 0 && <UsersTap />}

          {currentTab === 1 && <Box>Services Content - قريباً</Box>}

          {currentTab === 2 && <ReportsTap />}

          {currentTab === 3 && <AnalyticsTap />}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
