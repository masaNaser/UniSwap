import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

export default function ProjectCardSkeleton({ count = 1 }) {
  const skeletons = [...Array(count)].map((_, index) => (
    <Card 
      key={index}
      sx={{ 
        borderRadius: "16px", 
        height: "100%", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
          <Skeleton variant="text" width="40%" />
        </Box>
        
        <Skeleton variant="text" width="80%" height={25} sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={50} height={20} />
          <Skeleton variant="rounded" width={50} height={20} />
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="30%" />
        </Box>
      </CardContent>
    </Card>
  ));

  return <>{skeletons}</>;
}
