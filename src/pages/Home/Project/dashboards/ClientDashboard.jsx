import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import ProjectHeader from "../ProjectHeader";
import StatCard from "../StatsSection";
import FilterSection from "../../../../components/Filter/FilterSection";
import AllStatusProjectCard from "../../../../components/Cards/AllStatusProjectCard";
import RequestProjectCard from "../../../../components/Cards/RequestProjectCard";
import RequestServiceModal from "../../../../components/Modals/RequestServiceModal";
import { getPendingRequests } from "../../../../services/collaborationService";
import { useTheme } from "@mui/material/styles";

export default function ClientDashboard({
  data,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}) {
  const theme = useTheme();
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

  const handleImageUpdate = (userId, newAvatarUrl) => {
    setPendingRequests((prev) =>
      prev.map((req) =>
        req.providerId === userId ? { ...req, clientImage: newAvatarUrl } : req
      )
    );

    setFilteredProjects((prev) =>
      prev.map((proj) =>
        proj.clientId === userId ? { ...proj, clientImage: newAvatarUrl } : proj
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("clientShowRequests", JSON.stringify(showRequests));
  }, [showRequests]);

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
      console.log("client pending", response);
      const updatedRequests = requests.map((req) => ({
        ...req,
        clientImage: req.clientImage || null,
        providerImage: req.providerImage || null,
        projectType: req.type,
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
    setShowRequests((prev) => !prev);
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

    return projects.filter((project) => {
      // ✅ فحص البحث
      const matchesSearch =
        searchQuery === "" ||
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // ✅ فحص إذا المشروع overdue
      const isOverdue =
        new Date(project.deadline) < new Date() &&
        (project.projectStatus === "Active" || project.status === "Active");

      // ✅ فحص الـ status
      let matchesStatus = false;

      if (statusFilter === "All Status") {
        matchesStatus = true;
      } else if (statusFilter === "Overdue") {
        matchesStatus = isOverdue;
      } else if (statusFilter === "Active") {
        matchesStatus =
          (project.projectStatus === "Active" || project.status === "Active") &&
          !isOverdue;
      } else {
        matchesStatus =
          project.projectStatus === statusFilter ||
          project.status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  };

  useEffect(() => {
    setFilteredProjects(filterProjects(data?.items || []));
  }, [data, searchQuery, statusFilter]);

  const stats = data?.summary || {};

  const inReviewCount = stats.submittedForFinalReview || 0;

  const filterItems = [
    {
      type: "menu",
      label:
        statusFilter === "SubmittedForFinalReview" ? "In Review" : statusFilter,
      items: [
        { label: "All Status", value: "All Status" },
        { label: "Active", value: "Active" },
        { label: "In Review", value: "SubmittedForFinalReview" },
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

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 5 }}>
        <StatCard
          value={stats.total || 0}
          label="Total Requests"
          color="#00c853"
          progress={100}
        />
        <StatCard
          value={stats.pendingRequests || 0}
          label="Pending"
          color="#F59E0B"
          progress={calculateProgress(stats.pendingRequests, stats.total)}
        />
        <StatCard
          value={stats.active || 0}
          label="Active"
          color="#059669"
          progress={calculateProgress(stats.active, stats.total)}
        />
        <StatCard
          value={inReviewCount}
          label="In Review"
          color="#A855F7"
          progress={calculateProgress(inReviewCount, stats.total)}
        />
        <StatCard
          value={stats.completed || 0}
          label="Completed"
          color="#0284C7"
          progress={calculateProgress(stats.completed, stats.total)}
        />
        <StatCard
          value={stats.overdue || 0}
          label="Overdue"
          color="#DC2626"
          progress={
            stats.overdue > 0
              ? Math.min((stats.overdue / stats.total) * 100, 100)
              : 0
          }
        />
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
              {pendingRequests.map((request) => (
                <Grid item xs={12} sm={6} lg={4} key={request.id}>
                  {console.log("image", request)}
                  <RequestProjectCard
                    id={request.id}
                    title={request.title}
                    description={request.description}
                    clientName={request.providerName}
                    clientImage={request.clientPicture}
                    clientInitials={request.providerName
                      ?.substring(0, 2)
                      .toUpperCase()}
                    pointsOffered={request.pointsOffered}
                    deadline={new Date(request.deadline).toLocaleDateString()}
                    category={request.type}
                    isProvider={false}
                    onRequestHandled={handleRequestHandled}
                    onEditRequest={handleEditRequest}
                    sentDate={
                      request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : null
                    }
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={8} borderRadius={2}>
              <Typography
                variant="h6"
                color={theme.palette.mode === "dark" ? "#fff" : "#6B7280"}
              >
                No pending requests found
              </Typography>
            </Box>
          )
        ) : filteredProjects.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} lg={4} key={project.id}>
                {console.log("type in client dash", project.type)}
                <AllStatusProjectCard
                  {...project}
                  projectStatus={project.projectStatus || project.status}
                  isProvider={false}
                  projectType={project.type}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8} borderRadius={2}>
            <Typography
              variant="h6"
              color={theme.palette.mode === "dark" ? "#fff" : "#6B7280"}
            >
              No projects found
            </Typography>
          </Box>
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
