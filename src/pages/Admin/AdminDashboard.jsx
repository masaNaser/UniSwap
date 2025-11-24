// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  CircularProgress,
  Alert 
} from '@mui/material';
import {
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  EmojiEvents as EmojiEventsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { GetDashboard } from '../../services/api/adminApi';
import StatsCard from '../../components/admin/dashboard/StatsCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await GetDashboard(token);
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, John Doe
          </Typography>
        </Box>

        {/* Stats Cards Grid */}
        <Grid container spacing={3}>
          {/* Total Users */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<PeopleIcon />}
              iconColor="#1976d2"
              iconBgColor="#e3f2fd"
            />
          </Grid>

          {/* Active Services */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Services"
              value={stats.services}
              icon={<BusinessCenterIcon />}
              iconColor="#2e7d32"
              iconBgColor="#e8f5e9"
            />
          </Grid>

          {/* Total Points Awarded */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Points Awarded"
              value={stats.totalPointsAwarded}
              icon={<EmojiEventsIcon />}
              iconColor="#ed6c02"
              iconBgColor="#fff3e0"
            />
          </Grid>

          {/* Reports Pending */}
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Reports Pending"
              value={stats.pendingReports}
              icon={<WarningIcon />}
              iconColor="#d32f2f"
              iconBgColor="#ffebee"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;