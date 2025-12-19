import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, LinearProgress, Box, Chip, CircularProgress 
} from '@mui/material';
import { ActiveProjects } from '../../../../../services/adminService'; // تأكد من مسار ملف الـ api الخاص بك

export default function ActiveProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // أو أي مكان تخزن فيه التوكن
        const response = await ActiveProjects(token);
        console.log("ActiveProjects",response);
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // دالة لتحديد لون الـ Status Chip بناءً على الحالة
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { backgroundColor: '#000', color: '#fff' };
      case 'Overdue':
        return { backgroundColor: '#e91e63', color: '#fff' };
      case 'Completed':
        return { backgroundColor: '#e8f0fe', color: '#1a73e8' };
      case 'InReview':
        return { backgroundColor: '#f1f3f4', color: '#3c4043' };
      default:
        return { backgroundColor: '#eee', color: '#000' };
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: '15px' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Active Projects
      </Typography>

      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#777', fontWeight: 500 }}>Project Name</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 500 }}>Progress</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 500 }}>Status</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 500 }}>Client</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 500 }}>Provider Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.projectId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{project.projectName}</TableCell>
                
                {/* عمود الـ Progress */}
                <TableCell sx={{ width: '200px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={project.progress} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 5, 
                          backgroundColor: '#eee',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#000' } 
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {project.progress}%
                    </Typography>
                  </Box>
                </TableCell>

                {/* عمود الـ Status */}
                <TableCell>
                  <Chip 
                    label={project.status} 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      ...getStatusStyle(project.status)
                    }} 
                  />
                </TableCell>

                <TableCell>{project.clientName}</TableCell>
                <TableCell>{project.providerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
