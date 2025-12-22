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
import { getImageUrl } from "../../../utils/imageHelper";
import { useNavigateToProfile } from "../../../hooks/useNavigateToProfile";
import { useTheme } from "@mui/material/styles";

export default function SidebarBox({ title, icon, items, type }) {
  const theme = useTheme();
  const navigateToProfile = useNavigateToProfile();
  // Trending Services
  const renderServices = () => {
    const activeServices = items.filter(item => item.popularity > 0);

    if (activeServices.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
          No projects yet
        </Typography>
      );
    }

    // ✅ احسبي المجموع الكلي
    const totalProjects = activeServices.reduce((sum, item) => sum + item.popularity, 0);

    return activeServices.map((item, index) => {
      // ✅ النسبة من المجموع
      const percentage = Math.round((item.popularity / totalProjects) * 100);

      return (
        <ListItem key={item.subServiceId}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: 2,
            borderBottom: index < activeServices.length - 1 ? `1px solid ${theme.palette.divider}` : 'none'
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
            <Typography variant="body2" fontWeight="600">
              {item.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              {/* <Typography 
              variant="body2" 
              fontWeight="600"
              color="primary"
              sx={{ whiteSpace: 'nowrap' }}
            >
              {item.popularity}
            </Typography> */}
              <Typography
                variant="caption"
                color="text.disabled"
                fontSize="0.7rem"
                sx={{ whiteSpace: 'nowrap' }}
              >
                ({percentage}%)
              </Typography>
            </Box>
          </Box>
          <LinearProgress variant="determinate" value={percentage} sx={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : '#e3f2fd',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#2196f3'
            }
          }} />
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
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            cursor: 'pointer'
          }}
          onClick={() => navigateToProfile(item.userId)}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            fontWeight="600"
            onClick={() => navigateToProfile(item.userId)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
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
    
    if (!items || items.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
          No topics yet
        </Typography>
      );
    }

    // 1) توسعة tags: فصل react,c++ → react و c++
    const expanded = items.flatMap(item => {
      if (!item.tag) return [];

      const parts = item.tag.split(",").map(t => t.trim());
      return parts.map(t => ({
        tag: t,
        count: item.count
      }));
    });


    // 2) تجميع counts حسب كل تاغ
    const grouped = expanded.reduce((acc, cur) => {
      if (!acc[cur.tag]) {
        acc[cur.tag] = { tag: cur.tag, count: 0 };
      }
      acc[cur.tag].count += cur.count;
      return acc;
    }, {});

    const finalTopics = Object.values(grouped);

    // 3) العرض النهائي
    return finalTopics.map((item) => (
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
        bgcolor: theme.palette.background.paper
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