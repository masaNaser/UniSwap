import { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { Box, CircularProgress } from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SidebarBox from './SidebarBox ';
import { trendingServices, topContributors, trendingTopics } from '../../../services/FeedService'; // عدلي المسار حسب مشروعك

export default function Sidebar() {
  const token = localStorage.getItem("accessToken");
  
  const [services, setServices] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // ✅ اجلبي كل واحد لحاله
      try {
        const servicesRes = await trendingServices(token);
        console.log("trendingServices",servicesRes);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }

      try {
        const contributorsRes = await topContributors(token);
        console.log("topContributors",contributorsRes);
        setContributors(contributorsRes.data);
      } catch (err) {
        console.error("Error fetching contributors:", err);
      }

      try {
        const topicsRes = await trendingTopics(token);
      console.log("trendingTopics",topicsRes);
        setTopics(topicsRes.data);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }

    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
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