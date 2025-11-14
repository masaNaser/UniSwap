
//هون نحط التابس نفسها ونشغل التنقل بين التابس

import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import OverviewTab from "./OverviewTab/OverviewTab";
import PortfolioTab from "./PortfolioTab";
// import ReviewsTab from "./tabs/ReviewsTab";
// import AchievementsTab from "./tabs/AchievementsTab";

export default function ProfileTabs() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box sx={{ mt: 3 }}>
      {/* الأزرار */}
 <Paper 
  sx={{ 
    borderRadius: 3, 
    mb: 3,
    width: "fit-content",     // ياخد قد التابس فقط
    maxWidth: "100%",         // ما يتجاوز عرض الشاشة
    overflowX: "auto",        // يعمل scroll لو صار أعرض من الشاشة
    whiteSpace: "nowrap",     // يمنع التابس من النزول تحت بعض
    // mx: "auto"                // يخليها بالنص
  }}
>
  <Tabs
    value={currentTab}
    onChange={(e, v) => setCurrentTab(v)}
    TabIndicatorProps={{ style: { display: "none" } }}
    variant="scrollable"    // يخلي التابس قابلة للتمرير
    scrollButtons="auto"    // يظهر أزرار التمرير تلقائيًا
    sx={{
      minHeight: 48,        // ارتفاع ثابت ومرتب
    }}
  >
    {["Overview", "Portfolio", "Reviews", "Achievements"].map((label, index) => (
      <Tab
        key={label}
        label={label}
        sx={{
          textTransform: "none",
              minWidth: "auto",     // هذا أهم سطر لحل المشكلة

          fontWeight: currentTab === index ? "bold" : "normal",
          fontSize: "16px",
          background:
            currentTab === index
              ? "linear-gradient(to right, rgba(2, 132, 199, 0.8), rgba(152, 16, 250, 0.8))"
              : "none",
          WebkitBackgroundClip: currentTab === index ? "text" : "none",
          WebkitTextFillColor: currentTab === index ? "transparent" : "black",
        }}
      />
    ))}
  </Tabs>
</Paper>


      {/* المحتوى */}
      {currentTab === 0 && <OverviewTab />}
      {currentTab === 1 && <PortfolioTab />}
      {/* {currentTab === 2 && <ReviewsTab />} */}
      {/* {currentTab === 3 && <AchievementsTab />} */}
    </Box>
  );
}

