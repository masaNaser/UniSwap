import React, { useState, useEffect, useRef } from "react";
import { Container, CircularProgress, Box, Typography } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import TrackTasksHeader from "./components/TrackTasksHeader";
import StatsSection from "./components/StatsSection";
import KanbanBoard from "./components/KanbanBoard";
import TaskDialog from "./components/TaskDialog";
import TaskMenu from "./components/TaskMenu";
import TaskSnackbar from "./components/TaskSnackbar";
import TaskReviewDialog from "./components/TaskReviewDialog";
import ViewTaskReviewDialog from "./components/ViewTaskReviewDialog";
import ReviewDueDateDialog from "./components/ReviewDueDateDialog";
import * as taskService from "../../services/taskService";
import { mapProjectStatus } from "../../utils/projectStatusMapper";
import {
  getServiceProviderDashboard,
  getClientdashboard,
} from "../../services/projectService";
import { useCurrentUser } from "../../Context/CurrentUserContext";

const statuses = ["ToDo", "InProgress", "InReview", "Done"];
const statusLabels = {
  ToDo: "To Do",
  InProgress: "In Progress",
  InReview: "In Review",
  Done: "Done",
};

// ✅ Polling interval (5 seconds)
const POLLING_INTERVAL = 5000;

export default function TrackTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCardData = location.state;
  const { taskId } = useParams();
  const { updateCurrentUser } = useCurrentUser();

  const [cardData, setCardData] = useState(initialCardData);
  const isProvider = cardData?.isProvider || false;
  const token = localStorage.getItem("accessToken");

  // ✅ Ref for polling interval
  const pollingIntervalRef = useRef(null);
  
  const isFetchingRef = useRef(false);

  // State management
  const [tasks, setTasks] = useState({
    ToDo: [],
    InProgress: [],
    InReview: [],
    Done: [],
  });

  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "ToDo",
    UploadFile: null,
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewingTask, setReviewingTask] = useState(null);
  const [openViewReviewDialog, setOpenViewReviewDialog] = useState(false);
  const [viewingReviewTask, setViewingReviewTask] = useState(null);
  const [openReviewDueDateDialog, setOpenReviewDueDateDialog] = useState(false);
  const [taskForReview, setTaskForReview] = useState(null);

  // Fetch project status from dashboard
  const fetchProjectStatus = async () => {
    if (!cardData?.id || !token) {
      console.log("⚠️ Cannot fetch status - missing cardData.id or token");
      return null;
    }

    try {
      console.log(
        "🔄 Fetching project status from dashboard for ID:",
        cardData.id
      );

      const filters = [
        "All Status",
        "Active",
        "SubmittedForFinalReview",
        "Completed",
        "Overdue",
      ];

      for (const filter of filters) {
        try {
          const dashboardRes = isProvider
            ? await getServiceProviderDashboard(token, "Provider", filter)
            : await getClientdashboard(token, "client", filter);

          if (dashboardRes?.data?.items) {
            const currentProject = dashboardRes.data.items.find(
              (p) =>
                p.id === cardData.id ||
                p.projectId === cardData.id ||
                p.Id === cardData.id ||
                p.ProjectId === cardData.id
            );

            if (currentProject) {
              const status =
                currentProject.projectStatus || currentProject.status;
              console.log("✅ FOUND PROJECT! Status:", status);
              return status;
            }
          }
        } catch (filterError) {
          console.error(`❌ Error checking "${filter}" filter:`, filterError);
        }
      }

      console.log("⚠️ Project not found in ANY filter");
      return null;
    } catch (err) {
      console.error("❌ Failed to fetch status from dashboard:", err);
      return null;
    }
  };

  // ✅ Main fetch function - can be called silently
  const fetchProjectData = async (silent = false) => {
       if (!cardData?.id || !token) {
            console.log('⚠️ Cannot fetch - missing cardData.id or token', { cardData, token: !!token });
            setLoading(false);
            return;
        }
    if (isFetchingRef.current) {
      console.log("⏸️ جلب البيانات قيد التنفيذ، تخطي...");
      return;
    }

    try {
      setLoading(true);
      isFetchingRef.current = true;
      if (!silent) setLoading(true);

                 const detailsRes = await taskService.getProjectTaskDetails(cardData.id, token);
            console.log('✅ Fetched project details:', detailsRes);
            setProjectDetails(detailsRes.data);

            console.log('🔍 Fetching current status from dashboard...');
            const dashboardStatus = await fetchProjectStatus();

            console.log('📊 Dashboard Status Result:', dashboardStatus);

            setCardData(prev => {
                const finalStatus = dashboardStatus
                    ? mapProjectStatus(dashboardStatus)
                    : (prev.projectStatus || 'Active');

                console.log('🎯 Final Status:', finalStatus, 'from Dashboard');

                return {
                    ...prev,
                    title: detailsRes.data.title || detailsRes.data.projectName || 'Project',
                    //             description: apiData.description || '',
                    description: detailsRes.data.description || '',
                    projectStatus: finalStatus,
                    status: finalStatus,
                    deadline: detailsRes.data.deadline,
                    progressPercentage: detailsRes.data.progressPercentage || prev.progressPercentage || 0,
                    rejectionReason: detailsRes.data.rejectionReason || prev.rejectionReason,
                    projectType: detailsRes.data.type || prev.projectType || 'RequestProject'
                };
            });

            const tasksRes = await taskService.getTasksByStatus(cardData.id, null, token);
            console.log('All Tasks:', tasksRes.data);

            const allTasks = tasksRes.data;

            const tasksByStatus = {
                ToDo: [],
                InProgress: [],
                InReview: [],
                Done: [],
            };

            allTasks.forEach(task => {
                const status = task.status;
                if (tasksByStatus[status]) {
                    tasksByStatus[status].push(task);
                }
            });

            setTasks(tasksByStatus);
      if (silent) console.log("✅ تم التحديث التلقائي بنجاح عند البروفايدر");
    } catch (error) {
      console.error("❌ خطأ في التحديث التلقائي:", error);
    } finally {
      isFetchingRef.current = false; // فك القفل دائماً
      if (!silent)
         setLoading(false);
    }
  };

  useEffect(() => {
    if (!cardData?.id || !token) return;

    // أول جلب للبيانات
    fetchProjectData(false);

    // إعداد التحديث التلقائي
    const interval = setInterval(() => {
      fetchProjectData(true);
    }, POLLING_INTERVAL);

    // تنظيف الـ Interval عند مغادرة الصفحة
    return () => {
      console.log("🛑 إيقاف التحديث التلقائي");
      clearInterval(interval);
    };
    // أضف cardData.id و token فقط لضمان عدم تكرار الـ Interval بلا داعي
  }, [cardData?.id, token]);

  // ✅ Helper function for immediate refresh after actions
  const immediateRefresh = async () => {
    console.log("⚡ Immediate refresh after action");
    await fetchProjectData(true);
  };

  // تحديث الموعد النهائي في الحالة المحلية
  const handleDeadlineUpdate = (newDeadline) => {
    setCardData((prev) => ({ ...prev, deadline: newDeadline }));
    setProjectDetails((prev) => ({ ...prev, deadline: newDeadline }));
    immediateRefresh(); // ✅ Refresh after deadline update
  };

  // تحديث حالة المشروع عند الإغلاق
  const handleProjectClosed = async (skipSuccessMessage = false) => {
    try {
      console.log("🔄 handleProjectClosed called - refreshing project data...");

      await fetchProjectData(false);

      if (!skipSuccessMessage) {
        setSnackbar({
          open: true,
          message: "Project status updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error refreshing project data:", error);
      setSnackbar({
        open: true,
        message:
          "Project closed but failed to refresh data. Please reload the page.",
        severity: "warning",
      });
    }
  };

  // Handle task review submission
  const handleSubmitReview = async (taskId, decision, comment) => {
    try {
      if (decision === "accept") {
        await taskService.acceptTask(taskId, comment, token);
      } else {
        await taskService.rejectTask(taskId, comment, token);
      }

      await taskService.updateProjectProgress(cardData.id, token);

      // ✅ Immediate refresh after review
      await immediateRefresh();

      setSnackbar({
        open: true,
        message:
          decision === "accept"
            ? "Task accepted successfully!"
            : "Task rejected. Revision comments saved.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit review",
        severity: "error",
      });
    }
  };

  const handleReviewClick = (task) => {
    setReviewingTask(task);
    setOpenReviewDialog(true);
  };

  const handleViewReview = async (task) => {
    setViewingReviewTask(task);
    setOpenViewReviewDialog(true);
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task title",
        severity: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", newTask.title);
      formData.append("Description", newTask.description || "");

      if (newTask.uploadFile) {
        formData.append("UploadFile", newTask.uploadFile);
      }

      if (editingTask && newTask.progressPercentage !== undefined) {
        formData.append("ProgressPercentage", newTask.progressPercentage);
      }

      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData, token);
        await taskService.updateProjectProgress(cardData.id, token);

        // ✅ Immediate refresh after update
        await immediateRefresh();

        setSnackbar({
          open: true,
          message: "Task updated successfully!",
          severity: "success",
        });
      } else {
        const res = await taskService.createTask(cardData.id, formData, token);

        // ✅ Immediate refresh after creation
        await immediateRefresh();

        setSnackbar({
          open: true,
          message: "Task added successfully!",
          severity: "success",
        });
      }

      setOpenDialog(false);
      setNewTask({
        title: "",
        description: "",
        status: "ToDo",
        uploadFile: null,
        progressPercentage: 0,
      });
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save task",
        severity: "error",
      });
    }
  };

  const handleTaskFromColumn = async (formData) => {
    if (!formData.title.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a task title",
        severity: "error",
      });
      return;
    }

    try {
      const data = new FormData();
      data.append("Title", formData.title);
      data.append("Description", formData.description || "");

      if (formData.uploadFile) {
        data.append("UploadFile", formData.uploadFile);
      }

      await taskService.createTask(cardData.id, data, token);

      // ✅ Immediate refresh
      await immediateRefresh();

      setSnackbar({
        open: true,
        message: "Task added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving task:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save task",
        severity: "error",
      });
    }
  };

  const handleDeleteTask = async (status, taskId) => {
    try {
      await taskService.deleteTask(taskId, token);

      // ✅ Immediate refresh after delete
      await immediateRefresh();

      setSnackbar({ open: true, message: "Task deleted!", severity: "info" });
      setAnchorEl(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete task",
        severity: "error",
      });
    }
  };

  const handleEditTask = (task, status) => {
    setEditingTask({ ...task, status });
    setNewTask({
      title: task.title,
      description: task.description || "",
      status,
      uploadFile: null,
      progressPercentage: task.progressPercentage || 0,
    });
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedTask) return;

    let currentStatus = null;
    for (const status of statuses) {
      if (tasks[status].find((t) => t.id === draggedTask.id)) {
        currentStatus = status;
        break;
      }
    }

    if (currentStatus === targetStatus) {
      setDraggedTask(null);
      return;
    }

    const allowedTransitions = {
      ToDo: ["InProgress"],
      InProgress: ["InReview"],
      InReview: ["InProgress", "Done"],
      Done: [],
    };

    if (!allowedTransitions[currentStatus].includes(targetStatus)) {
      setSnackbar({
        open: true,
        message: `Cannot move task from ${statusLabels[currentStatus]} to ${statusLabels[targetStatus]}`,
        severity: "warning",
      });
      setDraggedTask(null);
      return;
    }

    try {
      if (targetStatus === "InProgress" && currentStatus === "ToDo") {
        await taskService.moveToInProgress(draggedTask.id, token);
      } else if (
        targetStatus === "InReview" &&
        currentStatus === "InProgress"
      ) {
        setTaskForReview(draggedTask);
        setOpenReviewDueDateDialog(true);
        setDraggedTask(null);
        return;
      } else if (
        targetStatus === "InProgress" &&
        currentStatus === "InReview"
      ) {
        await taskService.moveToInProgress(draggedTask.id, token);
      } else if (targetStatus === "Done" && currentStatus === "InReview") {
        await taskService.acceptTask(draggedTask.id, "", token);
      }

      await taskService.updateProjectProgress(cardData.id, token);

      // ✅ Immediate refresh after drag
      await immediateRefresh();

      setSnackbar({
        open: true,
        message: `Task moved to ${statusLabels[targetStatus]}!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error moving task:", error);

      const backendError =
        error.response?.data?.detail || error.response?.data?.message;

      let errorMessage;
      let severity = "warning";

      if (
        backendError &&
        (backendError.includes("must be Rejected") ||
          backendError.includes("Forbidden") ||
          backendError.includes("not allowed"))
      ) {
        errorMessage = `Cannot move task from ${statusLabels[currentStatus]} to ${statusLabels[targetStatus]}`;
      } else {
        errorMessage = backendError || "Failed to move task";
        severity = "error";
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: severity,
      });
    }
    setDraggedTask(null);
  };

  const handleReviewDueDateSubmit = async (reviewDueDate) => {
    if (!taskForReview) return;

    try {
      console.log("📤 Sending to backend:", reviewDueDate);

      await taskService.submitForReview(taskForReview.id, reviewDueDate, token);
      await taskService.updateProjectProgress(cardData.id, token);

      // ✅ Immediate refresh after submit
      await immediateRefresh();

      setSnackbar({
        open: true,
        message: reviewDueDate
          ? "Task submitted for review with deadline!"
          : "Task submitted for review!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting for review:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit for review",
        severity: "error",
      });
    }
  };

  const handleOpenMenu = (e, task, status) => {
    setSelectedTask({ task, status });
    setAnchorEl(e.currentTarget);
  };

  const completedTasks = tasks.Done.length;
  const totalTasks = Object.values(tasks).reduce(
    (sum, list) => sum + list.length,
    0
  );
  const progressPercentage = projectDetails?.progressPercentage || 0;

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!cardData) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TrackTasksHeader
        cardData={cardData}
        projectDetails={projectDetails}
        isProvider={isProvider}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        progressPercentage={progressPercentage}
        onBack={() => navigate(-1)}
        onDeadlineUpdate={handleDeadlineUpdate}
        onProjectClosed={handleProjectClosed}
      />

      <StatsSection
        totalTasks={totalTasks}
        inProgressCount={tasks.InProgress.length}
        inReviewCount={tasks.InReview.length}
        completedCount={completedTasks}
      />

      <KanbanBoard
        statuses={statuses}
        statusLabels={statusLabels}
        tasks={tasks}
        isProvider={isProvider}
        draggedTask={draggedTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMenuOpen={handleOpenMenu}
        onAddTask={handleTaskFromColumn}
        onReviewClick={handleReviewClick}
        onViewReview={handleViewReview}
        projectStatus={cardData.projectStatus}
      />

      <TaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingTask={editingTask}
        newTask={newTask}
        onTaskChange={setNewTask}
        onSubmit={handleAddTask}
        isProvider={isProvider}
      />

      <TaskReviewDialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        task={reviewingTask}
        onSubmitReview={handleSubmitReview}
      />

      <ViewTaskReviewDialog
        open={openViewReviewDialog}
        onClose={() => setOpenViewReviewDialog(false)}
        task={viewingReviewTask}
      />

      <ReviewDueDateDialog
        open={openReviewDueDateDialog}
        onClose={() => {
          setOpenReviewDueDateDialog(false);
          setTaskForReview(null);
        }}
        onSubmit={handleReviewDueDateSubmit}
        taskTitle={taskForReview?.title || ""}
        projectType={cardData?.projectType || "RequestProject"}
        projectDeadline={cardData?.deadline}
      />

      <TaskMenu
        anchorEl={anchorEl}
        selectedTask={selectedTask}
        onClose={() => setAnchorEl(null)}
        onEdit={() => {
          if (selectedTask) {
            handleEditTask(selectedTask.task, selectedTask.status);
          }
        }}
        onDelete={() => {
          if (selectedTask) {
            handleDeleteTask(selectedTask.status, selectedTask.task.id);
          }
        }}
      />

      <TaskSnackbar
        snackbar={snackbar}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
}
