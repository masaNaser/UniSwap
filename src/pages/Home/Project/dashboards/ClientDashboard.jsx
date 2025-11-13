// import { Box, Typography, Grid, CircularProgress } from "@mui/material";
// import { useState, useEffect } from "react";
// import ProjectHeader from "../ProjectHeader";
// import StatCard from "../StatsSection";
// import FilterSection from "../../../../components/Filter/FilterSection";
// import AllStatusProjectCard from "../../../../components/Cards/AllStatusProjectCard";
// import RequestProjectCard from "../../../../components/Cards/RequestProjectCard";
// import RequestServiceModal from "../../../../components/Modals/RequestServiceModal";
// import { getPendingRequests } from "../../../../services/collaborationService";

// export default function ClientDashboard({
//   data,
//   statusFilter,
//   onStatusFilterChange,
//   onRefresh,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   // Initialize showRequests from localStorage
//   const [showRequests, setShowRequests] = useState(() => {
//     const saved = localStorage.getItem("clientShowRequests");
//     return saved ? JSON.parse(saved) : false;
//   });
//   const [pendingRequests, setPendingRequests] = useState([]);

//   // جديد: حالات للمودال
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingRequest, setEditingRequest] = useState(null);

//   const token = localStorage.getItem("accessToken");

//   // Save showRequests to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("clientShowRequests", JSON.stringify(showRequests));
//   }, [showRequests]);

//   // Fetch pending requests when "Requests" button is clicked
//   useEffect(() => {
//     if (showRequests) {
//       fetchPendingRequests();
//     }
//   }, [showRequests]);

//   const fetchPendingRequests = async () => {
//     try {
//       setLoading(true);
//       const response = await getPendingRequests(token, "Client");
//       console.log("pending requests:", response.data);

//       // Axios returns data directly in response.data
//       setPendingRequests(response.data || []);
//     } catch (err) {
//       console.error("Error fetching pending requests:", err);
//       // Don't set error state, just show empty state
//       setPendingRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (e) => setSearchQuery(e.target.value);

//   const handleStatusSelect = (value) => {
//     onStatusFilterChange(value);
//     setShowRequests(false);
//     setPendingRequests([]);
//   };

//   const handleRequestsClick = () => {
//     setShowRequests((prev) => !prev);
//   };

//   const handleRequestHandled = () => {
//     // قائمة الخطوات:
//     // 1. خفي الـ pending requests
//     setPendingRequests([]);
//     // 2. أرجع للـ projects view
//     setShowRequests(false);
//     // 3. روح جدد الـ projects عشان تظهر الـ active الجديدة
//     onRefresh();
//     // 4. اختياري: بعد شوية refresh الـ pending requests للحالات الأخرى
//     setTimeout(() => {
//       fetchPendingRequests();
//     }, 500);
//   };

//   // جديد: دالة لفتح مودال التعديل
//   const handleEditRequest = (requestData) => {
//     console.log("Opening edit modal with data:", requestData);

//     // استخرج الـ category من الـ type
//     // type يكون مثل "RequestProject" أو "RequestCourse"
//     let category = requestData.category;
//     if (!category && requestData.type) {
//       category = requestData.type.replace("Request", "");
//     }

//     setEditingRequest({
//       ...requestData,
//       category: category, // تأكد من وجود الـ category
//     });
//     setEditModalOpen(true);
//   };

//   // جديد: دالة لإغلاق مودال التعديل
//   const handleCloseEditModal = () => {
//     setEditModalOpen(false);
//     setEditingRequest(null);
//     // Refresh data after edit
//     handleRequestHandled();
//   };

//   const calculateProgress = (value, total) =>
//     total === 0 ? 0 : (value / total) * 100;

//   const filterProjects = (projects) => {
//     if (!projects) return [];

//     return projects.filter((project) => {
//       const matchesSearch =
//         searchQuery === "" ||
//         project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesSearch;
//     });
//   };

//   // Get projects based on current view (using 'items' instead of 'projects')
//   const currentProjects = data?.items || [];
  
//   // Console to check API response for active projects
//   console.log("Client Dashboard - Active Projects Data:", {
//     allProjects: currentProjects,
//     totalProjects: currentProjects.length,
//     fullResponse: data,
//   });

//   const filteredProjects = filterProjects(currentProjects);

//   const stats = data?.summary || {};

//   const filterItems = [
//     {
//       type: "menu",
//       label: statusFilter,
//       items: [
//         { label: "All Status", value: "All Status" },
//         { label: "Active", value: "Active" },
//         { label: "Completed", value: "Completed" },
//         { label: "Overdue", value: "Overdue" },
//       ],
//       onSelect: handleStatusSelect,
//     },
//     {
//       type: "button",
//       label: showRequests ? "Hide Requests" : "Show Requests",
//       onClick: handleRequestsClick,
//       active: showRequests,
//     },
//   ];

//   if (loading)
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "400px",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );

//   return (
//     <Box>
//       <ProjectHeader
//         title="Services I'm Requesting"
//         status="Requested Services"
//         description="Projects where you're asking for help from others to learn, collaborate, or get tasks done."
//       />

//       <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 5 }}>
//         <StatCard value={stats.total || 0} label="Total Requests" color="#00c853" progress={100} />
//         <StatCard value={stats.active || 0} label="Active" color="#059669" progress={calculateProgress(stats.active, stats.total)} />
//         <StatCard value={stats.pendingRequests || 0} label="Pending" color="#F59E0B" progress={calculateProgress(stats.pendingRequests, stats.total)} />
//         <StatCard value={stats.completed || 0} label="Completed" color="#0284C7" progress={calculateProgress(stats.completed, stats.total)} />
//         <StatCard value={stats.overdue || 0} label="Overdue" color="#DC2626" progress={calculateProgress(stats.overdue, stats.total)} />
//       </Box>

//       <Box sx={{ mt: 5 }}>
//         <FilterSection
//           searchPlaceholder="Search projects..."
//           searchValue={searchQuery}
//           onSearchChange={handleSearchChange}
//           items={filterItems}
//         />
//       </Box>

//       <Box sx={{ mt: 4, mb: 10 }}>
//         {showRequests ? (
//           // Show Pending Requests for Client
//           pendingRequests.length > 0 ? (
//             <Grid container spacing={3}>
//               {pendingRequests.map((request) => (
//                 <Grid item xs={12} sm={6} lg={4} key={request.id}>
//                   <RequestProjectCard
//                     id={request.id}
//                     title={request.title}
//                     description={request.description}
//                     clientName={request.providerName}
//                     clientInitials={request.providerName?.substring(0, 2).toUpperCase()}
//                     pointsOffered={request.pointsOffered}
//                     deadline={new Date(request.deadline).toLocaleDateString()}
//                     category={request.type}
//                     isProvider={false}
//                     onRequestHandled={handleRequestHandled}
//                     onEditRequest={handleEditRequest}
//                     sentDate={request.createdAt ? new Date(request.createdAt).toLocaleDateString() : null}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Box textAlign="center" py={8} bgcolor="#f9fafb" borderRadius={2}>
//               <Typography variant="h6" color="text.secondary">
//                 No pending requests found
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 You don't have any pending collaboration requests
//               </Typography>
//             </Box>
//           )
//         ) : (
//           // Show Regular Projects
//           filteredProjects.length > 0 ? (
//             <Grid container spacing={3}>
//               {filteredProjects.map((project) => (
//                 <Grid item xs={12} sm={6} lg={4} key={project.id}>
//                   <AllStatusProjectCard 
//                     {...project}
//                     isProvider={false}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Box textAlign="center" py={8} bgcolor="#f9fafb" borderRadius={2}>
//               <Typography variant="h6" color="text.secondary">
//                 No projects found
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 Try adjusting your filters or search query
//               </Typography>
//             </Box>
//           )
//         )}
//       </Box>

//       {/* جديد: مودال التعديل */}
//       {editingRequest && (
//         <RequestServiceModal
//           open={editModalOpen}
//           onClose={handleCloseEditModal}
//           providerName={editingRequest.providerName}
//           isEditMode={true}
//           editData={editingRequest}
//         />
//       )}
//     </Box>
//   );
// }

import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import ProjectHeader from "../ProjectHeader";
import StatCard from "../StatsSection";
import FilterSection from "../../../../components/Filter/FilterSection";
import AllStatusProjectCard from "../../../../components/Cards/AllStatusProjectCard";
import RequestProjectCard from "../../../../components/Cards/RequestProjectCard";
import RequestServiceModal from "../../../../components/Modals/RequestServiceModal";
import { getPendingRequests } from "../../../../services/collaborationService";

export default function ClientDashboard({
  data,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showRequests, setShowRequests] = useState(() => {
    const saved = localStorage.getItem("clientShowRequests");
    return saved ? JSON.parse(saved) : false;
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const token = localStorage.getItem("accessToken");

  // تحديث الصورة فورياً في dashboard
  const handleImageUpdate = (userId, newAvatarUrl) => {
    setPendingRequests(prev =>
      prev.map(req =>
        req.providerId === userId
          ? { ...req, clientImage: newAvatarUrl }
          : req
      )
    );

    setFilteredProjects(prev =>
      prev.map(proj =>
        proj.clientId === userId
          ? { ...proj, clientImage: newAvatarUrl }
          : proj
      )
    );
  };

  // Save showRequests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clientShowRequests", JSON.stringify(showRequests));
  }, [showRequests]);

  // Fetch pending requests when "Requests" button is clicked
  useEffect(() => {
    if (showRequests) {
      fetchPendingRequests();
    }
  }, [showRequests]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await getPendingRequests(token, "Client");
      const requests = response.data || [];

      const updatedRequests = requests.map(req => ({
        ...req,
        clientImage: req.clientImage || null,
        providerImage: req.providerImage || null,
      }));

      setPendingRequests(updatedRequests);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleStatusSelect = (value) => {
    onStatusFilterChange(value);
    setShowRequests(false);
    setPendingRequests([]);
  };

  const handleRequestsClick = () => {
    setShowRequests(prev => !prev);
  };

  const handleRequestHandled = () => {
    setPendingRequests([]);
    setShowRequests(false);
    onRefresh();
    setTimeout(() => {
      fetchPendingRequests();
    }, 500);
  };

  const handleEditRequest = (requestData) => {
    let category = requestData.category;
    if (!category && requestData.type) {
      category = requestData.type.replace("Request", "");
    }

    setEditingRequest({
      ...requestData,
      category,
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingRequest(null);
    handleRequestHandled();
  };

  const calculateProgress = (value, total) =>
    total === 0 ? 0 : (value / total) * 100;

  const filterProjects = (projects) => {
    if (!projects) return [];
    return projects.filter(project => {
      const matchesSearch =
        searchQuery === "" ||
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  // تحديث filteredProjects عند تغيّر البيانات أو البحث
  useEffect(() => {
    setFilteredProjects(filterProjects(data?.items || []));
  }, [data, searchQuery]);

  const stats = data?.summary || {};

  const filterItems = [
    {
      type: "menu",
      label: statusFilter,
      items: [
        { label: "All Status", value: "All Status" },
        { label: "Active", value: "Active" },
        { label: "Completed", value: "Completed" },
        { label: "Overdue", value: "Overdue" },
      ],
      onSelect: handleStatusSelect,
    },
    {
      type: "button",
      label: showRequests ? "Hide Requests" : "Show Requests",
      onClick: handleRequestsClick,
      active: showRequests,
    },
  ];

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <ProjectHeader
        title="Services I'm Requesting"
        status="Requested Services"
        description="Projects where you're asking for help from others to learn, collaborate, or get tasks done."
      />

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: 5 }}>
        <StatCard value={stats.total || 0} label="Total Requests" color="#00c853" progress={100} />
        <StatCard value={stats.active || 0} label="Active" color="#059669" progress={calculateProgress(stats.active, stats.total)} />
        <StatCard value={stats.pendingRequests || 0} label="Pending" color="#F59E0B" progress={calculateProgress(stats.pendingRequests, stats.total)} />
        <StatCard value={stats.completed || 0} label="Completed" color="#0284C7" progress={calculateProgress(stats.completed, stats.total)} />
        <StatCard value={stats.overdue || 0} label="Overdue" color="#DC2626" progress={calculateProgress(stats.overdue, stats.total)} />
      </Box>

      <Box sx={{ mt: 5 }}>
        <FilterSection
          searchPlaceholder="Search projects..."
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          items={filterItems}
        />
      </Box>

      <Box sx={{ mt: 4, mb: 10 }}>
        {showRequests ? (
          pendingRequests.length > 0 ? (
            <Grid container spacing={3}>
              {pendingRequests.map(request => (
                <Grid item xs={12} sm={6} lg={4} key={request.id}>
                  <RequestProjectCard
                    id={request.id}
                    title={request.title}
                    description={request.description}
                    clientName={request.providerName}
                    clientInitials={request.providerName?.substring(0, 2).toUpperCase()}
                    pointsOffered={request.pointsOffered}
                    deadline={new Date(request.deadline).toLocaleDateString()}
                    category={request.type}
                    isProvider={false}
                    onRequestHandled={handleRequestHandled}
                    onEditRequest={handleEditRequest}
                    sentDate={request.createdAt ? new Date(request.createdAt).toLocaleDateString() : null}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={8} bgcolor="#f9fafb" borderRadius={2}>
              <Typography variant="h6" color="text.secondary">
                No pending requests found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You don't have any pending collaboration requests
              </Typography>
            </Box>
          )
        ) : (
          filteredProjects.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProjects.map(project => (
                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                  <AllStatusProjectCard 
                    {...project}
                    isProvider={false}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={8} bgcolor="#f9fafb" borderRadius={2}>
              <Typography variant="h6" color="text.secondary">
                No projects found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or search query
              </Typography>
            </Box>
          )
        )}
      </Box>

      {editingRequest && (
        <RequestServiceModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          providerName={editingRequest.providerName}
          isEditMode={true}
          editData={editingRequest}
        />
      )}
    </Box>
  );
}
