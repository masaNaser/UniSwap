import { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { Box, CircularProgress } from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SidebarBox from './SidebarBox';
import { trendingServices, topContributors, trendingTopics } from '../../../services/FeedService';
import SidebarBoxSkeleton from '../../../components/Skeletons/SidebarBoxSkeleton';
import { getToken } from '../../../utils/authHelpers';
export default function Sidebar({ postsUpdated }) {
  // const token = localStorage.getItem("accessToken");
   const token = getToken();
  const [services, setServices] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Services
        try {
          const servicesRes = await trendingServices(token);
          console.log("🔎 Trending Services Response:", servicesRes);
          setServices(servicesRes.data || []);
        } catch (err) {
          console.error("Error fetching services:", err);
          setServices([]);
        }

        // Contributors
        try {
          const contributorsRes = await topContributors(token);
          console.log("🔎 Top Contributors Response:", contributorsRes);
          setContributors(contributorsRes.data || []);
        } catch (err) {
          console.error("Error fetching contributors:", err);
          setContributors([]);
        }

        // Topics
        try {
          const topicsRes = await trendingTopics(token);
          console.log("🔎 Trending Topics Response:", topicsRes);
          if (topicsRes.data && Array.isArray(topicsRes.data)) {
            const validTopics = topicsRes.data.filter(item => 
              item && item.tag && typeof item.count === 'number'
            );
            setTopics(validTopics);
          } else {
            setTopics([]);
          }
        } catch (err) {
          console.error("Error fetching topics:", err);
          setTopics([]);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, postsUpdated]);

if (loading) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <SidebarBoxSkeleton type="services" />
      <SidebarBoxSkeleton type="contributors" />
      <SidebarBoxSkeleton type="topics" />
    </Box>
  );
}

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
      }}
    >
      <SidebarBox 
        title="Trending Services" 
        icon={<LocalFireDepartmentIcon style={{color: '#f4794cff'}} />} 
        items={services}
        type="services"
      />
      
        <SidebarBox 
        title="Top Contributors" 
        icon={<StarIcon style={{ color: '#f4e64cff' }} />} 
        items={contributors}
        type="contributors"
      />

       <SidebarBox 
        title="Trending Topics" 
        icon={<TrendingUpIcon style={{ color: '#ff6b9d' }} />} 
        items={topics}
        type="topics"
      />
    </Box>
  );
}