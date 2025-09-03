// // Sidebar.jsx
// import React from "react";
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
// import GroupIcon from '@mui/icons-material/Group';
//  import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment';
 import StarIcon from '@mui/icons-material/Star';
 import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

// const trendingServices = [
//   { name: "Fast Delivery", icon: <AccessTimeIcon /> },
//   { name: "Premium Service", icon: <WorkspacePremiumOutlinedIcon /> },
//   { name: "Community Help", icon: <GroupIcon /> },
// ];

// const categories = [
//   "Web Development",
//   "Design",
//   "Marketing",
//   "Writing",
//   "Tutoring",
// ];

// export default function Sidebar() {
//   return (
//     <Box
//       sx={{
//         // width: { xs: "100%", md: 300 },
//         // padding: 2,
//         // borderLeft: { md: "1px solid #ddd" },
//         marginTop: { xs: 2, md: 0 },
//       }}
//     >
//         <Box bgcolor="#FFF" sx={{padding:2}}> 
//       {/* Trending Services */}
//      <Box display="flex" alignItems="center" gap={1}>
//   <LocalFireDepartment style={{ color: '#f4794cff' }} />
//   <Typography variant="span">
//     Trending Services
//   </Typography>
// </Box>
//       <List>
//         {trendingServices.map((service, index) => (
//           <ListItem key={index} button>
//             <ListItemIcon>{service.icon}</ListItemIcon>
//             <ListItemText primary={service.name} />
//           </ListItem>
//         ))}
//       </List>
// </Box>
//       {/* Categories */}
//       <Box  bgcolor="#FFF" sx={{padding:2,marginTop:3}}>
//       <Box display="flex" alignItems="center" gap={1}>
//       <Typography variant="span" gutterBottom >
//        <StarIcon style={{ color: '#f4e64cff' }} />  Top Contributors
//       </Typography>
//       </Box>
//       <List>
//         {categories.map((cat, index) => (
//           <ListItem key={index} button>
//             <ListItemText primary={cat} />
//           </ListItem>
//         ))}
//       </List>
//       </Box>
//     </Box>
//   );
// }


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
    <Box sx={{ width: 300, p: 2,flexWrap:"wrap" }}>
      <SidebarBox title="Trending Services" icon={<LocalFireDepartmentIcon style={{color: '#f4794cff'}} />} items={trendingServices} />
      <SidebarBox title="Top Contributors" icone={ <StarIcon style={{ color: '#f4e64cff' }} /> }items={categories} />
      <SidebarBox title="📈 Trending Topics" items={[]} />
    </Box>
  );
}
