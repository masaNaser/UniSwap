
// import React, { useState, useEffect } from "react";
// import { Analytics } from "../../../../services/adminService";

// export default function AnalyticsTap() {
//     const token = localStorage.getItem("accessToken");
//     const [loading, setLoading] = useState(false);
//     const [analytics, setAnalytics] = useState([]);
//     const [error, setError] = useState(null);

//       const fetchUsers = async () => {
//         try {
//           setLoading(true);
//           setError(null);
//           const { data } = await Analytics(token);
//           // setUsers(data);
//           console.log("Analytics :", data);
//         } catch (err) {
//           console.error(err);
//           setError("Failed to load users");
//         } finally {
//           setLoading(false);
//         }
//       };
    
//       useEffect(() => {
//         fetchUsers();
//       }, []);
//   return (
//     <div>AnalyticsTap</div>
//   )
// }

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from "recharts";

const COLORS = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#f5576c", "#feca57"];

export default function AnalyticsTap() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - Replace with your actual API
      // const token = localStorage.getItem("accessToken");
      // const { data } = await Analytics(token);
      
      // Mock data for demonstration
      const data = {
        newUsersThisMonth: 5,
        usersByMajor: { CS: 1, CSE: 3 },
        usersByAcademicYear: { Thirdyear: 1, another: 3 },
        pendingCollaborationRequests: 1,
        publishedProjects: 0
      };
      
      setAnalytics(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "4px solid rgba(255,255,255,0.3)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ color: "white", fontSize: "18px", marginTop: "20px", fontWeight: 500 }}>
          Loading analytics...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={{ padding: "24px" }}>
        <div style={{
          backgroundColor: "#ffebee",
          border: "2px solid #ef5350",
          borderRadius: "12px",
          padding: "20px",
          color: "#c62828",
          fontSize: "16px"
        }}>
          {error || "No data available"}
        </div>
      </div>
    );
  }

  const totalUsers = Object.values(analytics.usersByMajor || {}).reduce((a, b) => a + b, 0);

  // Prepare data for Pie Chart (Majors)
  const majorChartData = Object.entries(analytics.usersByMajor || {}).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalUsers) * 100).toFixed(1)
  }));

  // Prepare data for Bar Chart (Academic Years)
  const academicChartData = Object.entries(analytics.usersByAcademicYear || {}).map(([name, value]) => ({
    name: name.replace("year", " Year").replace("another", "Other"),
    students: value
  }));

  // Prepare data for Radar Chart
  const radarData = Object.entries(analytics.usersByMajor || {}).map(([subject, value]) => ({
    subject,
    value,
    fullMark: Math.max(...Object.values(analytics.usersByMajor || {})) + 2
  }));

  const statsCards = [
    {
      title: "New Users",
      value: analytics.newUsersThisMonth || 0,
      subtitle: "This Month",
      icon: "👥",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shadowColor: "rgba(102, 126, 234, 0.3)"
    },
    {
      title: "Published Projects",
      value: analytics.publishedProjects || 0,
      subtitle: "Total Active",
      icon: "📚",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      shadowColor: "rgba(240, 147, 251, 0.3)"
    },
    {
      title: "Pending Requests",
      value: analytics.pendingCollaborationRequests || 0,
      subtitle: "Awaiting Review",
      icon: "🤝",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      shadowColor: "rgba(79, 172, 254, 0.3)"
    },
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "All Majors",
      icon: "📈",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      shadowColor: "rgba(67, 233, 123, 0.3)"
    }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "16px", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{
      padding: "32px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: 800,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "10px"
        }}>
          Analytics Dashboard
        </h1>
        <p style={{ fontSize: "20px", color: "#666", fontWeight: 400 }}>
          Real-time insights with interactive charts
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        {statsCards.map((stat, index) => (
          <div
            key={index}
            style={{
              background: stat.gradient,
              color: "white",
              borderRadius: "16px",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 10px 30px ${stat.shadowColor}`,
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 20px 50px ${stat.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 10px 30px ${stat.shadowColor}`;
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              transform: "translate(50%, -50%)"
            }}></div>
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px"
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.3)",
                  padding: "6px 16px",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  fontSize: "14px",
                  fontWeight: 700
                }}>
                  +12%
                </div>
              </div>
              <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px", fontWeight: 500 }}>
                {stat.title}
              </p>
              <h2 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "4px", margin: 0 }}>
                {stat.value.toLocaleString()}
              </h2>
              <p style={{ fontSize: "12px", opacity: 0.8, fontWeight: 500, margin: 0 }}>
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
        gap: "24px"
      }}>
        {/* PIE CHART - Users by Major */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          transition: "all 0.3s"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#667eea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🎓
            </div>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#212121", margin: 0 }}>
                Users by Major
              </h3>
              <p style={{ fontSize: "14px", color: "#757575", margin: "4px 0 0 0" }}>
                Distribution across departments
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={majorChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {majorChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  padding: "12px"
                }}
                formatter={(value, name, props) => [
                  `${value} students (${props.payload.percentage}%)`,
                  name
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
                formatter={(value, entry) => (
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {value}: <strong>{entry.payload.value}</strong> ({entry.payload.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART - Users by Academic Year */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          transition: "all 0.3s"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#f093fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              📊
            </div>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#212121", margin: 0 }}>
                Academic Year Distribution
              </h3>
              <p style={{ fontSize: "14px", color: "#757575", margin: "4px 0 0 0" }}>
                Students across different years
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={academicChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#666", fontSize: 13 }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 13 }}
                axisLine={{ stroke: "#e0e0e0" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  padding: "12px"
                }}
                cursor={{ fill: "rgba(102, 126, 234, 0.1)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar
                dataKey="students"
                fill="url(#colorGradient)"
                radius={[10, 10, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RADAR CHART - Majors Comparison */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          transition: "all 0.3s"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#43e97b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🎯
            </div>
            <div>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#212121", margin: 0 }}>
                Majors Comparison
              </h3>
              <p style={{ fontSize: "14px", color: "#757575", margin: "4px 0 0 0" }}>
                Radar view of department distribution
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 13 }} />
              <PolarRadiusAxis angle={90} domain={[0, "dataMax"]} tick={{ fill: "#666" }} />
              <Radar
                name="Students"
                dataKey="value"
                stroke="#43e97b"
                fill="#43e97b"
                fillOpacity={0.6}
                animationBegin={0}
                animationDuration={800}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  padding: "12px"
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Summary */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#212121", marginBottom: "24px" }}>
            Platform Activity Summary
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              padding: "24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              color: "white",
              transition: "all 0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "40px" }}>👥</span>
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                      New Registrations
                    </h4>
                    <p style={{ fontSize: "14px", opacity: 0.9, margin: "4px 0 0 0" }}>
                      Users joined this month
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "48px", fontWeight: 800 }}>
                  {analytics.newUsersThisMonth}
                </span>
              </div>
            </div>

            <div style={{
              padding: "24px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              borderRadius: "12px",
              color: "white",
              transition: "all 0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(240, 147, 251, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "40px" }}>📚</span>
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                      Active Projects
                    </h4>
                    <p style={{ fontSize: "14px", opacity: 0.9, margin: "4px 0 0 0" }}>
                      Currently published
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "48px", fontWeight: 800 }}>
                  {analytics.publishedProjects}
                </span>
              </div>
            </div>

            <div style={{
              padding: "24px",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              borderRadius: "12px",
              color: "white",
              transition: "all 0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(79, 172, 254, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "40px" }}>🤝</span>
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>
                      Pending Requests
                    </h4>
                    <p style={{ fontSize: "14px", opacity: 0.9, margin: "4px 0 0 0" }}>
                      Awaiting approval
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: "48px", fontWeight: 800 }}>
                  {analytics.pendingCollaborationRequests}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}