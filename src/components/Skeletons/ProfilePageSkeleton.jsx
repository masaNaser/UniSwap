// src/components/Skeletons/ProfilePageSkeleton.jsx
import React from "react";
import {
  Container,
  Box,
  Skeleton,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

// 1️⃣ Skeleton للـ Profile Header
function ProfileHeaderSkeleton() {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: { xs: "12px", md: "20px" },
        overflow: "hidden",
        mt: { xs: 2, md: 5 },
      }}
    >
      {/* Cover Image */}
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: { xs: 200, sm: 220, md: 260 },
          borderRadius: { xs: "12px", md: "20px" },
        }}
      />

      {/* Avatar positioned at bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: { xs: 16, md: 24 },
          display: "flex",
          alignItems: "flex-end",
          gap: { xs: 1, sm: 3 },
        }}
      >
        <Skeleton
          variant="circular"
          width={{ xs: 70, sm: 80, md: 90 }}
          height={{ xs: 70, sm: 80, md: 90 }}
          sx={{ border: "3px solid white" }}
        />

        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" width={200} height={36} />
          <Skeleton variant="text" width={150} height={24} sx={{ mt: 0.5 }} />
          <Skeleton variant="text" width={180} height={20} sx={{ mt: 1 }} />
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          display: { xs: "none", md: "flex" },
          gap: 1,
        }}
      >
        <Skeleton variant="rounded" width={100} height={36} />
        <Skeleton variant="rounded" width={140} height={36} />
        <Skeleton variant="rounded" width={90} height={36} />
      </Box>
    </Box>
  );
}

// 2️⃣ Skeleton للـ Stats Cards
function StatsCardsSkeleton() {
  return (
    <Box sx={{ mt: 4 }}>
      <div
        className="cards-section"
        style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
      >
        {[1, 2, 3].map((item) => (
          <Card key={item} sx={{ flex: 1, minWidth: 200, p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={32}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </Card>
        ))}
      </div>
    </Box>
  );
}

// 3️⃣ Skeleton للـ Profile Info (About + Contact)
function ProfileInfoSkeleton() {
  return (
    <Box
      sx={{
        mt: 4,
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      {/* About Section */}
      <Skeleton variant="text" width={150} height={28} sx={{ mb: 1.5 }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="70%" height={20} />

      {/* Contact Section */}
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            background: "rgba(241, 245, 249, 1)",
            p: 2.5,
            borderRadius: "12px",
            border: "1px solid rgba(226, 232, 240, 1)",
          }}
        >
          <Skeleton variant="text" width={80} height={20} sx={{ mb: 1.5 }} />
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rounded" width={36} height={36} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// 4️⃣ Skeleton للـ Tabs
function ProfileTabsSkeleton() {
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
                    backgroundColor: "rgba(248, 250, 252, 1)",
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

// 5️⃣ الـ Component الرئيسي
export default function ProfilePageSkeleton() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3 }}>
        <ProfileHeaderSkeleton />
        <StatsCardsSkeleton />
        <ProfileInfoSkeleton />
        <ProfileTabsSkeleton />
      </Box>
    </Container>
  );
}
