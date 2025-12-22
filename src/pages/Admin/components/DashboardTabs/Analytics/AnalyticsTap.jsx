import { Analytics, GetDashboard } from "../../../../../services/adminService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SelectActionCard from "../../../../../components/Cards/Cards";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ActiveProject from "./ActiveProject";

export default function AnalyticsTap() {
  const token = localStorage.getItem("accessToken");
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
  try {
  const analyticsRes = await Analytics(token);
  console.log("Analytics:", analyticsRes.data);
  const statsRes = await GetDashboard(token);
  console.log("Stats:", statsRes.data);
} catch(err) {
  console.error(err.response || err);
  setError("فشل تحميل البيانات");
}
finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  if (!analytics || !stats) return null;

  const majorData = Object.entries(analytics.usersByMajor || {}).map(
    ([name, value]) => ({ name, value })
  );
  const academicData = (() => {
    const yearLabels = {
      "0": "First Year",
      "1": "Second Year",
      "2": "Third Year",
      "3": "Fourth Year",
      "4": "Other"
    };

    return Object.entries(analytics.usersByAcademicYear || {})
      .map(([year, count]) => ({
        year: yearLabels[year] || year,
        count
      }))
      .sort((a, b) => {
        // Sort by the original numeric order
        const order = ["First Year", "Second Year", "Third Year", "Fourth Year", "Other"];
        return order.indexOf(a.year) - order.indexOf(b.year);
      });
  })();
  // لوحة ألوان واسعة جداً لتغطية أي عدد من التخصصات
  const COLORS = [
    "#4e79a7",
    "#f28e2b",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc948",
    "#b07aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ac",
    "#204a7d",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#aec7e8",
    "#ffbb78",
    "#98df8a",
    "#ff9896",
  ];

  const renderCustomLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <>
      <Box
        sx={{
          // padding: { xs: "10px", md: "10px 30px" },
          fontFamily: "sans-serif",
        }}
      >
        {/* STATS CARDS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
            mb: 5,
          }}
        >
          <SelectActionCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            iconBgColor="#e0f2fe"
          />
          <SelectActionCard
            title="Active Services"
            value={stats.services}
            icon={<BusinessCenterIcon />}
            iconBgColor="#dcfce7"
          />
          <SelectActionCard
            title="Total Points"
            value={stats.totalPointsAwarded}
            icon={<WorkspacePremiumOutlinedIcon />}
            iconBgColor="#fef3c7"
          />
          <SelectActionCard
            title="Reports Pending"
            value={stats.pendingReports}
            icon={<WarningIcon />}
            iconBgColor="#fee2e2"
          />
        </Box>
        <Box sx={{ mb: 3 }}><ActiveProject /></Box>
        {/* Charts Row */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {/* Pie Chart - Major Distribution */}
          <Box
            sx={{
              flex: "1 1 450px",
              bgcolor: "#fff",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              minHeight: "500px", // طول ثابت يضمن عدم خروج الأسماء
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={2}>
              Major Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={majorData}
                    cx="50%"
                    cy="40%" // رفعنا الدائرة للأعلى قليلاً
                    outerRadius={80}
                    dataKey="value"
                    label={renderCustomLabel}
                  >
                    {majorData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "20px",
                      maxHeight: "150px", // تحديد أقصى ارتفاع للأسماء
                      overflowY: "auto", // تفعيل السكرول إذا زاد العدد
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Bar Chart - Academic Year */}
          <Box
            sx={{
              flex: "1 1 450px",
              bgcolor: "#fff",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              minHeight: "500px",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={2}>
              Academic Year Progress
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={academicData} margin={{ bottom: 20 }}>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="count"
                  fill="#4e79a7"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
}