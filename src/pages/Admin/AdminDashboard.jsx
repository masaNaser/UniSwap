import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery,
  Divider,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Explore as ExploreIcon,
} from "@mui/icons-material";
import Logo from "/logo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import UsersTap from "./components/DashboardTabs/UsersTap";
import ReportsTap from "./components/DashboardTabs/ReportsTap";
import AnalyticsTap from "./components/DashboardTabs/Analytics/AnalyticsTap";
import { logout } from "../../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserName } from "../../utils/authHelpers";
 import { useTheme } from "@mui/material/styles";

const AdminDashboard = () => {
  const theme = useTheme();
  const userName = getUserName();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const reportIdParam = searchParams.get("reportId");
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:768px)");

  // دالة تحديد التاب الابتدائي
  const getInitialTab = () => {
    if (tabParam === "reports") return 2;
    if (tabParam === "users") return 1;
    return 0;
  };

  const [currentTab, setCurrentTab] = useState(getInitialTab);

  // تحديث التاب عند تغيير الـ URL
  useEffect(() => {
    setCurrentTab(getInitialTab());
  }, [tabParam]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // مصفوفة التابس
  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, index: 0 },
    { label: "Users", icon: <PersonIcon />, index: 1 },
    { label: "Reports", icon: <AssessmentIcon />, index: 2 },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor:
                    theme.palette.mode === "dark"
                      ? "#323232ff"
                      : "rgba(248, 250, 252, 1)", }}>
      
      {/* SIDEBAR */}
      <Paper
        elevation={0}
        sx={{
          width: isMobile ? 80 : 230,
          bgcolor: "white",
          borderRight: "1px solid ",
          borderRightColor:
                    theme.palette.mode === "dark"
                      ? "#424242"
                      : "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100vh",
          transition: "width 0.3s ease",
          zIndex: 1200,
          bgcolor:
                    theme.palette.mode === "dark"
                      ? "#323232ff"
                      : "rgba(248, 250, 252, 1)",
        }}
      >
        {/* LOGO SECTION */}
        <Box sx={{ p: isMobile ? 2 : 3, display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Box component="img" src={Logo} alt="Logo" sx={{ width: isMobile ? 40 : 35, height: "auto", objectFit: "contain" }} />
          </Box>
          {!isMobile && (
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#74767a", whiteSpace: "nowrap", letterSpacing: "-0.5px" }}>
              UniSwap
            </Typography>
          )}
        </Box>

        <Divider sx={{ mx: 2, mb: 2 }} />

        {/* NAVIGATION TABS */}
        <Tabs
          orientation="vertical"
          value={currentTab}
          onChange={handleTabChange}
          sx={{ 
    flexGrow: 1, 
    px: 1, 
    "& .MuiTabs-flexContainer": { alignItems: "stretch" },
    "& .MuiTabs-indicator": { display: "none" } // إخفاء المؤشر هنا يمنع التحذيرات
  }}
        >
          {menuItems.map((item) => (
            <Tab
              key={item.label}
              icon={item.icon}
              iconPosition={isMobile ? "top" : "start"}
              label={isMobile ? "" : item.label}
              disableRipple
              sx={{
                textTransform: "none",
                justifyContent: isMobile ? "center" : "flex-start",
                minHeight: 50,
                borderRadius: 2,
                mb: 1,
                color: "#64748b",
                "&.Mui-selected": { bgcolor:
                    theme.palette.mode === "dark"
                      ? "#323232ff"
                      : "#f0f9ff", color: "#0284c7", fontWeight: "bold" },
                "& .MuiSvgIcon-root": { marginRight: isMobile ? 0 : "12px !important", fontSize: 24 }
              }}
            />
          ))}

          <Box sx={{ px: 1, mt: 1 }}>
            <IconButton  onClick={() => navigate("/app/browse")} sx={{ width: "100%", borderRadius: 2, p: 1.5, justifyContent: isMobile ? "center" : "flex-start", color: "#0f172a", "&:hover": { bgcolor: "#f1f5f9" } }}>
              <ExploreIcon sx={{ mr: isMobile ? 0 : 1.5 ,color: "#64748b",}} />
              {!isMobile && <Typography variant="body2" fontWeight="medium" 
              sx={{
                 color: "#64748b"
                 }}>
                  Go to Browse</Typography>}
            </IconButton>
          </Box>
        </Tabs>

        {/* LOGOUT */}
        <Box sx={{ p: 2, mt: "auto" }}>
          <IconButton onClick={() => { logout(); navigate("/login"); }} sx={{ width: "100%", borderRadius: 2, color: "#ef4444", justifyContent: isMobile ? "center" : "flex-start", "&:hover": { bgcolor: "#fef2f2" } }}>
            <LogoutIcon sx={{ mr: isMobile ? 0 : 1.5 }} />
            {!isMobile && <Typography variant="body2" fontWeight="medium">Logout</Typography>}
          </IconButton>
        </Box>
      </Paper>

      {/* MAIN CONTENT Area */}
      <Box component="main" sx={{ 
        flexGrow: 1,
         p: { xs: 2, md: 4 }, 
         ml: isMobile ? "80px" : "260px",
         width: isMobile ? "calc(100% - 80px)" : `calc(100% - 260px)`,
         transition: "margin 0.3s ease" }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.mode === "dark" ? "#f0f9ff" : "#1e293b" }}>Admin Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">Welcome back, {userName}</Typography>
        </Box>

        <Box>
          {currentTab === 0 && <AnalyticsTap />}
          {currentTab === 1 && <UsersTap />}
          {currentTab === 2 && <ReportsTap highlightedReportId={reportIdParam} />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;