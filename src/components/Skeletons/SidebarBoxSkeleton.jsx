// src/components/Skeletons/SidebarBoxSkeleton.jsx
import React from 'react';
import { Box, List, ListItem, Skeleton, Typography } from '@mui/material';

export default function SidebarBoxSkeleton({ type }) {
  const renderServicesSkeleton = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3 }} />
      </ListItem>
    ))
  );

  const renderContributorsSkeleton = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="20%" height={14} />
        </Box>
      </ListItem>
    ))
  );

  const renderTopicsSkeleton = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="20%" height={14} />
      </ListItem>
    ))
  );

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header Skeleton */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="40%" height={24} />
      </Box>

      <List sx={{ p: 0 }}>
        {type === 'services' && renderServicesSkeleton()}
        {type === 'contributors' && renderContributorsSkeleton()}
        {type === 'topics' && renderTopicsSkeleton()}
      </List>
    </Box>
  );
}
