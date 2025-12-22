// src/components/Skeletons/ProfilePageSkeleton.jsx
import React from "react";
import { Container, Box, Skeleton, Card, CardContent, Paper, Tabs, Tab, useTheme } from "@mui/material";

function ProfileHeaderSkeleton() {
  return (
    <Box sx={{ position: "relative", borderRadius: { xs: "12px", md: "20px" }, overflow: "hidden", mt: { xs: 2, md: 5 } }}>
      <Skeleton variant="rectangular" sx={{ width: "100%", height: { xs: 200, sm: 220, md: 260 }, borderRadius: { xs: "12px", md: "20px" } }} />
      <Box sx={{ position: "absolute", bottom: 16, left: { xs: 16, md: 24 }, display: "flex", alignItems: "flex-end", gap: { xs: 1, sm: 3 } }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ border: "3px solid", borderColor: "background.paper" }} />
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" width={180} height={36} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
      </Box>
    </Box>
  );
}

function StatsCardsSkeleton() {
  return (
    <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ flex: 1, minWidth: 200, p: 2, bgcolor: 'background.paper', backgroundImage: 'none' }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={56} height={56} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="40%" height={32} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

function ProfileInfoSkeleton() {
  const theme = useTheme();
  return (
    <Box sx={{ 
      mt: 4, 
      bgcolor: "background.paper", 
      borderRadius: "16px", 
      p: 3, 
      border: "1px solid", 
      borderColor: "divider",
      backgroundImage: 'none'
    }}>
      <Skeleton variant="text" width={120} height={30} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="95%" />
      <Skeleton variant="text" width="60%" />
      
      <Box sx={{ 
        mt: 3, 
        p: 2, 
        borderRadius: "12px", 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: "1px solid",
        borderColor: "divider"
      }}>
        <Skeleton variant="text" width={100} sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" width={35} height={35} />)}
        </Box>
      </Box>
    </Box>
  );
}
// 4️⃣ Skeleton للـ Tabs
function ProfileTabsSkeleton() {
    const theme = useTheme();

  return (
    <Box sx={{ mt: 3 }}>
      {/* Tab Headers */}
      <Paper
        sx={{
          borderRadius: 3,
          m: 4,
          width: "fit-content",
          maxWidth: "100%",
          mx: "auto",
        }}
      >
        <Tabs value={0} TabIndicatorProps={{ style: { display: "none" } }}>
          {[1, 2, 3].map((item) => (
            <Tab
              key={item}
              label={<Skeleton variant="text" width={80} height={24} />}
              sx={{ textTransform: "none", minWidth: "auto", marginRight: 4 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content - Overview Tab (Skills + Services) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mb: 4,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Skills Section */}
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <Card
            sx={{
              borderRadius: "12px",
              border: "1px solid rgba(226, 232, 240, 1)",
              boxShadow: "none",
              maxWidth: "700px",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={150} height={24} />
              </Box>

              {/* Skills Chips */}
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rounded"
                    width={80}
                    height={32}
                    sx={{ borderRadius: "16px" }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Services Section */}
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <Card
            sx={{
              borderRadius: "12px",
              border: "1px solid rgba(226, 232, 240, 1)",
              boxShadow: "none",
              maxWidth: "700px",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={120} height={24} />
                </Box>
                <Skeleton variant="circular" width={28} height={28} />
              </Box>

              {/* Service Cards */}
              {[1, 2].map((item) => (
                <Box
                  key={item}
                  sx={{
                    p: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(248, 250, 252, 1)',
                  }}
                >
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={20}
                    sx={{ mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={20}
                    sx={{ mb: 1 }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
export default function ProfilePageSkeleton() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, minHeight: '100vh', pb: 5 }}> {/* minHeight لمنع القفز */}
        <ProfileHeaderSkeleton />
        <StatsCardsSkeleton />
        <ProfileInfoSkeleton />
        <ProfileTabsSkeleton />
        {/* يمكنك إضافة باقي الأجزاء هنا بنفس النمط */}
      </Box>
    </Container>
  );
}
