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
  Paper,
  Button 
} from "@mui/material";
import {
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { GetDashboard } from "../../services/adminService";
import SelectActionCard from "../../components/Cards/Cards";
import UsersTap from "./components/DashboardTabs/UsersTap";
import ReportsTap from "./components/DashboardTabs/ReportsTap";
import AnalyticsTap from "./components/DashboardTabs/AnalyticsTap";
import { logout } from "../../services/authService"; // ✅ استيراد دالة logout
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
    logout();            // ✅ مسح بيانات الجلسة
    navigate("/login")
  };


  // ✅ دالة لجلب الـ stats (خارج useEffect عشان نقدر نستدعيها من أي مكان)
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await GetDashboard(token);
      console.log("dash :", response);
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
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
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {userName}
            </Typography>
          </Box>
          <CustomButton variant="outlined"  onClick={handleLogout}>
            <LogoutIcon sx={{marginRight:2}} />
            Logout
          </CustomButton>
           {/* <Button variant="contained" color="primary" onClick={() => navigate("/app/feed")}>
    Go to Feed
  </Button> */}
        </Box>

        {/* Stats Cards Grid */}
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
            icon={
              <BusinessCenterIcon sx={{ fontSize: 28, color: "#2e7d32" }} />
            }
            iconBgColor="#e8f5e9"
          />

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

          {/* ✅ العداد هاد رح يتحدث تلقائي لما نستدعي fetchStats */}
          <SelectActionCard
            title="Reports Pending"
            value={stats.pendingReports}
            icon={<WarningIcon sx={{ fontSize: 28, color: "#d32f2f" }} />}
            iconBgColor="#ffebee"
          />
        </div>

        <Box sx={{ mt: 3 }}>
          {/* الأزرار */}
          <Paper
            sx={{
              borderRadius: 3,
              m: 4,
              width: "fit-content",
              // , // ياخد قد التابس فقط
              maxWidth: "100%", // ما يتجاوز عرض الشاشة
              overflowX: "auto", // يعمل scroll لو صار أعرض من الشاشة
              whiteSpace: "nowrap", // يمنع التابس من النزول تحت بعض
               mx: "auto"        
              //         // يخليها بالنص
            }}
          >
            <Tabs
              value={currentTab}
              onChange={(e, v) => setCurrentTab(v)}
              TabIndicatorProps={{ style: { display: "none"} }}
              variant="scrollable" // يخلي التابس قابلة للتمرير
              scrollButtons="auto" // يظهر أزرار التمرير تلقائيًا
              sx={{
                minHeight: 48, // ارتفاع ثابت ومرتب
                px:10
              }}
            >
              {["Users", "Reports", "Analytics"].map((label, index) => (
                <Tab
                  key={label}
                  label={label}
                  sx={{
                    textTransform: "none",
                    minWidth: "auto", // هذا أهم سطر لحل المشكلة
                    marginRight:40,
                    fontWeight: currentTab === index ? "bold" : "normal",
                    fontSize: "16px",
                    background:
                      currentTab === index
                        ? "linear-gradient(to right, rgba(2, 132, 199, 0.8), rgba(152, 16, 250, 0.8))"
                        : "none",
                    WebkitBackgroundClip:
                      currentTab === index ? "text" : "none",
                    WebkitTextFillColor:
                      currentTab === index ? "transparent" : "black",
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          {/* المحتوى */}
          {currentTab === 0 && <UsersTap />}

          {/* {currentTab === 1 && <Box>Services Content - قريباً</Box>} */}

          {/* ✅ مررنا دالة fetchStats للـ ReportsTab */}
          {currentTab === 1 && <ReportsTap onReportReviewed={fetchStats} />}

          {currentTab === 2 && <AnalyticsTap />}
          {/* {currentTab === 3 && <AchievementsTab />} */}
        </Box>

        {/* 📑 Tabs - ثابتة */}
        {/* <Box sx={{ bgcolor: "white", borderRadius: 2, mb: 3, mt: 5 }}>
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
        </Box> */}
        {/* 🔄 محتوى الـ Tab - متغير */}
        {/* <Box>
          {currentTab === 0 && <UsersTap />}

          * {currentTab === 1 && <Box>Services Content - قريباً</Box>} 

          {/* ✅ مررنا دالة fetchStats للـ ReportsTab */}
        {/* {currentTab === 1 && <ReportsTap onReportReviewed={fetchStats} />}

          {currentTab === 2 && <AnalyticsTap />}
        </Box> */}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
