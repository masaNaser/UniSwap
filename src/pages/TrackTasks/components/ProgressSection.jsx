import { Box, Typography, LinearProgress } from '@mui/material';

export default function ProgressSection({ progressPercentage, projectPoints }) {
  return (
    <Box sx={{ mb: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight="500">
          Progress
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {Math.round(progressPercentage)}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          height: 8,
          borderRadius: 1,
          bgcolor: '#E0E7FF',
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
            background: 'linear-gradient(to right, #00C8FF, #8B5FF6)',
          },
        }}
      />

      <Box
        sx={{
          mt: 1.5,
          bgcolor: '#EFF6FF',
          borderRadius: 2,
          p: 1.5,
          textAlign: 'left'
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#3B82F6', lineHeight: 1, mb: 0.5 }}>
          {projectPoints || 0}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
          Points
        </Typography>
      </Box>
    </Box>
  );
}