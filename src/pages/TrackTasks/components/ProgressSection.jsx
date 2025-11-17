import { Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';

export default function ProgressSection({ progressPercentage }) {
  return (
    <Card sx={{ mb: 4, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Project Progress
          </Typography>
          <Typography fontWeight="bold" color="#3B82F6">
            {Math.round(progressPercentage)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: '#E5E7EB',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: 'linear-gradient(to right, #0EA5E9, #06B6D4)',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}