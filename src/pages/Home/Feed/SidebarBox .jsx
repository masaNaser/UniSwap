import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
  Chip,
} from "@mui/material";
import { getImageUrl } from "../../../utils/imageHelper"; // عدلي المسار حسب مشروعك

export default function SidebarBox({ title, icon, items, type }) {
  
  // Trending Services
  const renderServices = () => {
    // حساب الـ max popularity عشان الـ percentage
    const maxPopularity = Math.max(...items.map(item => item.popularity), 1);
    
    return items.map((item, index) => {
      const percentage = Math.round((item.popularity / maxPopularity) * 100);
      
      return (
        <ListItem 
          key={item.subServiceId} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start',
            py: 2,
            borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
            <Typography variant="body2" fontWeight="600">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
              {percentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              width: '100%', 
              height: 6, 
              borderRadius: 3,
              bgcolor: '#e3f2fd',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#2196f3'
              }
            }} 
          />
        </ListItem>
      );
    });
  };

  // Top Contributors
  const renderContributors = () => {
    return items.map((item) => (
      <ListItem 
        key={item.userId}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1.5,
          px: 0
        }}
      >
        <Avatar 
          src={getImageUrl(item.profilePicture, item.userName)} 
          alt={item.userName}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="600">
            {item.userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ⭐ {item.averageRating?.toFixed(1) || '0.0'}
          </Typography>
        </Box>
      </ListItem>
    ));
  };

  // Trending Topics
  const renderTopics = () => {
    return items.map((item) => (
      <ListItem 
        key={item.tag}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          py: 1.5,
          px: 0
        }}
      >
        <Typography variant="body2" fontWeight="500">
          #{item.tag}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.count} posts
        </Typography>
      </ListItem>
    ));
  };

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        bgcolor: "#FFF"
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        {icon}
        <Typography variant="h6" fontWeight="600" fontSize="1rem">
          {title}
        </Typography>
      </Box>

      {/* Content */}
      <List sx={{ p: 0 }}>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            No data available
          </Typography>
        ) : (
          <>
            {type === 'services' && renderServices()}
            {type === 'contributors' && renderContributors()}
            {type === 'topics' && renderTopics()}
          </>
        )}
      </List>
    </Box>
  );
}