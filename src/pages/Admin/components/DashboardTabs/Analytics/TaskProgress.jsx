import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // للأيقونات
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
  );

  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  // إعداد البيانات بناءً على الـ Response اللي بعته
  const statusItems = [
    { 
      label: 'Completed', 
      count: data.completed, 
      percentage: data.completedPercentage,
      color: '#67e8f9', // Cyan
      icon: <CheckCircleOutlineIcon sx={{ color: '#0891b2' }} />
    },
    { 
      label: 'In-Progress', 
      count: data.inProgress, 
      percentage: data.inProgressPercentage,
      color: '#86efac', // Green
      icon: <PlayCircleOutlineIcon sx={{ color: '#16a34a' }} />
    },
    { 
      label: 'Up Coming', 
      count: data.upComing, 
      percentage: data.upComingPercentage,
      color: '#fed7aa', // Orange
      icon: <ErrorOutlineIcon sx={{ color: '#ea580c', transform: 'rotate(180deg)' }} />
    }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
      }}
    >
      <Typography 
        variant="h6"
        fontWeight="600"
        mb={3}
        sx={{ color: "#1e293b" }}>
        Task Progress
      </Typography>

      {/* النسبة المئوية الكلية */}
      <Typography variant="h6" fontWeight="800" sx={{ color: '#1e293b', mb: 2 }}>
        {data.progressPercentage}%
      </Typography>

      {/* شريط التقدم الملون (Multi-color progress bar) */}
      <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', mb: 1, bgcolor: '#f1f5f9' }}>
        {statusItems.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: `${item.percentage}%`, 
              bgcolor: item.color,
              transition: 'width 0.5s ease'
            }} 
          />
        ))}
      </Box>

      {/* كتابة النسب تحت الشريط */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        {statusItems.map((item, index) => (
          <Typography key={index} variant="caption" fontWeight="600" color="text.secondary">
            {item.percentage}%
          </Typography>
        ))}
      </Box>

      {/* كروت الحالة الثلاثية */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        {statusItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              borderRadius: 3,
              bgcolor: '#f8fafc', // خلفية الكرت الرمادية الخفيفة
              border: '1px solid #f1f5f9'
            }}
          >
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: '50%', 
                bgcolor: item.color, 
                display: 'flex', 
                mb: 1,
                opacity: 0.8 
              }}
            >
              {item.icon}
            </Box>
            <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b' }}>
              {item.count}
            </Typography>
            <Typography variant="caption" fontWeight="500" color="text.secondary" sx={{ textAlign: 'center' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}