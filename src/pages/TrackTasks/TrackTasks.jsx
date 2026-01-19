import React, { useState, useEffect, useRef, useReducer } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
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
import { getToken } from "../../utils/authHelpers";
import { createProjectHubConnection } from "../../services/projectHub";

// ===== Constants =====
const statuses = ["ToDo", "InProgress", "InReview", "Done"];
const statusLabels = {
  ToDo: "To Do",
  InProgress: "In Progress",
  InReview: "In Review",
  Done: "Done",
};

const STATUS_MAP = {
  0: "ToDo",
  1: "InProgress",
  2: "InReview",
  3: "Done",
};

const isDevelopment = process.env.NODE_ENV === "development";
const log = (...args) => isDevelopment && console.log(...args);
const logError = (...args) => console.error(...args);

// ===== Tasks Reducer =====
//الستيت عبارة عن الاعمدة الاربعة 
// البيلود فيها معلومات التاسك من العنوان والايدي والستيتس تبعته
const tasksReducer = (state, action) => {
  try {
    //حسب نوع الحدث قرر شو تعمل
    switch (action.type) {
      //خد كل التاسكات من السيرفر
      case "SET_TASKS":
        return action.payload;

      case "TASK_CREATED": {
        // توحيد نوع الـ status 
        // (رقم أو سترينج)
        const statusKey =
          typeof action.payload.status === "number"
            ? STATUS_MAP[action.payload.status]
            : action.payload.status;

        if (!state[statusKey]) {
          logError(`Invalid status key: ${statusKey}`);
          return state;
        }

        if (state[statusKey].some((t) => t.id === action.payload.id)) {
          return state;
        }

        return {
          ...state,
          [statusKey]: [
            ...state[statusKey],
            { ...action.payload, status: statusKey },
          ],
        };
      }
       //نقل التاسك من عمود إلى عمود اخر
      case "TASK_STATUS_CHANGED": {
        const statusKey =
          typeof action.payload.status === "number"
            ? STATUS_MAP[action.payload.status]
            : action.payload.status;

        if (!state[statusKey]) {
          logError(`Invalid status key: ${statusKey}`);
          return state;
        }
        const newState = { ...state };
        Object.keys(newState).forEach((key) => {
          newState[key] = newState[key].filter(
            (t) => t.id !== action.payload.id
          );
        });
        newState[statusKey] = [
          ...newState[statusKey],
          { ...action.payload, status: statusKey },
        ];
        return newState;
      }
     // تعديل بيانات التاسك بدون تغيير مكانه
      case "TASK_UPDATED": {
        const statusKey =
          typeof action.payload.status === "number"
            ? STATUS_MAP[action.payload.status]
            : action.payload.status;

        if (!state[statusKey]) {
          logError(`Invalid status key: ${statusKey}`);
          return state;
        }

        return {
          ...state,
          [statusKey]: state[statusKey].map((t) =>
            t.id === action.payload.id
              ? { ...action.payload, status: statusKey }
              : t
          ),
        };
      }

      case "TASK_DELETED": {
        const newState = { ...state };
        Object.keys(newState).forEach((key) => {
          newState[key] = newState[key].filter(
            (t) => t.id !== action.payload.taskId
          );
        });
        return newState;
      }

      default:
        return state;
    }
  } catch (error) {
    logError("Error in tasksReducer:", error);
    return state;
  }
};

export default function TrackTasks() {
  const connectionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const initialCardData = location.state;
  const { updateCurrentUser } = useCurrentUser();
  const [cardData, setCardData] = useState(initialCardData);
  const isProvider = cardData?.isProvider || false;
  const token = getToken();
/*
*أي تغيير على 
tasks
لا يصير مباشرة
لازم يمر عبر 
tasksReducer
 */
  const [tasks, dispatch] = useReducer(tasksReducer, {
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

  //  ADD: Refs to track fetch state and prevent duplicates
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const cardDataRef = useRef(cardData);

  useEffect(() => {
    cardDataRef.current = cardData;
  }, [cardData]);

  // ===== SignalR Connection =====
  useEffect(() => {
    if (!cardData?.id || !token) {
      log("Cannot start SignalR - missing cardData.id or token");
      return;
    }
    let isMounted = true;
    let connection = null;
    const startConnection = async () => {
      connection = createProjectHubConnection();
      connectionRef.current = connection;
      try {
        await connection.start();
        if (!isMounted) return;
        log("Connected to SignalR Hub");
        await connection.invoke("JoinProject", cardData.id);

        connection.on("TaskCreated", (newTask) => {
          log("SignalR: TaskCreated", newTask);
          dispatch({ type: "TASK_CREATED", payload: newTask });
        });

        connection.on("TaskStatusChanged", (updatedTask) => {
          log("SignalR: TaskStatusChanged", updatedTask);
          dispatch({ type: "TASK_STATUS_CHANGED", payload: updatedTask });
        });

        connection.on("TaskUpdated", (updatedTask) => {
          log("SignalR: TaskUpdated", updatedTask);
          dispatch({ type: "TASK_UPDATED", payload: updatedTask });
        });

        connection.on("TaskDeleted", (data) => {
          log("SignalR: TaskDeleted", data);
          dispatch({ type: "TASK_DELETED", payload: data });
        });

        connection.on("ProjectProgressUpdated", (data) => {
          log("SignalR: ProjectProgressUpdated", data);
          setProjectDetails((prev) => ({
            ...prev,
            progressPercentage: data.progressPercentage,
          }));
        });

        connection.on("ProjectClosed", (data) => {
          const currentCardData = cardDataRef.current;
          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = currentCardData?.id;
          // نتاكد انه المشروع نفسه
          if (receivedProjectId === currentProjectId) {
            setCardData((prev) => ({
              ...prev,
              projectStatus: "SubmittedForFinalReview",
            }));

            setProjectDetails((prev) => ({
              ...prev,
              status: "SubmittedForFinalReview",
            }));
            if (isProvider) {
              setSnackbar({
                open: true,
                message: "Project submitted for review successfully!",
                severity: "success",
              });
            }
          }
        });

        connection.on("ProjectCompleted", (data) => {
          if (cardDataRef.current?.projectStatus === "Completed") {
            log(" Already Completed locally, ignoring SignalR");
            return;
          }
          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = cardDataRef.current?.id;
          if (receivedProjectId === currentProjectId) {
            log("Client accepted - updating status to Completed");
            setCardData((prev) => ({
              ...prev,
              projectStatus: "Completed",
              status: "Completed",
            }));
            setProjectDetails((prev) => ({
              ...prev,
              status: "Completed",
            }));
          }
        });

        connection.on("ProjectPublished", (data) => {
          log("SignalR: ProjectPublished", data);

          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = cardDataRef.current?.id;

          if (receivedProjectId === currentProjectId) {
            setCardData((prev) => ({ ...prev, projectStatus: "Completed" }));
            setSnackbar({
              open: true,
              message: "Project published successfully. Now visible in Browse",
              severity: "success",
            });
          }
        });

        connection.on("ProjectRejected", (data) => {
          log("🔔 SignalR: Received ProjectRejected", data);

          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = cardDataRef.current?.id;

          if (receivedProjectId === currentProjectId) {
            log("⚠️ Client rejected - updating status (NO FETCH)");

            setCardData((prev) => ({
              ...prev,
              projectStatus: "Active",
              status: "Active",
            }));

            setProjectDetails((prev) => ({
              ...prev,
              status: "Active",
              rejectionReason: data.reason || data.Reason || "No reason provided",
            }));
          }
        });
      } catch (err) {
        logError(" SignalR Connection Error:", err);
        if (isMounted) {
          setSnackbar({
            open: true,
            message: "Failed to connect to real-time updates",
            severity: "warning",
          });
        }
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (connection) {
        log(" Disconnecting SignalR...");
        connection
          .stop()
          .catch((err) => logError("Error stopping connection:", err));
      }
    };
  }, [cardData?.id, token, isProvider]);

  // ===== Fetch Project Status =====
  const fetchProjectStatus = async () => {
    if (!cardData?.id || !token) {
      return null;
    }
    try {
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
              const status = currentProject.projectStatus || currentProject.status;
              log(` Found project in "${filter}" with status:`, status);
              return status;
            }
          }
        } catch (filterError) {
          logError(`Error checking "${filter}" filter:`, filterError);
        }
      }
      return null;
    } catch (err) {
      logError(" Failed to fetch status from dashboard:", err);
      return null;
    }
  };

  const fetchProjectData = async () => {
    if (!cardData?.id || !token) {
      setLoading(false);
      return;
    }
    // Prevent duplicate fetches within 2 seconds
    const now = Date.now();
    if (fetchInProgressRef.current || (now - lastFetchTimeRef.current < 2000)) {
      log("Skipping duplicate fetch (too soon or already in progress)");
      return;
    }
    try {
      fetchInProgressRef.current = true;
      lastFetchTimeRef.current = now;
      setLoading(true);

      log("Fetching project data for ID:", cardData.id);

      const detailsRes = await taskService.getProjectTaskDetails(
        cardData.id,
        token
      );
      log("Fetched project details:", detailsRes.data);
      setProjectDetails(detailsRes.data);
      //جلب حالة المشروع من الداشبورد
      const dashboardStatus = await fetchProjectStatus();
      setCardData((prev) => {
        const finalStatus = dashboardStatus
          ? mapProjectStatus(dashboardStatus)
          : prev.projectStatus || "Active";
        return {
          ...prev,
          title: detailsRes.data.title || detailsRes.data.projectName || "Project",
          description: detailsRes.data.description || "",
          projectStatus: finalStatus,
          status: finalStatus,
          deadline: detailsRes.data.deadline,
          progressPercentage:
            detailsRes.data.progressPercentage || prev.progressPercentage || 0,
          rejectionReason:
            detailsRes.data.rejectionReason || prev.rejectionReason,
          projectType:
            detailsRes.data.type || prev.projectType || "RequestProject",
        };
      });
      //جلب كل التاسكات للمشروع
      const tasksRes = await taskService.getTasksByStatus(
        cardData.id,
        null,
        token
      );
      log("All Tasks:", tasksRes.data);

      const tasksByStatus = {
        ToDo: [],
        InProgress: [],
        InReview: [],
        Done: [],
      };

      tasksRes.data.forEach((task) => {
        const status = task.status;
        if (tasksByStatus[status]) {
          tasksByStatus[status].push(task);
        }
      });

      dispatch({ type: "SET_TASKS", payload: tasksByStatus });
    } catch (error) {
      logError("Error fetching tasks:", error);
      setSnackbar({
        open: true,
        message: "Failed to load tasks",
        severity: "error",
      });
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  };

  useEffect(() => {
    if (!cardData?.id) return;
    fetchProjectData();
  }, [cardData?.id, token]);

  const handleDeadlineUpdate = (newDeadline) => {
    setCardData((prev) => ({ ...prev, deadline: newDeadline }));
    setProjectDetails((prev) => ({ ...prev, deadline: newDeadline }));
  };

  const handleProjectClosed = async (forceRefresh = false, snackbarConfig = null) => {
    // forceRefresh : هل نحتاج نجيب البيانات من السيرفر من جديد
    //اذا كان ترو بنحدث البيانات من السيرفر اذا فولس ما بنعمل فيتش 
    if (forceRefresh) {
      try {
        //  Fetch fresh project details
        const detailsRes = await taskService.getProjectTaskDetails(cardData.id, token);
        //  نجيب حالة المشروع من الداشبورد
        const dashboardStatus = await fetchProjectStatus();
        //  Update project details
        setProjectDetails(detailsRes.data);
        //  Update card data with fresh status
        setCardData((prev) => {
          const finalStatus = dashboardStatus
            ? mapProjectStatus(dashboardStatus)
            : detailsRes.data.status || prev.projectStatus || "Active";

          return {
            ...prev,
            title: detailsRes.data.title || detailsRes.data.projectName || "Project",
            description: detailsRes.data.description || "",
            projectStatus: finalStatus,
            status: finalStatus,
            deadline: detailsRes.data.deadline,
            progressPercentage: detailsRes.data.progressPercentage || prev.progressPercentage || 0,
            rejectionReason: detailsRes.data.rejectionReason || prev.rejectionReason,
            projectType: detailsRes.data.type || prev.projectType || "RequestProject",
          };
        });
        // Show snackbar if config was passed
        if (snackbarConfig) {
          setSnackbar({
            open: true,
            message: snackbarConfig.message,
            severity: snackbarConfig.severity,
          });
        }

      } catch (error) {
        console.log(" Error refreshing project data:", error);
        setSnackbar({
          open: true,
          message: "Project updated but failed to refresh display. Please reload the page.",
          severity: "warning",
        });
      }
    } else {
      console.log(" No refresh needed - status updated via SignalR");
    }
  };

  const handleSubmitReview = async (taskId, decision, comment) => {
    try {
      if (decision === "accept") {
        await taskService.acceptTask(taskId, comment, token);
      } else {
        await taskService.rejectTask(taskId, comment, token);
      }
      await taskService.updateProjectProgress(cardData.id, token);
      //  جلب التاسكات من السيرفر
      // Only fetch task data, not full project (status comes from SignalR)
      const tasksRes = await taskService.getTasksByStatus(cardData.id, null, token);
      const allTasks = tasksRes.data;
      //  تنظيم التاسكات حسب الحالة عشان ال reducer
      const tasksByStatus = {
        ToDo: [],
        InProgress: [],
        InReview: [],
        Done: [],
      };
// تصنيف التاسكات حسب الستيتس لكل تاسك عشان تنحط بالعمود الصح
      allTasks.forEach((task) => {
        if (tasksByStatus[task.status]) {
          tasksByStatus[task.status].push(task);
        }
      });
// ال tasksReducer 
// حدث الستيت تبع التاسكات بالبيلود الجديد
      dispatch({ type: "SET_TASKS", payload: tasksByStatus });

      setSnackbar({
        open: true,
        message: decision === "accept" ? "Task accepted!" : "Task rejected!",
        severity: "success",
      });
    } catch (error) {
      logError("Error submitting review:", error);
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
// إنشاء مهمة جديدة أو تعديل مهمة حالية
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter task title",
        severity: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", newTask.title);

      if (newTask.description && newTask.description.trim()) {
        formData.append("Description", newTask.description);
      }

      if (newTask.UploadFile) {
        formData.append("UploadFile", newTask.UploadFile);
      }

      if (editingTask && newTask.progressPercentage !== undefined) {
        formData.append("ProgressPercentage", newTask.progressPercentage);
      }

      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData, token);
        await taskService.updateProjectProgress(cardData.id, token);

        setSnackbar({
          open: true,
          message: "Task updated successfully!",
          severity: "success",
        });
      } else {
        await taskService.createTask(cardData.id, formData, token);
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
      logError("Error saving task:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to save task",
        severity: "error",
      });
    }
  };
// إنشاء مهمة جديدة من داخل عمود المهام
  const handleTaskFromColumn = async (formData) => {
    if (!formData.title.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter both task title and description",
        severity: "error",
      });
      return;
    }
    try {
      const data = new FormData();
      data.append("Title", formData.title);
      if (formData.description && formData.description.trim()) {
        data.append("Description", formData.description);
      }
      if (formData.uploadFile) {
        data.append("UploadFile", formData.uploadFile);
      }
      await taskService.createTask(cardData.id, data, token);
      setSnackbar({
        open: true,
        message: "Task added successfully!",
        severity: "success",
      });
    } catch (error) {
      logError("Error saving task:", error);
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
      setAnchorEl(null);
      setSelectedTask(null);

      setSnackbar({
        open: true,
        message: "Task deleted successfully",
        severity: "success",
      });
    } catch (error) {
      logError("Error deleting task:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to delete task",
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
    /**هنا بنفحص كل الأعمدة 
     * (ToDo, InProgress, InReview, Done) 
     * لنشوف أي عمود موجود فيه
     *  التاسك المسحوب.
     *  */
    if (!draggedTask) return;
    let currentStatus = null;
    for (const status of statuses) {
      if (tasks[status].find((t) => t.id === draggedTask.id)) {
        // العمود الحالي للتاسك
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
    if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
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
      } else if (targetStatus === "InReview" && currentStatus === "InProgress") {
        setTaskForReview(draggedTask);
        setOpenReviewDueDateDialog(true);
        setDraggedTask(null);
        return;
      } else if (targetStatus === "InProgress" && currentStatus === "InReview") {
        await taskService.moveToInProgress(draggedTask.id, token);
      } else if (targetStatus === "Done" && currentStatus === "InReview") {
        await taskService.acceptTask(draggedTask.id, "", token);
      }
      await taskService.updateProjectProgress(cardData.id, token);
      setSnackbar({
        open: true,
        message: `Task moved to ${statusLabels[targetStatus]}!`,
        severity: "success",
      });
    } catch (error) {
      logError("Error moving task:", error);

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
      console.log("Submitting task for review:", taskForReview.id);
      await taskService.submitForReview(taskForReview.id, reviewDueDate, token);
      await taskService.updateProjectProgress(cardData.id, token);
      setSnackbar({
        open: true,
        message: reviewDueDate
          ? "Task submitted for review with deadline!"
          : "Task submitted for review!",
        severity: "success",
      });
    } catch (error) {
      logError("Error submitting for review:", error);
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

  // Manual status update without fetch
  const handleProjectStatusUpdate = async (newStatus, snackbarConfig = null) => {
    setCardData((prev) => ({
      ...prev,
      projectStatus: newStatus,
      status: newStatus,
    }));
    setProjectDetails((prev) => ({
      ...prev,
      status: newStatus,
    }));
    if (snackbarConfig) {
      setSnackbar({
        open: true,
        message: snackbarConfig.message,
        severity: snackbarConfig.severity,
      });
    }
  };

  // ===== Computed Values =====
  const completedTasks = tasks.Done.length;
  const totalTasks = Object.values(tasks).reduce(
    (sum, list) => sum + list.length,0);
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>No project data available</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TrackTasksHeader
        key={`${cardData?.id}-${cardData?.projectStatus}`}
        onProjectStatusUpdate={handleProjectStatusUpdate}
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