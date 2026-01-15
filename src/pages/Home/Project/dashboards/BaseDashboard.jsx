import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ProjectHeader from "../ProjectHeader";
import StatCard from "../StatsSection";
import FilterSection from "../../../../components/Filter/FilterSection";
import AllStatusProjectCard from "../../../../components/Cards/AllStatusProjectCard";
import RequestProjectCard from "../../../../components/Cards/RequestProjectCard";
import RequestServiceModal from "../../../../components/Modals/RequestServiceModal";
import { getPendingRequests } from "../../../../services/collaborationService";
import { formatDateTime } from "../../../../utils/timeHelper";
import { useTheme } from "@mui/material/styles";
import { getToken } from "../../../../utils/authHelpers";

/**
 * BaseDashboard - Shared dashboard component for both Provider and Client views
 * @param {Object} props
 * @param {Object} props.data - Dashboard data
 * @param {string} props.statusFilter - Current status filter
 * @param {Function} props.onStatusFilterChange - Status filter change handler
 * @param {Function} props.onRefresh - Refresh handler
 * @param {string} props.highlightedRequestId - ID of request to highlight
 * @param {boolean} props.initialShowRequests - Initial show requests state
 * @param {Object} props.config - Configuration object for customizing behavior
 * @param {boolean} props.config.isProvider - Whether this is provider or client view
 * @param {string} props.config.storageKey - LocalStorage key for show requests state
 * @param {string} props.config.userRole - "Provider" or "Client" for API calls
 * @param {Object} props.config.headerProps - Props for ProjectHeader component
 * @param {string} props.config.imageKey - Key for user image in request data
 * @param {string} props.config.nameKey - Key for user name in request data
 */
export default function BaseDashboard({
    data,
    statusFilter,
    onStatusFilterChange,
    onRefresh,
    highlightedRequestId,
    initialShowRequests,
    config,
}) {
    const {
        isProvider,
        storageKey,
        userRole,
        headerProps,
        imageKey,
        nameKey,
    } = config;

    const theme = useTheme();
    const token = getToken();

    // State management
    const [showRequests, setShowRequests] = useState(() => {
        if (initialShowRequests !== undefined) return initialShowRequests;
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : false;
    });

    const [pendingRequests, setPendingRequests] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);

    // Refs for scrolling
    const requestRefs = useRef({});
    const projectRefs = useRef({});

    // Persist show requests state
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(showRequests));
    }, [showRequests, storageKey]);

    // Fetch pending requests when showing them
    useEffect(() => {
        if (showRequests) fetchPendingRequests();
    }, [showRequests]);

    // Scroll to highlighted item
    useEffect(() => {
        if (highlightedRequestId) {
            setTimeout(() => {
                let element = null;

                if (showRequests && pendingRequests.length > 0) {
                    element = requestRefs.current[highlightedRequestId];
                } else if (!showRequests && filteredProjects.length > 0) {
                    element = projectRefs.current[highlightedRequestId];
                }

                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.style.animation = "highlight 2s ease-in-out";
                    setTimeout(() => {
                        element.style.animation = "";
                    }, 2000);
                }
            }, 500);
        }
    }, [highlightedRequestId, pendingRequests, filteredProjects, showRequests]);

    // Filter projects when data or filters change
    useEffect(() => {
        setFilteredProjects(filterProjects(data?.items || []));
    }, [data, searchQuery, statusFilter]);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const response = await getPendingRequests(token, userRole);
            const requests = response.data || [];

            console.log('Client Requests Response:', response);
        console.log('Client Requests Data:', requests);

            const updatedRequests = requests.map((req) => ({
                ...req,
                [imageKey]: req[imageKey] || null,
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

    const filterProjects = (projects) => {
        if (!projects) return [];

        return projects.filter((project) => {
            // Search filter
            const matchesSearch =
                searchQuery === "" ||
                project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            let matchesStatus = false;

            if (statusFilter === "All Status") {
                matchesStatus = true;
            } else if (statusFilter === "Overdue") {
                matchesStatus =
                    project.projectStatus === "Overdue" || project.status === "Overdue";
            } else if (statusFilter === "Active") {
                matchesStatus =
                    project.projectStatus === "Active" || project.status === "Active";
            } else {
                matchesStatus =
                    project.projectStatus === statusFilter ||
                    project.status === statusFilter;
            }

            return matchesSearch && matchesStatus;
        });
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleStatusSelect = (value) => {
        onStatusFilterChange(value);
        setShowRequests(false);
        setPendingRequests([]);
    };

    const handleRequestsClick = () => setShowRequests((prev) => !prev);

    const handleRequestHandled = () => {
        setPendingRequests([]);
        setShowRequests(false);
        onRefresh();
        setTimeout(() => fetchPendingRequests(), 500);
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
                { label: "Cancelled", value: "Cancelled" },
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

    if (loading) {
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
    }

    return (
        <Box>
            <ProjectHeader {...headerProps} />

            {/* Stats Cards */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mt: 5,
                    justifyContent: { xs: "center", md: "flex-start" },
                }}
            >
                <StatCard
                    value={stats.total || 0}
                    label={isProvider ? "Total Projects" : "Total Requests"}
                    color="#00c853"
                    progress={stats.total > 0 ? 100 : 0}
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

            {/* Filter Section */}
            <Box sx={{ mt: 5 }}>
                <FilterSection
                    searchPlaceholder="Search projects..."
                    searchValue={searchQuery}
                    onSearchChange={handleSearchChange}
                    items={filterItems}
                />
            </Box>

            {/* Projects/Requests Grid */}
            <Box sx={{ mt: 4, mb: 10 }}>
                {showRequests ? (
                    pendingRequests.length > 0 ? (
                        <Grid container spacing={3}>
                            {pendingRequests.map((request) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    key={request.id}
                                    ref={(el) => (requestRefs.current[request.id] = el)}
                                    sx={{
                                        ...(highlightedRequestId === request.id && {
                                            "@keyframes highlight": {
                                                "0%": {
                                                    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)",
                                                    transform: "scale(1)",
                                                },
                                                "50%": {
                                                    boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.4)",
                                                    transform: "scale(1.02)",
                                                },
                                                "100%": {
                                                    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
                                                    transform: "scale(1)",
                                                },
                                            },
                                        }),
                                    }}
                                >
                                    <RequestProjectCard
                                        id={request.id}
                                        title={request.title}
                                        description={request.description}
                                        clientName={request[nameKey]}
                                        clientImage={request[imageKey]}
                                        clientInitials={request[nameKey]
                                            ?.substring(0, 2)
                                            .toUpperCase()}
                                        pointsOffered={request.pointsOffered}
                                        deadline={formatDateTime(request.deadline)}
                                        category={request.type}
                                        clientAcceptPublished={request.clientAcceptPublished}
                                        isProvider={isProvider}
                                        onRequestHandled={handleRequestHandled}
                                        onEditRequest={handleEditRequest}
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
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                lg={4}
                                key={project.id}
                                ref={(el) => (projectRefs.current[project.id] = el)}
                                sx={{
                                    ...(highlightedRequestId === project.id && {
                                        "@keyframes highlight": {
                                            "0%": {
                                                boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)",
                                                transform: "scale(1)",
                                            },
                                            "50%": {
                                                boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.4)",
                                                transform: "scale(1.02)",
                                            },
                                            "100%": {
                                                boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
                                                transform: "scale(1)",
                                            },
                                        },
                                    }),
                                }}
                            >
                                <AllStatusProjectCard
                                    {...project}
                                    projectStatus={project.projectStatus || project.status}
                                    isProvider={isProvider}
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

            {/* Edit Modal */}
            {editingRequest && (
                <RequestServiceModal
                    open={editModalOpen}
                    onClose={handleCloseEditModal}
                    providerName={
                        isProvider ? editingRequest.clientName : editingRequest.providerName
                    }
                    isEditMode={true}
                    editData={editingRequest}
                />
            )}
        </Box>
    );
}