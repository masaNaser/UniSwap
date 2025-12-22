import { useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { Box, CircularProgress } from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SidebarBox from './SidebarBox ';
import { trendingServices, topContributors, trendingTopics } from '../../../services/FeedService';

export default function Sidebar({ postsUpdated }) {
  const token = localStorage.getItem("accessToken");
  
  const [services, setServices] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ✅ Services
        try {
          const servicesRes = await trendingServices(token);
          console.log("📦 Services:", servicesRes.data);
          setServices(servicesRes.data || []);
        } catch (err) {
          console.error("❌ Error fetching services:", err);
          setServices([]);
        }

        // ✅ Contributors
        try {
          const contributorsRes = await topContributors(token);
          console.log("👥 Contributors:", contributorsRes.data);
          setContributors(contributorsRes.data || []);
        } catch (err) {
          console.error("❌ Error fetching contributors:", err);
          setContributors([]);
        }

        // ✅ Topics - التعديل الأساسي هنا
        try {
          const topicsRes = await trendingTopics(token);
          console.log("🔥 Topics RAW:", topicsRes);
          console.log("🔥 Topics DATA:", topicsRes.data);
          
          if (topicsRes.data && Array.isArray(topicsRes.data)) {
            // ✅ تأكدي إنو البيانات موجودة
            const validTopics = topicsRes.data.filter(item => 
              item && item.tag && typeof item.count === 'number'
            );
            
            console.log("✅ Valid Topics:", validTopics);
            setTopics(validTopics);
          } else {
            console.warn("⚠️ Topics data is not valid");
            setTopics([]);
          }
        } catch (err) {
          console.error("❌ Error fetching topics:", err);
          setTopics([]);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, postsUpdated]);

  // ✅ Debug: اطبعي الـ state بعد كل تحديث
  useEffect(() => {
    console.log("🎯 Current Topics State:", topics);
  }, [topics]);

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
      
      {/* ✅ Debug: اطبعي قبل ما ينعرض */}
      {console.log("🚀 Rendering Topics with:", topics.length, "items")}
      
      <SidebarBox 
        title="Trending Topics" 
        icon={<TrendingUpIcon style={{ color: '#ff6b9d' }} />} 
        items={topics}
        type="topics"
      />
    </Box>
  );
}