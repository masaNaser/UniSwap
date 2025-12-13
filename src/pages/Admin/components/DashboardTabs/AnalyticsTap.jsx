import React, { useState, useEffect } from "react";
import { Analytics } from "../../../../services/adminService";
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

export default function AnalyticsTap() {
  const token = localStorage.getItem("accessToken");
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const { data } = await Analytics(token);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analytics) return <div style={{ padding: 20 }}>Loading...</div>;

  // Prepare data for Recharts
  const majorData = Object.entries(analytics.usersByMajor).map(
    ([major, count]) => ({
      name: major,
      value: count,
    })
  );

  const academicData = Object.entries(analytics.usersByAcademicYear).map(
    ([year, count]) => ({
      year,
      count,
    })
  );

  const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"];

  // Custom label that only shows percentage
  const renderCustomLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard Analytics</h2>

      {/* KPI Cards */}
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <h3>New Users This Month</h3>
          <p style={styles.number}>{analytics.newUsersThisMonth}</p>
        </div>

        <div style={styles.card}>
          <h3>Pending Requests</h3>
          <p style={styles.number}>{analytics.pendingCollaborationRequests}</p>
        </div>

        <div style={styles.card}>
          <h3>Published Projects</h3>
          <p style={styles.number}>{analytics.publishedProjects}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsRow}>

        {/* Pie Chart */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Users by Major</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={majorData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomLabel}
              >
                {majorData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={60}
                wrapperStyle={{ fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Users by Academic Year</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={academicData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4e79a7" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: 30,
    fontFamily: "sans-serif",
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
  },
  cardsContainer: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  card: {
    flex: "1",
    minWidth: 200,
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  number: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  chartsRow: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },
  chartBox: {
    flex: "1",
    minWidth: 300,
    height: 350,
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  chartTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "600",
  },
};