// src/components/admin/dashboard/StatsCard.jsx

import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

const StatsCard = ({ title, value, icon, iconColor, iconBgColor }) => {
  // تنسيق الأرقام الكبيرة (45200 → 45.2K)
  const formatValue = (val) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toLocaleString();
  };

  return (
    <Card sx={{ height: '100%', boxShadow: 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            {/* العنوان */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            
            {/* القيمة الرئيسية */}
            <Typography variant="h4" component="h2" fontWeight="bold">
              {formatValue(value)}
            </Typography>
          </Box>
          
          {/* الأيقونة */}
          <Avatar
            sx={{
              bgcolor: iconBgColor,
              color: iconColor,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;