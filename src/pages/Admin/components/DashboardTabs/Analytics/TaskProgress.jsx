import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Paper
} from '@mui/material';
import { taskProgress } from '../../../../../services/adminService';
import { getToken } from '../../../../../utils/authHelpers';

export default function TaskProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const response = await taskProgress(token);
        console.log("taskProgress", response);
        setData(response.data);
      } catch (err) {
        setError('Failed to load task progress');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!data) return null;

  const statusItems = [
    { 
      label: 'InProgress', 
      count: data.inProgress, 
      color: '#3b82f6' // blue
    },
    { 
      label: 'InReview', 
      count: data.upComing, 
      color: '#eab308' // yellow/gold
    },
    { 
      label: 'Done', 
      count: data.completed, 
      color: '#22c55e' // green
    }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid #f1f5f9'
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="600" 
        mb={3}
        sx={{ color: '#1e293b' }}
      >
        Status Overview
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {statusItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#f1f5f9',
                transform: 'translateX(4px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  flexShrink: 0
                }}
              />
              <Typography
                variant="body1"
                fontWeight="500"
                sx={{ color: '#334155' }}
              >
                {item.label}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: '#1e293b' }}
            >
              {item.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}