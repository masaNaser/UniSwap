// import { Box, Typography, Container, Tabs, Tab, Chip } from "@mui/material";
// import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
// import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
// import { useState } from "react";
// import ProjectHeader from "./ProjectHeader";
// import StatCard from "./StatsSection";
// import FiltersSection from "./FiltersSection";

// export default function Project() {
//   //value = رقم التاب الحالي.
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Container maxWidth="lg">
//         <Typography variant="h5" fontWeight="bold" gutterBottom>
//           My Projects
//         </Typography>
//         <Typography component="span" color="#475569">
//           Manage your services and requests in one place
//         </Typography>

//         {/* Tabs */}
//         <Box
//           className="Tabs"
//           sx={{ mt: 5, display: "flex", justifyContent: "center", width: "100%" }}
//         >
//           <Tabs
//             value={value}
//             onChange={handleChange}
//             TabIndicatorProps={{ style: { display: "none" } }}
//             sx={{
//               width: "100%",
//               "& .MuiTab-root": {
//                 textTransform: "none",
//                 borderRadius: "20px",
//                 px: 1,
//                 py: 1,
//                 flex: 1,
//                 maxWidth: "none",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 bgcolor: "#FFFFFFCC",
//               },
//               "& .Mui-selected": {
//                 bgcolor: "#00c8ff",
//               },
//             }}
//           >
//             {/* Tab 1 */}
//             <Tab
//               disableRipple
//               label={
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                   gap={8}
//                   width="100%"
//                 >
//                   <Box
//                     display="flex"
//                     flexDirection="row"
//                     gap={2}
//                     alignItems="center"
//                     justifyContent="center"
//                   >
//                     <VolunteerActivismOutlinedIcon sx={{ color: "#0566b3" }} />
//                     <Box
//                       display="flex"
//                       flexDirection="column"
//                       alignItems="flex-start"
//                     >
//                       <Typography fontWeight="bold">
//                         Projects I’m Working On
//                       </Typography>
//                       <Typography variant="body2">
//                         Providing services to others
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Chip
//                     label="4"
//                     size="small"
//                     sx={{
//                       bgcolor: "rgba(100, 180, 207, 0.2)",
//                       color: "black",
//                       fontWeight: "bold",
//                       borderRadius: "8px",
//                       px: 1,
//                     }}
//                   />
//                 </Box>
//               }
//             />

//             {/* Tab 2 */}
//             <Tab
//               disableRipple
//               label={
//                 <Box
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                   gap={8}
//                   width="100%"
//                 >
//                   <Box
//                     display="flex"
//                     flexDirection="row"
//                     gap={2}
//                     alignItems="center"
//                     justifyContent="center"
//                   >
//                     <WorkOutlineIcon sx={{ color: "#0566b3" }} />
//                     <Box
//                       display="flex"
//                       flexDirection="column"
//                       alignItems="flex-start"
//                     >
//                       <Typography fontWeight="bold">
//                         Projects I Requested
//                       </Typography>
//                       <Typography variant="body2">
//                         Services I need from others
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Chip
//                     label="2"
//                     size="small"
//                     sx={{
//                       bgcolor: "rgba(100, 180, 207, 0.2)",
//                       color: "black",
//                       fontWeight: "bold",
//                       borderRadius: "10px",
//                       px: 1,
//                     }}
//                   />
//                 </Box>
//               }
//             />
//           </Tabs>
//         </Box>

//         {/* Tab Content */}
//         {value === 0 && (
//           <>
//             <ProjectHeader
//               title="Services I'm Providing"
//               status="Active Services"
//               description="Projects where you're helping other students with your skills and expertise, building your reputation and earning points."
//             />
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 3,
//                 flexWrap: "wrap",
//                 mt: 5,
//               }}
//             >
//               <StatCard value={4} label="Total Projects" color="#00c853" progress={100} />
//               <StatCard value={2} label="Active" color="#059669" progress={50} />
//               <StatCard value={1} label="Pending" color="#F59E0B" progress={25} />
//               <StatCard value={3} label="Completed" color="#0284C7" progress={75} />
//               <StatCard value={1} label="Overdue" color="#DC2626" progress={20} />
//             </Box>
//             <Box className="soso" sx={{ mt: 5, color: "#FFFFFFF2", width: "100%" }}>
//               <FiltersSection />
//             </Box>
//           </>
//         )}

//         {value === 1 && (
//           <>
//             <ProjectHeader
//               title="Services I'm Requesting"
//               status="Requested Services"
//               description="Projects where you're asking for help from others to learn, collaborate, or get tasks done."
//             />
//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 3,
//                 flexWrap: "wrap",
//                 mt: 5,
//               }}
//             >
//               <StatCard value={2} label="Total Requests" color="#00c853" progress={100} />
//               <StatCard value={1} label="Active" color="#059669" progress={50} />
//               <StatCard value={0} label="Pending" color="#F59E0B" progress={0} />
//               <StatCard value={1} label="Completed" color="#0284C7" progress={100} />
//               <StatCard value={0} label="Overdue" color="#DC2626" progress={0} />
//             </Box>
//             <Box className="soso" sx={{ mt: 5, color: "#FFFFFFF2", width: "100%" }}>
//               <FiltersSection />
//             </Box>
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// }

import { Box, Typography, Container, Tabs, Tab, Chip, CircularProgress } from "@mui/material";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useState, useEffect } from "react";
import ProjectHeader from "./ProjectHeader";
import StatCard from "./StatsSection";
import FiltersSection from "./FiltersSection";
import { getClientdashboard, getServiceProviderDashboard } from "../../../services/projectService"; // عدّل المسار حسب مكان الملف

export default function Project() {
  const [value, setValue] = useState(0);
  const [providerData, setProviderData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الـ token من localStorage أو context
  const token = localStorage.getItem('accessToken'); // أو استخدم useContext إذا عندك AuthContext
  // إضافة state للفلاتر
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
   fetchProjectsData();
  }, [token,statusFilter]);

  const fetchProjectsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب بيانات المزود (Provider)
      const providerResponse = await getServiceProviderDashboard(token, 'provider', statusFilter);
      
      // جلب بيانات العميل (Client)
      const clientResponse = await getClientdashboard(token, 'client', statusFilter);

      setProviderData(providerResponse.data);
      setClientData(clientResponse.data);
    } catch (err) {
      setError("فشل تحميل بيانات المشاريع");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

   // دالة لتحديث الفلتر من FiltersSection
  const handleFilterChange = (newStatus, newSearch) => {
    setStatusFilter(newStatus);
    setSearchQuery(newSearch);
  };
  const calculateProgress = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const providerStats = providerData?.summary || {};
  const clientStats = clientData?.summary || {};

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
                        Projects I'm Working On
                      </Typography>
                      <Typography variant="body2">
                        Providing services to others
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={providerStats.total || 0}
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
                    label={clientStats.total || 0}
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

        {/* Tab Content - Provider */}
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
              <StatCard 
                value={providerStats.total || 0} 
                label="Total Projects" 
                color="#00c853" 
                progress={100} 
              />
              <StatCard 
                value={providerStats.active || 0} 
                label="Active" 
                color="#059669" 
                progress={calculateProgress(providerStats.active, providerStats.total)} 
              />
              <StatCard 
                value={providerStats.pendingRequests || 0} 
                label="Pending" 
                color="#F59E0B" 
                progress={calculateProgress(providerStats.pendingRequests, providerStats.total)} 
              />
              <StatCard 
                value={providerStats.completed || 0} 
                label="Completed" 
                color="#0284C7" 
                progress={calculateProgress(providerStats.completed, providerStats.total)} 
              />
              <StatCard 
                value={providerStats.overdue || 0} 
                label="Overdue" 
                color="#DC2626" 
                progress={calculateProgress(providerStats.overdue, providerStats.total)} 
              />
            </Box>
            <Box  sx={{ mt: 5, color: "#FFFFFFF2", width: "100%" }}>
              <FiltersSection 
               onFilterChange={handleFilterChange}
                currentStatus={statusFilter}
              />
            </Box>
          </>
        )}

        {/* Tab Content - Client */}
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
              <StatCard 
                value={clientStats.total || 0} 
                label="Total Requests" 
                color="#00c853" 
                progress={100} 
              />
              <StatCard 
                value={clientStats.active || 0} 
                label="Active" 
                color="#059669" 
                progress={calculateProgress(clientStats.active, clientStats.total)} 
              />
              <StatCard 
                value={clientStats.pendingRequests || 0} 
                label="Pending" 
                color="#F59E0B" 
                progress={calculateProgress(clientStats.pendingRequests, clientStats.total)} 
              />
              <StatCard 
                value={clientStats.completed || 0} 
                label="Completed" 
                color="#0284C7" 
                progress={calculateProgress(clientStats.completed, clientStats.total)} 
              />
              <StatCard 
                value={clientStats.overdue || 0} 
                label="Overdue" 
                color="#DC2626" 
                progress={calculateProgress(clientStats.overdue, clientStats.total)} 
              />
            </Box>
            <Box className="soso" sx={{ mt: 5, color: "#FFFFFFF2", width: "100%" }}>
             <FiltersSection onFilterChange={handleFilterChange} currentStatus={statusFilter} />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}