import { Box, Card, CardContent, Typography } from '@mui/material';

//  الاحصائيات
export default function StatsSection({
  totalTasks,
  inProgressCount,
  inReviewCount,
  completedCount,
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 2,
        mb: 4,
      }}
    >
      <StatCard label="Total Tasks" value={totalTasks} color="#3B82F6" />
      <StatCard label="In Progress" value={inProgressCount} color="#0284C7" />
      <StatCard label="In Review" value={inReviewCount} color="#A855F7" />
      <StatCard label="Completed" value={completedCount} color="#059669" />
      
    </Box>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Card sx={{
      borderRadius: 3,
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1)',
        boxShadow: "0px 2px 10px rgba(0,0,0,0.20)"
      },
    }}>
      <CardContent
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}