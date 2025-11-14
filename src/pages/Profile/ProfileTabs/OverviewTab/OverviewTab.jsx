

import React from "react";
import { Box} from "@mui/material";
import SkillsSection from "./SkillsSection";
import ServicesSection from "./ServicesSection";

export default function OverviewTab() {
  return (
   
 <Box 
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 4,
    mb: 4,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }}
>
  <Box sx={{ width: { xs: '100%', md: '48%' } }}>
    <SkillsSection/>
  </Box>

  <Box sx={{ width: { xs: '100%', md: '48%' } }}>
    <ServicesSection/>
  </Box>
</Box>

  );
}
