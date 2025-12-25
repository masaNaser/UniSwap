// import React, { useState, useEffect, useRef } from "react";
// import { Container, CircularProgress, Box, Typography } from "@mui/material";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import TrackTasksHeader from "./components/TrackTasksHeader";
// import StatsSection from "./components/StatsSection";
// import KanbanBoard from "./components/KanbanBoard";
// import TaskDialog from "./components/TaskDialog";
// import TaskMenu from "./components/TaskMenu";
// import TaskSnackbar from "./components/TaskSnackbar";
// import TaskReviewDialog from "./components/TaskReviewDialog";
// import ViewTaskReviewDialog from "./components/ViewTaskReviewDialog";
// import ReviewDueDateDialog from "./components/ReviewDueDateDialog";
// import * as taskService from "../../services/taskService";
// import { mapProjectStatus } from "../../utils/projectStatusMapper";
// import {
//   getServiceProviderDashboard,
//   getClientdashboard,
// } from "../../services/projectService";
// import { useCurrentUser } from "../../Context/CurrentUserContext"; // ✅ أضيفي هاد
// import { getToken } from "../../utils/authHelpers";
// import { createProjectHubConnection } from "../../services/projectHub"; // تأكد من المسار الصحيح
// const statuses = ["ToDo", "InProgress", "InReview", "Done"];
// const statusLabels = {
//   ToDo: "To Do",
//   InProgress: "In Progress",
//   InReview: "In Review",
//   Done: "Done",
// };

// export default function TrackTasks() {
//   const connectionRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const initialCardData = location.state;
//   const { taskId } = useParams(); //  اجلبي الـ ID من الـ URL
//   const { updateCurrentUser } = useCurrentUser();

//   const [cardData, setCardData] = useState(initialCardData);
//   console.log("cardData", initialCardData);
//   const isProvider = cardData?.isProvider || false;
//   // const token = localStorage.getItem("accessToken");
//   const token = getToken();
//   // State management
//   const [tasks, setTasks] = useState({
//     ToDo: [],
//     InProgress: [],
//     InReview: [],
//     Done: [],
//   });

//   const [projectDetails, setProjectDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     status: "ToDo",
//     UploadFile: null,
//   });
//   const [draggedTask, setDraggedTask] = useState(null);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [openReviewDialog, setOpenReviewDialog] = useState(false);
//   const [reviewingTask, setReviewingTask] = useState(null);
//   const [openViewReviewDialog, setOpenViewReviewDialog] = useState(false);
//   const [viewingReviewTask, setViewingReviewTask] = useState(null);

//   // ✅ Review Due Date Dialog State
//   const [openReviewDueDateDialog, setOpenReviewDueDateDialog] = useState(false);
//   const [taskForReview, setTaskForReview] = useState(null);

//   useEffect(() => {
//     let isMounted = true;
//     let connection = null;

//     const startConnection = async () => {
//       if (!cardData?.id || !token) return;

//       connection = createProjectHubConnection();
//       connectionRef.current = connection;

//       try {
//         await connection.start();
//         if (isMounted) {
//           console.log("Connected to SignalR Hub ✅");
//           await connection.invoke("JoinProject", cardData.id);
//           const STATUS_MAP = {
//             0: "ToDo",
//             1: "InProgress",
//             2: "InReview",
//             3: "Done",
//           };
//           // 1. عند إنشاء مهمة جديدة
//           // 1. عند إنشاء مهمة جديدة
//           connection.on("TaskCreated", (newTask) => {
//             // التأكد أن الـ status نصي
//             const statusKey =
//               typeof newTask.status === "number"
//                 ? STATUS_MAP[newTask.status]
//                 : newTask.status;

//             setTasks((prev) => {
//               const currentList = prev[statusKey] || [];
//               // منع التكرار
//               if (currentList.some((t) => t.id === newTask.id)) return prev;

//               return {
//                 ...prev,
//                 [statusKey]: [
//                   ...currentList,
//                   { ...newTask, status: statusKey },
//                 ],
//               };
//             });
//           });

//           // 2. عند تغيير حالة المهمة (نقلها)
//           connection.on("TaskStatusChanged", (updatedTask) => {
//             const statusKey =
//               typeof updatedTask.status === "number"
//                 ? STATUS_MAP[updatedTask.status]
//                 : updatedTask.status;

//             setTasks((prev) => {
//               const newState = { ...prev };

//               // حذف المهمة من أي قائمة قديمة كانت فيها
//               Object.keys(newState).forEach((key) => {
//                 newState[key] = newState[key].filter(
//                   (t) => t.id !== updatedTask.id
//                 );
//               });

//               // إضافتها للقائمة الجديدة
//               if (newState[statusKey]) {
//                 newState[statusKey] = [
//                   ...newState[statusKey],
//                   { ...updatedTask, status: statusKey },
//                 ];
//               }

//               return newState;
//             });
//           });

//           // 3. عند تحديث نسبة إنجاز المشروع
//           connection.on("ProjectProgressUpdated", (data) => {
//             console.log("SignalR: ProjectProgressUpdated", data);
//             setProjectDetails((prev) => ({
//               ...prev,
//               progressPercentage: data.progressPercentage,
//             }));
//           });

//           // 4. عند حذف مهمة
//           connection.on("TaskDeleted", (data) => {
//             console.log("SignalR: TaskDeleted", data);
//             setTasks((prev) => {
//               const newState = { ...prev };
//               Object.keys(newState).forEach(
//                 (s) =>
//                   (newState[s] = newState[s].filter(
//                     (t) => t.id !== data.taskId
//                   ))
//               );
//               return newState;
//             });
//           });
//         }
//       } catch (err) {
//         console.error("SignalR Connection Error: ", err);
//       }
//     };

//     startConnection();

//     return () => {
//       isMounted = false;
//       if (connection) {
//         connection.stop();
//       }
//     };
//   }, [cardData?.id]);

//   // Fetch project status from dashboard
//   const fetchProjectStatus = async () => {
//     if (!cardData?.id || !token) {
//       console.log("⚠️ Cannot fetch status - missing cardData.id or token");
//       return null;
//     }

//     try {
//       console.log(
//         "🔄 Fetching project status from dashboard for ID:",
//         cardData.id
//       );
//       console.log("👤 User role:", isProvider ? "Provider" : "Client");

//       const filters = [
//         "All Status",
//         "Active",
//         "SubmittedForFinalReview",
//         "Completed",
//         "Overdue",
//       ];

//       for (const filter of filters) {
//         console.log(`🔍 Checking "${filter}" filter...`);

//         try {
//           const dashboardRes = isProvider
//             ? await getServiceProviderDashboard(token, "Provider", filter)
//             : await getClientdashboard(token, "client", filter);

//           console.log(
//             `📦 Response from "${filter}":`,
//             dashboardRes?.data?.items?.length || 0,
//             "items"
//           );

//           if (dashboardRes?.data?.items) {
//             const currentProject = dashboardRes.data.items.find(
//               (p) =>
//                 p.id === cardData.id ||
//                 p.projectId === cardData.id ||
//                 p.Id === cardData.id ||
//                 p.ProjectId === cardData.id
//             );

//             if (currentProject) {
//               const status =
//                 currentProject.projectStatus || currentProject.status;
//               console.log("✅ FOUND PROJECT!");
//               console.log("   - Filter:", filter);
//               console.log("   - Status Field:", status);
//               console.log("   - Full Project:", currentProject);
//               return status;
//             } else {
//               console.log(
//                 `   ❌ Project ID ${cardData.id} not found in this filter`
//               );
//             }
//           }
//         } catch (filterError) {
//           console.error(`❌ Error checking "${filter}" filter:`, filterError);
//         }
//       }

//       console.log("⚠️ Project not found in ANY filter");
//       return null;
//     } catch (err) {
//       console.error("❌ Failed to fetch status from dashboard:", err);
//       return null;
//     }
//   };

//   // Fetch project data
//   //  const fetchProjectData = async () => {
//   //     const projectId = cardData?.id || taskId;
//   //     if (!projectId || !token) {
//   //         console.log("⚠️ Cannot fetch - missing project ID or token");
//   //         setLoading(false);
//   //         return;
//   //     }

//   //     try {
//   //         setLoading(true);

//   //         const detailsRes = await taskService.getProjectTaskDetails(projectId, token);
//   //         console.log("✅ Fetched project details:", detailsRes);

//   //         // ✅ اعملي cardData كامل مرة واحدة

//   //         const apiData = detailsRes.data;

//   //         const newCardData = {
//   //             id: projectId,
//   //             title: apiData.title || apiData.projectName || 'Project', // ✅ من الـ API
//   //             description: apiData.description || '',
//   //              clientName: apiData.providerName || '',
//   //              clientAvatar: apiData.providerAvatar || '',
//   //             clientInitials: apiData.providerName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CL',
//   //             clientInitials: apiData.providerName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CL',
//   //             providerName: apiData.providerName || '',
//   //             providerAvatar: apiData.providerAvatar || '',
//   //             isProvider: apiData.isProvider ?? (cardData?.isProvider ?? false),
//   //             projectStatus: apiData.status || 'Active',
//   //             deadline: apiData.deadline,
//   //             progressPercentage: apiData.progressPercentage || 0,
//   //             rejectionReason: apiData.rejectionReason || '',
//   //             projectType: apiData.type || 'RequestProject',
//   //         };

//   //         setCardData(newCardData);
//   //         setProjectDetails(apiData);

//   //         console.log("🔍 Fetching current status from dashboard...");
//   //         const dashboardStatus = await fetchProjectStatus();

//   //         console.log("📊 Dashboard Status Result:", dashboardStatus);

//   //         // ✅ حدّث الـ status بس من الـ dashboard
//   //         if (dashboardStatus) {
//   //             const finalStatus = mapProjectStatus(dashboardStatus);
//   //             console.log("🎯 Final Status:", finalStatus, "from Dashboard");

//   //             setCardData(prev => ({
//   //                 ...prev,
//   //                 projectStatus: finalStatus,
//   //                 status: finalStatus,
//   //             }));
//   //         }

//   //         // ✅ جلب المهام
//   //         const tasksRes = await taskService.getTasksByStatus(projectId, null, token);
//   //         console.log("All Tasks:", tasksRes.data);

//   //         const allTasks = tasksRes.data;
//   //         const tasksByStatus = {
//   //             ToDo: [],
//   //             InProgress: [],
//   //             InReview: [],
//   //             Done: [],
//   //         };

//   //         allTasks.forEach((task) => {
//   //             const status = task.status;
//   //             if (tasksByStatus[status]) {
//   //                 tasksByStatus[status].push(task);
//   //             }
//   //         });

//   //         setTasks(tasksByStatus);
//   //     } catch (error) {
//   //         console.error("Error fetching tasks:", error);
//   //         setSnackbar({
//   //             open: true,
//   //             message: "Failed to load tasks",
//   //             severity: "error",
//   //         });
//   //     } finally {
//   //         setLoading(false);
//   //     }
//   // };

//   //   useEffect(() => {
//   //     console.log("📍 useEffect triggered - cardData.id:", cardData?.id);
//   //     fetchProjectData();
//   //   }, [taskId]);
//   const fetchProjectData = async () => {
//     if (!cardData?.id || !token) {
//       console.log("⚠️ Cannot fetch - missing cardData.id or token", {
//         cardData,
//         token: !!token,
//       });
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("🔄 Fetching project data for ID:", cardData.id);

//       const detailsRes = await taskService.getProjectTaskDetails(
//         cardData.id,
//         token
//       );
//       console.log("✅ Fetched project details:", detailsRes);
//       setProjectDetails(detailsRes.data);

//       console.log("🔍 Fetching current status from dashboard...");
//       const dashboardStatus = await fetchProjectStatus();

//       console.log("📊 Dashboard Status Result:", dashboardStatus);

//       setCardData((prev) => {
//         const finalStatus = dashboardStatus
//           ? mapProjectStatus(dashboardStatus)
//           : prev.projectStatus || "Active";

//         console.log("🎯 Final Status:", finalStatus, "from Dashboard");

//         return {
//           ...prev,
//           title:
//             detailsRes.data.title || detailsRes.data.projectName || "Project",
//           //             description: apiData.description || '',
//           description: detailsRes.data.description || "",
//           projectStatus: finalStatus,
//           status: finalStatus,
//           deadline: detailsRes.data.deadline,
//           progressPercentage:
//             detailsRes.data.progressPercentage || prev.progressPercentage || 0,
//           rejectionReason:
//             detailsRes.data.rejectionReason || prev.rejectionReason,
//           projectType:
//             detailsRes.data.type || prev.projectType || "RequestProject",
//         };
//       });

//       const tasksRes = await taskService.getTasksByStatus(
//         cardData.id,
//         null,
//         token
//       );
//       console.log("All Tasks:", tasksRes.data);

//       const allTasks = tasksRes.data;

//       const tasksByStatus = {
//         ToDo: [],
//         InProgress: [],
//         InReview: [],
//         Done: [],
//       };

//       allTasks.forEach((task) => {
//         const status = task.status;
//         if (tasksByStatus[status]) {
//           tasksByStatus[status].push(task);
//         }
//       });

//       setTasks(tasksByStatus);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       setSnackbar({
//         open: true,
//         message: "Failed to load tasks",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("📍 useEffect triggered - cardData.id:", cardData?.id);
//     fetchProjectData();
//   }, [taskId]);

//   // تحديث الموعد النهائي في الحالة المحلية
//   const handleDeadlineUpdate = (newDeadline) => {
//     setCardData((prev) => ({ ...prev, deadline: newDeadline }));
//     setProjectDetails((prev) => ({ ...prev, deadline: newDeadline }));
//   };

//   // تحديث حالة المشروع عند الإغلاق
//   const handleProjectClosed = async (skipSuccessMessage = false) => {
//     try {
//       console.log("🔄 handleProjectClosed called - refreshing project data...");

//       // await fetchProjectData();

//       // Only show snackbar if skipSuccessMessage is false
//       if (!skipSuccessMessage) {
//         setSnackbar({
//           open: true,
//           message: "Project status updated successfully!",
//           severity: "success",
//         });
//       }
//     } catch (error) {
//       console.error("Error refreshing project data:", error);
//       setSnackbar({
//         open: true,
//         message:
//           "Project closed but failed to refresh data. Please reload the page.",
//         severity: "warning",
//       });
//     }
//   };
//   //  Handle task review submission
//   const handleSubmitReview = async (taskId, decision, comment) => {
//     try {
//       if (decision === "accept") {
//         await taskService.acceptTask(taskId, comment, token);
//       } else {
//         await taskService.rejectTask(taskId, comment, token);
//       }

//       await taskService.updateProjectProgress(cardData.id, token);

//       const [tasksRes, detailsRes] = await Promise.all([
//         taskService.getTasksByStatus(cardData.id, null, token),
//         taskService.getProjectTaskDetails(cardData.id, token),
//       ]);

//       const allTasks = tasksRes.data;

//       const tasksByStatus = {
//         ToDo: [],
//         InProgress: [],
//         InReview: [],
//         Done: [],
//       };

//       allTasks.forEach((task) => {
//         if (tasksByStatus[task.status]) {
//           tasksByStatus[task.status].push(task);
//         }
//       });

//       setTasks(tasksByStatus);
//       setProjectDetails(detailsRes.data);

//       setSnackbar({
//         open: true,
//         message:
//           decision === "accept"
//             ? "Task accepted successfully!"
//             : "Task rejected. Revision comments saved.",
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to submit review",
//         severity: "error",
//       });
//     }
//   };
//   //  Handle review button click
//   const handleReviewClick = (task) => {
//     setReviewingTask(task);
//     setOpenReviewDialog(true);
//   };

//   const handleViewReview = async (task) => {
//     setViewingReviewTask(task);
//     setOpenViewReviewDialog(true);
//   };

//   const handleAddTask = async () => {
//     if (!newTask.title.trim() || !newTask.description.trim()) {
//       setSnackbar({
//         open: true,
//         message: "Please enter both task title and description",
//         severity: "error",
//       });
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("Title", newTask.title);
//       formData.append("Description", newTask.description || "");

//       if (newTask.uploadFile) {
//         formData.append("UploadFile", newTask.uploadFile);
//       }

//       if (editingTask && newTask.progressPercentage !== undefined) {
//         formData.append("ProgressPercentage", newTask.progressPercentage);
//       }

//       if (editingTask) {
//         await taskService.updateTask(editingTask.id, formData, token);
//         await taskService.updateProjectProgress(cardData.id, token);

//         const [tasksRes, detailsRes] = await Promise.all([
//           taskService.getTasksByStatus(cardData.id, null, token),
//           taskService.getProjectTaskDetails(cardData.id, token),
//         ]);

//         const allTasks = tasksRes.data;

//         const tasksByStatus = {
//           ToDo: [],
//           InProgress: [],
//           InReview: [],
//           Done: [],
//         };

//         allTasks.forEach((task) => {
//           if (tasksByStatus[task.status]) {
//             tasksByStatus[task.status].push(task);
//           }
//         });

//         setTasks(tasksByStatus);
//         setProjectDetails(detailsRes.data);

//         setSnackbar({
//           open: true,
//           message: "Task updated successfully!",
//           severity: "success",
//         });
//       } else {
//         const res = await taskService.createTask(cardData.id, formData, token);
//         const createdTask = res.data;
//         setTasks((prev) => ({
//           ...prev,
//           [createdTask.status]: [...prev[createdTask.status], createdTask],
//         }));
//         setSnackbar({
//           open: true,
//           message: "Task added successfully!",
//           severity: "success",
//         });
//       }

//       setOpenDialog(false);
//       setNewTask({
//         title: "",
//         description: "",
//         status: "ToDo",
//         uploadFile: null,
//         progressPercentage: 0,
//       });
//       setEditingTask(null);
//     } catch (error) {
//       console.error("Error saving task:", error);
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to save task",
//         severity: "error",
//       });
//     }
//   };

//   const handleTaskFromColumn = async (formData) => {
//     if (!formData.title.trim() || !formData.description.trim()) {
//       setSnackbar({
//         open: true,
//         message: "Please enter both task title and description",
//         severity: "error",
//       });
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append("Title", formData.title);
//       data.append("Description", formData.description || "");

//       if (formData.uploadFile) {
//         data.append("UploadFile", formData.uploadFile);
//       }

//       const res = await taskService.createTask(cardData.id, data, token);
//       console.log("Created Task:", res.data);
//       const createdTask = res.data;
//       setTasks((prev) => ({
//         ...prev,
//         [createdTask.status]: [...prev[createdTask.status], createdTask],
//       }));
//       setSnackbar({
//         open: true,
//         message: "Task added successfully!",
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error saving task:", error);
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to save task",
//         severity: "error",
//       });
//     }
//   };

//   const handleDeleteTask = async (status, taskId) => {
//     try {
//       await taskService.deleteTask(taskId, token);
//       // لا تضع setTasks هنا، الـ SignalR سيفعل ذلك عبر حدث "TaskDeleted"
//       setSnackbar({ open: true, message: "Request sent...", severity: "info" });
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: "Failed to delete",
//         severity: "error",
//       });
//     }
//   };

//   const handleEditTask = (task, status) => {
//     setEditingTask({ ...task, status });
//     setNewTask({
//       title: task.title,
//       description: task.description || "",
//       status,
//       uploadFile: null,
//       progressPercentage: task.progressPercentage || 0,
//     });
//     setOpenDialog(true);
//     setAnchorEl(null);
//   };

//   const handleDragStart = (e, task) => {
//     setDraggedTask(task);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = async (e, targetStatus) => {
//     e.preventDefault();
//     if (!draggedTask) return;

//     let currentStatus = null;
//     for (const status of statuses) {
//       if (tasks[status].find((t) => t.id === draggedTask.id)) {
//         currentStatus = status;
//         break;
//       }
//     }

//     if (currentStatus === targetStatus) {
//       setDraggedTask(null);
//       return;
//     }

//     const allowedTransitions = {
//       ToDo: ["InProgress"],
//       InProgress: ["InReview"],
//       InReview: ["InProgress", "Done"],
//       Done: [],
//     };

//     if (!allowedTransitions[currentStatus].includes(targetStatus)) {
//       setSnackbar({
//         open: true,
//         message: `Cannot move task from ${statusLabels[currentStatus]} to ${statusLabels[targetStatus]}`,
//         severity: "warning",
//       });
//       setDraggedTask(null);
//       return;
//     }

//     try {
//       if (targetStatus === "InProgress" && currentStatus === "ToDo") {
//         await taskService.moveToInProgress(draggedTask.id, token);
//       } else if (
//         targetStatus === "InReview" &&
//         currentStatus === "InProgress"
//       ) {
//         // ✅ Open dialog instead of direct submission
//         setTaskForReview(draggedTask);
//         setOpenReviewDueDateDialog(true);
//         setDraggedTask(null);
//         return; // Don't proceed with move yet
//       } else if (
//         targetStatus === "InProgress" &&
//         currentStatus === "InReview"
//       ) {
//         await taskService.moveToInProgress(draggedTask.id, token);
//       } else if (targetStatus === "Done" && currentStatus === "InReview") {
//         await taskService.acceptTask(draggedTask.id, "", token);
//       }

//       await taskService.updateProjectProgress(cardData.id, token);

//       const [tasksRes, detailsRes] = await Promise.all([
//         taskService.getTasksByStatus(cardData.id, null, token),
//         taskService.getProjectTaskDetails(cardData.id, token),
//       ]);

//       const allTasks = tasksRes.data;

//       const tasksByStatus = {
//         ToDo: [],
//         InProgress: [],
//         InReview: [],
//         Done: [],
//       };

//       allTasks.forEach((task) => {
//         if (tasksByStatus[task.status]) {
//           tasksByStatus[task.status].push(task);
//         }
//       });

//       setTasks(tasksByStatus);
//       setProjectDetails(detailsRes.data);

//       setSnackbar({
//         open: true,
//         message: `Task moved to ${statusLabels[targetStatus]}!`,
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error moving task:", error);

//       const backendError =
//         error.response?.data?.detail || error.response?.data?.message;

//       let errorMessage;
//       let severity = "warning";

//       if (
//         backendError &&
//         (backendError.includes("must be Rejected") ||
//           backendError.includes("Forbidden") ||
//           backendError.includes("not allowed"))
//       ) {
//         errorMessage = `Cannot move task from ${statusLabels[currentStatus]} to ${statusLabels[targetStatus]}`;
//       } else {
//         errorMessage = backendError || "Failed to move task";
//         severity = "error";
//       }

//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: severity,
//       });
//     }
//     setDraggedTask(null);
//   };

//   // ✅ Handle review due date submission
//   const handleReviewDueDateSubmit = async (reviewDueDate) => {
//     if (!taskForReview) return;

//     try {
//       console.log("📤 User entered datetime:", reviewDueDate);
//       console.log("📤 Sending to backend:", reviewDueDate);

//       await taskService.submitForReview(taskForReview.id, reviewDueDate, token);

//       await taskService.updateProjectProgress(cardData.id, token);

//       const [tasksRes, detailsRes] = await Promise.all([
//         taskService.getTasksByStatus(cardData.id, null, token),
//         taskService.getProjectTaskDetails(cardData.id, token),
//       ]);

//       const allTasks = tasksRes.data;
//       const tasksByStatus = {
//         ToDo: [],
//         InProgress: [],
//         InReview: [],
//         Done: [],
//       };

//       allTasks.forEach((task) => {
//         if (tasksByStatus[task.status]) {
//           tasksByStatus[task.status].push(task);
//         }
//       });

//       setTasks(tasksByStatus);
//       setProjectDetails(detailsRes.data);

//       console.log("✅ Task submitted successfully");

//       setSnackbar({
//         open: true,
//         message: reviewDueDate
//           ? "Task submitted for review with deadline!"
//           : "Task submitted for review!",
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Error submitting for review:", error);
//       setSnackbar({
//         open: true,
//         message: error.response?.data?.message || "Failed to submit for review",
//         severity: "error",
//       });
//     }
//   };

//   const handleOpenMenu = (e, task, status) => {
//     setSelectedTask({ task, status });
//     setAnchorEl(e.currentTarget);
//   };

//   const completedTasks = tasks.Done.length;
//   const totalTasks = Object.values(tasks).reduce(
//     (sum, list) => sum + list.length,
//     0
//   );
//   const progressPercentage = projectDetails?.progressPercentage || 0;

//   if (loading) {
//     return (
//       <Container
//         maxWidth="lg"
//         sx={{
//           py: 4,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (!cardData) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Typography>Loading...</Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <TrackTasksHeader
//         cardData={cardData}
//         projectDetails={projectDetails}
//         isProvider={isProvider}
//         totalTasks={totalTasks}
//         completedTasks={completedTasks}
//         progressPercentage={progressPercentage}
//         onBack={() => navigate(-1)}
//         onDeadlineUpdate={handleDeadlineUpdate}
//         onProjectClosed={handleProjectClosed}
//       />

//       <StatsSection
//         totalTasks={totalTasks}
//         inProgressCount={tasks.InProgress.length}
//         inReviewCount={tasks.InReview.length}
//         completedCount={completedTasks}
//       />

//       <KanbanBoard
//         statuses={statuses}
//         statusLabels={statusLabels}
//         tasks={tasks}
//         isProvider={isProvider}
//         draggedTask={draggedTask}
//         onDragStart={handleDragStart}
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         onMenuOpen={handleOpenMenu}
//         onAddTask={handleTaskFromColumn}
//         onReviewClick={handleReviewClick}
//         onViewReview={handleViewReview}
//         projectStatus={cardData.projectStatus}
//       />

//       <TaskDialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         editingTask={editingTask}
//         newTask={newTask}
//         onTaskChange={setNewTask}
//         onSubmit={handleAddTask}
//         isProvider={isProvider}
//       />

//       <TaskReviewDialog
//         open={openReviewDialog}
//         onClose={() => setOpenReviewDialog(false)}
//         task={reviewingTask}
//         onSubmitReview={handleSubmitReview}
//       />

//       <ViewTaskReviewDialog
//         open={openViewReviewDialog}
//         onClose={() => setOpenViewReviewDialog(false)}
//         task={viewingReviewTask}
//       />

//       {/* ✅ Review Due Date Dialog */}
//       <ReviewDueDateDialog
//         open={openReviewDueDateDialog}
//         onClose={() => {
//           setOpenReviewDueDateDialog(false);
//           setTaskForReview(null);
//         }}
//         onSubmit={handleReviewDueDateSubmit}
//         taskTitle={taskForReview?.title || ""}
//         projectType={cardData?.projectType || "RequestProject"}
//         projectDeadline={cardData?.deadline}
//       />

//       <TaskMenu
//         anchorEl={anchorEl}
//         selectedTask={selectedTask}
//         onClose={() => setAnchorEl(null)}
//         onEdit={() => {
//           if (selectedTask) {
//             handleEditTask(selectedTask.task, selectedTask.status);
//           }
//         }}
//         onDelete={() => {
//           if (selectedTask) {
//             handleDeleteTask(selectedTask.status, selectedTask.task.id);
//           }
//         }}
//       />

//       <TaskSnackbar
//         snackbar={snackbar}
//         onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
//       />
//     </Container>
//   );
// }

import React, { useState, useEffect, useRef, useReducer } from "react";
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
const tasksReducer = (state, action) => {
  try {
    switch (action.type) {
      case "SET_TASKS":
        return action.payload;

      case "TASK_CREATED": {
        const statusKey =
          typeof action.payload.status === "number"
            ? STATUS_MAP[action.payload.status]
            : action.payload.status;

        if (!state[statusKey]) {
          logError(`Invalid status key: ${statusKey}`);
          return state;
        }

        // منع التكرار
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

        // حذف المهمة من جميع القوائم
        Object.keys(newState).forEach((key) => {
          newState[key] = newState[key].filter(
            (t) => t.id !== action.payload.id
          );
        });

        // إضافتها للقائمة الجديدة
        newState[statusKey] = [
          ...newState[statusKey],
          { ...action.payload, status: statusKey },
        ];

        return newState;
      }

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

  // ✅ استخدام useReducer بدلاً من useState
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

  // ===== SignalR Connection =====
  // في بداية الكومبوننت، أضف ref لتتبع آخر cardData
  // في بداية الكومبوننت
  const cardDataRef = useRef(cardData);

  // حدّث الـ ref كل ما cardData يتغير
  useEffect(() => {
    cardDataRef.current = cardData;
  }, [cardData]);

  // ===== SignalR Connection =====
  useEffect(() => {
    if (!cardData?.id || !token) {
      log("⚠️ Cannot start SignalR - missing cardData.id or token");
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

        log("✅ Connected to SignalR Hub");
        await connection.invoke("JoinProject", cardData.id);

        // --- Task Events ---
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

        // --- Project Progress ---
        connection.on("ProjectProgressUpdated", (data) => {
          log("SignalR: ProjectProgressUpdated", data);
          setProjectDetails((prev) => ({
            ...prev,
            progressPercentage: data.progressPercentage,
          }));
        });

        // --- ✅ المشروع تم إغلاقه من قبل البروفايدر ---
        connection.on("ProjectClosed", (data) => {
          log("🔔 SignalR: Received ProjectClosed", data);

          // استخدم الـ ref للحصول على آخر cardData
          const currentCardData = cardDataRef.current;

          // تحقق من الـ project ID (جرب كل الاحتمالات)
          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = currentCardData?.id;

          log("Comparing IDs:", { receivedProjectId, currentProjectId });

          if (receivedProjectId === currentProjectId) {
            log("✅ Project IDs match - updating status");

            // حدّث الـ cardData
            setCardData((prev) => {
              log("Old cardData:", prev);
              const newData = {
                ...prev,
                projectStatus: "SubmittedForFinalReview",
              };
              log("New cardData:", newData);
              return newData;
            });

            // حدّث الـ projectDetails أيضاً
            setProjectDetails((prev) => ({
              ...prev,
              status: "SubmittedForFinalReview",
            }));

            // أظهر رسالة
            setSnackbar({
              open: true,
              message:
                "🎉 The provider has submitted the work! Review is now available.",
              severity: "info",
            });

            log("✅ State updated successfully");
          } else {
            log("⚠️ Project IDs don't match - ignoring event");
          }
        });
        // --- ✅ المشروع اكتمل (قبله الكلاينت) ---
        connection.on("ProjectCompleted", (data) => {
          log("🔔 SignalR: Received ProjectCompleted", data);

          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = cardDataRef.current?.id;

          if (receivedProjectId === currentProjectId) {
            log("✅ Client accepted the project!");

            setCardData((prev) => ({
              ...prev,
              projectStatus: "Completed",
            }));

            setProjectDetails((prev) => ({
              ...prev,
              status: "Completed",
            }));

            setSnackbar({
              open: true,
              message: "🎉 The client has accepted the project! Well done!",
              severity: "success",
            });
          }
        });

           // --- المشروع اكتمل ونُشر نهائياً ---
        connection.on("ProjectPublished", (data) => {
          log("SignalR: ProjectPublished", data);

          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = cardDataRef.current?.id;

          if (receivedProjectId === currentProjectId) {
            setCardData((prev) => ({ ...prev, projectStatus: "Completed" }));
          
            setSnackbar({
              open: true,
              message:
                "🎉 Project has been officially completed and published!",
              severity: "success",
            });
          }
        });
        
         // --- ❌ المشروع رُفض (رفضه الكلاينت) ---
        connection.on("ProjectRejected", (data) => {
          log("🔔 SignalR: Received ProjectRejected", data);

          const receivedProjectId = data.projectId || data.ProjectId;
          const currentProjectId = cardDataRef.current?.id;

          if (receivedProjectId === currentProjectId) {
            log("⚠️ Client rejected the project");

            setCardData((prev) => ({
              ...prev,
              projectStatus: "Active",
            }));

            setProjectDetails((prev) => ({
              ...prev,
              status: "Active",
              rejectionReason: data.reason || data.Reason || "No reason provided",
            }));

            setSnackbar({
              open: true,
              message: `⚠️ Project rejected: ${data.reason || data.Reason || "Check rejection details"}`,
              severity: "warning",
            });
          }
        });

      } catch (err) {
        logError("❌ SignalR Connection Error:", err);
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
        log("🔌 Disconnecting SignalR...");
        connection
          .stop()
          .catch((err) => logError("Error stopping connection:", err));
      }
    };
  }, [cardData?.id, token]);

  // ===== Fetch Project Status =====
  const fetchProjectStatus = async () => {
    if (!cardData?.id || !token) {
      log("⚠️ Cannot fetch status - missing cardData.id or token");
      return null;
    }

    try {
      log("🔄 Fetching project status from dashboard for ID:", cardData.id);

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
              log(`✅ Found project in "${filter}" with status:`, status);
              return status;
            }
          }
        } catch (filterError) {
          logError(`Error checking "${filter}" filter:`, filterError);
        }
      }

      log("⚠️ Project not found in any filter");
      return null;
    } catch (err) {
      logError("❌ Failed to fetch status from dashboard:", err);
      return null;
    }
  };

  // ===== Fetch Project Data =====
  const fetchProjectData = async () => {
    if (!cardData?.id || !token) {
      log("⚠️ Cannot fetch - missing cardData.id or token");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      log("🔄 Fetching project data for ID:", cardData.id);

      const detailsRes = await taskService.getProjectTaskDetails(
        cardData.id,
        token
      );
      log("✅ Fetched project details:", detailsRes.data);
      setProjectDetails(detailsRes.data);

      const dashboardStatus = await fetchProjectStatus();
      log("📊 Dashboard Status Result:", dashboardStatus);

      setCardData((prev) => {
        const finalStatus = dashboardStatus
          ? mapProjectStatus(dashboardStatus)
          : prev.projectStatus || "Active";

        return {
          ...prev,
          title:
            detailsRes.data.title || detailsRes.data.projectName || "Project",
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
    }
  };

  // ✅ Fixed Dependency Array
  useEffect(() => {
    if (!cardData?.id) {
      log("📍 Skipping fetch - no cardData.id");
      return;
    }
    log("📍 useEffect triggered - cardData.id:", cardData.id);
    fetchProjectData();
  }, [cardData?.id, token]);

  // ===== Handlers =====
  const handleDeadlineUpdate = (newDeadline) => {
    setCardData((prev) => ({ ...prev, deadline: newDeadline }));
    setProjectDetails((prev) => ({ ...prev, deadline: newDeadline }));
  };

const handleProjectClosed = async () => {
  try {
    log("🔄 Refreshing project data...");
    
    // 1. جلب البيانات يدوياً للتأكد
    const detailsRes = await taskService.getProjectTaskDetails(cardData.id, token);
    const newData = detailsRes.data;

    // 2. تحديث الحالة بشكل صريح ومباشر
    setCardData(prev => ({
      ...prev,
      projectStatus: "SubmittedForFinalReview", // القيمة التي تظهر الزر
      status: "SubmittedForFinalReview"
    }));

    setProjectDetails(newData);

    setSnackbar({
      open: true,
      message: "Project submitted! You can now publish.",
      severity: "success",
    });
  } catch (error) {
    logError("Error refreshing project data:", error);
  }
};

  const handleSubmitReview = async (taskId, decision, comment) => {
    try {
      if (decision === "accept") {
        await taskService.acceptTask(taskId, comment, token);
      } else {
        await taskService.rejectTask(taskId, comment, token);
      }

      // ✅ SignalR will handle the update, but we update progress
      await taskService.updateProjectProgress(cardData.id, token);

      setSnackbar({
        open: true,
        message:
          decision === "accept"
            ? "Task accepted successfully!"
            : "Task rejected. Revision comments saved.",
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

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter both task title and description",
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

        setSnackbar({
          open: true,
          message: "Task updated successfully!",
          severity: "success",
        });
      } else {
        await taskService.createTask(cardData.id, formData, token);
        // ✅ SignalR will handle adding to state

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

  const handleTaskFromColumn = async (formData) => {
    if (!formData.title.trim() || !formData.description.trim()) {
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
      data.append("Description", formData.description || "");

      if (formData.uploadFile) {
        data.append("UploadFile", formData.uploadFile);
      }

      await taskService.createTask(cardData.id, data, token);
      // ✅ SignalR will handle adding to state

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
      // ✅ SignalR will handle removing from state

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
      // ✅ SignalR will handle state update

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
      log("📤 Submitting task for review:", taskForReview.id);
      await taskService.submitForReview(taskForReview.id, reviewDueDate, token);
      await taskService.updateProjectProgress(cardData.id, token);
      // ✅ SignalR will handle state update

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

  // ===== Computed Values =====
  const completedTasks = tasks.Done.length;
  const totalTasks = Object.values(tasks).reduce(
    (sum, list) => sum + list.length,
    0
  );
  const progressPercentage = projectDetails?.progressPercentage || 0;

  // ===== Render =====
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
        // 🚩 السر هنا: عندما تتغير الحالة، الـ key سيتغير
        // مما يجبر الـ Header على "إعادة الرندرة" وحساب canCloseProject من جديد
        key={`${cardData?.id}-${cardData?.projectStatus}`}
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
