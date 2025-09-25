
 import StarIcon from '@mui/icons-material/Star';
 import { Box} from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SidebarBox from './SidebarBox ';

const trendingServices = [
  { name: "Web Development" },
  { name: "Graphic Design" },
  { name: "Content Writing"},
];

const categories = ["Sarah Wilson", "Sarah Wilson", "Sarah Wilson"];

export default function Sidebar() {
  return (
    <Box
     sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    // width: "100%", // خليه ياخد كل عرض العمود
  }}>
      <SidebarBox title="Trending Services" icon={<LocalFireDepartmentIcon style={{color: '#f4794cff'}} />} items={trendingServices} />
      <SidebarBox title="Top Contributors" icone={ <StarIcon style={{ color: '#f4e64cff' }} /> }items={categories} />
      <SidebarBox title="📈 Trending Topics" items={[]} />
    </Box>
  );
}
