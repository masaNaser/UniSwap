import { Box, Typography, Container, Tabs, Tab, Chip } from "@mui/material";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useState } from "react";
import ProjectHeader from "./ProjectHeader";
import StatCard from "./StatsSection";
import FiltersSection from "./FiltersSection";

export default function Project() {
  //value = رقم التاب الحالي.
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Projects
        </Typography>
        <Typography component="span" color="#475569">
          Manage your services and requests in one place
        </Typography>

        {/* Tabs */}
        <Box
          className="Tabs"
          sx={{ mt: 5, display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              width: "100%",
              "& .MuiTab-root": {
                textTransform: "none",
                borderRadius: "20px",
                px: 1,
                py: 1,
                flex: 1,
                maxWidth: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#FFFFFFCC",
              },
              "& .Mui-selected": {
                bgcolor: "#00c8ff",
              },
            }}
          >
            {/* Tab 1 */}
            <Tab
              disableRipple
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={8}
                  width="100%"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VolunteerActivismOutlinedIcon sx={{ color: "#0566b3" }} />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography fontWeight="bold">
                        Projects I’m Working On
                      </Typography>
                      <Typography variant="body2">
                        Providing services to others
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label="4"
                    size="small"
                    sx={{
                      bgcolor: "rgba(100, 180, 207, 0.2)",
                      color: "black",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                </Box>
              }
            />

            {/* Tab 2 */}
            <Tab
              disableRipple
              label={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={8}
                  width="100%"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <WorkOutlineIcon sx={{ color: "#0566b3" }} />
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography fontWeight="bold">
                        Projects I Requested
                      </Typography>
                      <Typography variant="body2">
                        Services I need from others
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="2"
                    size="small"
                    sx={{
                      bgcolor: "rgba(100, 180, 207, 0.2)",
                      color: "black",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      px: 1,
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {value === 0 && (
          <>
            <ProjectHeader
              title="Services I'm Providing"
              status="Active Services"
              description="Projects where you're helping other students with your skills and expertise, building your reputation and earning points."
            />
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                mt: 5,
              }}
            >
              <StatCard value={4} label="Total Projects" color="#00c853" progress={100} />
              <StatCard value={2} label="Active" color="#059669" progress={50} />
              <StatCard value={1} label="Pending" color="#F59E0B" progress={25} />
              <StatCard value={3} label="Completed" color="#0284C7" progress={75} />
              <StatCard value={1} label="Overdue" color="#DC2626" progress={20} />
            </Box>
            <Box className="soso" sx={{ mt: 5, color: "#FFFFFFF2", width: "100%" }}>
              <FiltersSection />
            </Box>
          </>
        )}

        {value === 1 && (
          <>
            <ProjectHeader
              title="Services I'm Requesting"
              status="Requested Services"
              description="Projects where you're asking for help from others to learn, collaborate, or get tasks done."
            />
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                mt: 5,
              }}
            >
              <StatCard value={2} label="Total Requests" color="#00c853" progress={100} />
              <StatCard value={1} label="Active" color="#059669" progress={50} />
              <StatCard value={0} label="Pending" color="#F59E0B" progress={0} />
              <StatCard value={1} label="Completed" color="#0284C7" progress={100} />
              <StatCard value={0} label="Overdue" color="#DC2626" progress={0} />
            </Box>
            <Box className="soso" sx={{ mt: 5, color: "#FFFFFFF2", width: "100%" }}>
              <FiltersSection />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
