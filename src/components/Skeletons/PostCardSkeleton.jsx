// src/components/Skeletons/PostCardSkeleton.jsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Skeleton,
} from '@mui/material';

export default function PostCardSkeleton() {
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        // height:150
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width="40%" height={24} />}
        subheader={<Skeleton variant="text" width="25%" height={16} />}
      />

      {/* Content */}
      <CardContent>
        {/* Text Lines */}
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={70} height={24} />
        </Box>

        {/* Image */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ borderRadius: 2 }}
        />
      </CardContent>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          px: 2,
          py: 1.5,
          borderTop: '1px solid #eee',
        }}
      >
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
    </Card>
  );
}