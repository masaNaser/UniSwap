import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import TrackTasksHeader from './components/TrackTasksHeader';
import StatsSection from './components/StatsSection';
import KanbanBoard from './components/KanbanBoard';
import TaskDialog from './components/TaskDialog';
import TaskMenu from './components/TaskMenu';
import TaskSnackbar from './components/TaskSnackbar';
import ReviewDialog from './components/ReviewDialog';
import ViewReviewDialog from './components/ViewReviewDialog';
import * as taskService from '../../services/taskService';
import { mapProjectStatus } from '../../utils/projectStatusMapper';
import { getServiceProviderDashboard, getClientdashboard } from '../../services/projectService';

const statuses = ['ToDo', 'InProgress', 'InReview', 'Done'];
const statusLabels = {
    'ToDo': 'To Do',
    'InProgress': 'In Progress',
    'InReview': 'In Review',
    'Done': 'Done',
};

export default function TrackTasks() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialCardData = location.state;

    const [cardData, setCardData] = useState(initialCardData);
    const isProvider = cardData?.isProvider || false;
    const token = localStorage.getItem('accessToken');

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
    const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', status: 'ToDo', UploadFile: null });
    const [draggedTask, setDraggedTask] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [reviewingTask, setReviewingTask] = useState(null);
    const [openViewReviewDialog, setOpenViewReviewDialog] = useState(false);
    const [viewingReviewTask, setViewingReviewTask] = useState(null);

    // Fetch project status from dashboard
    const fetchProjectStatus = async () => {
        if (!cardData?.id || !token) {
            console.log('⚠️ Cannot fetch status - missing cardData.id or token');
            return null;
        }

        try {
            console.log('🔄 Fetching project status from dashboard for ID:', cardData.id);
            console.log('👤 User role:', isProvider ? 'Provider' : 'Client');

            // Try all status filters to find the project
            const filters = ['All Status', 'Active', 'SubmittedForFinalReview', 'Completed', 'Overdue'];
            
            for (const filter of filters) {
                console.log(`🔍 Checking "${filter}" filter...`);
                
                try {
                    const dashboardRes = isProvider 
                        ? await getServiceProviderDashboard(token, "Provider", filter)
                        : await getClientdashboard(token, "client", filter);

                    console.log(`📦 Response from "${filter}":`, dashboardRes?.data?.items?.length || 0, 'items');

                    if (dashboardRes?.data?.items) {
                        const currentProject = dashboardRes.data.items.find(p => 
                            p.id === cardData.id || 
                            p.projectId === cardData.id || 
                            p.Id === cardData.id ||
                            p.ProjectId === cardData.id
                        );

                        if (currentProject) {
                            const status = currentProject.projectStatus || currentProject.status;
                            console.log('✅ FOUND PROJECT!');
                            console.log('   - Filter:', filter);
                            console.log('   - Status Field:', status);
                            console.log('   - Full Project:', currentProject);
                            return status;
                        } else {
                            console.log(`   ❌ Project ID ${cardData.id} not found in this filter`);
                        }
                    }
                } catch (filterError) {
                    console.error(`❌ Error checking "${filter}" filter:`, filterError);
                }
            }

            console.log('⚠️ Project not found in ANY filter');
            return null;
        } catch (err) {
            console.error('❌ Failed to fetch status from dashboard:', err);
            return null;
        }
    };

    // Fetch project data
    const fetchProjectData = async () => {
        if (!cardData?.id || !token) {
            console.log('⚠️ Cannot fetch - missing cardData.id or token', { cardData, token: !!token });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('🔄 Fetching project data for ID:', cardData.id);

            // Fetch project details
            const detailsRes = await taskService.getProjectTaskDetails(cardData.id, token);
            console.log('✅ Fetched project details:', detailsRes);
            setProjectDetails(detailsRes.data);

            // ALWAYS fetch current status from dashboard (it's the source of truth)
            console.log('🔍 Fetching current status from dashboard...');
            const dashboardStatus = await fetchProjectStatus();
            
            console.log('📊 Dashboard Status Result:', dashboardStatus);

            // Update cardData with latest status and details
            setCardData(prev => {
                const finalStatus = dashboardStatus 
                    ? mapProjectStatus(dashboardStatus) 
                    : (prev.projectStatus || 'Active');
                
                console.log('🎯 Final Status:', finalStatus, 'from Dashboard');
                
                return {
                    ...prev,
                    projectStatus: finalStatus,
                    status: finalStatus, // Set both for compatibility
                    deadline: detailsRes.data.deadline,
                    progressPercentage: detailsRes.data.progressPercentage || prev.progressPercentage || 0,
                    rejectionReason: detailsRes.data.rejectionReason || prev.rejectionReason
                };
            });

            // Fetch all tasks
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
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load tasks',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch project details and tasks on mount
    useEffect(() => {
        console.log('📍 useEffect triggered - cardData.id:', cardData?.id);
        fetchProjectData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Handler to update deadline in both states
    const handleDeadlineUpdate = (newDeadline) => {
        setCardData(prev => ({ ...prev, deadline: newDeadline }));
        setProjectDetails(prev => ({ ...prev, deadline: newDeadline }));
    };

    // Handler to refresh after project closure
    const handleProjectClosed = async () => {
        try {
            console.log('🔄 handleProjectClosed called - refreshing project data...');
            
            // Refresh project data to get latest status
            await fetchProjectData();
            
            setSnackbar({
                open: true,
                message: 'Project status updated successfully!',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error refreshing project data:', error);
            setSnackbar({
                open: true,
                message: 'Project closed but failed to refresh data. Please reload the page.',
                severity: 'warning',
            });
        }
    };

    // Handle review submission
    const handleSubmitReview = async (taskId, decision, comment) => {
        try {
            if (decision === 'accept') {
                await taskService.acceptTask(taskId, comment, token);
            } else {
                await taskService.rejectTask(taskId, comment, token);
            }

            // Update project progress
            await taskService.updateProjectProgress(cardData.id, token);

            // Refresh tasks and project details
            const [tasksRes, detailsRes] = await Promise.all([
                taskService.getTasksByStatus(cardData.id, null, token),
                taskService.getProjectTaskDetails(cardData.id, token)
            ]);

            const allTasks = tasksRes.data;

            const tasksByStatus = {
                ToDo: [],
                InProgress: [],
                InReview: [],
                Done: [],
            };

            allTasks.forEach(task => {
                if (tasksByStatus[task.status]) {
                    tasksByStatus[task.status].push(task);
                }
            });

            setTasks(tasksByStatus);
            setProjectDetails(detailsRes.data);

            setSnackbar({
                open: true,
                message: decision === 'accept' ? 'Task accepted successfully!' : 'Task rejected. Revision comments saved.',
                severity: 'success',
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to submit review',
                severity: 'error',
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

    // Task management functions
    const handleAddTask = async () => {
        if (!newTask.title.trim()) {
            setSnackbar({ open: true, message: 'Please enter a task title', severity: 'error' });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('Title', newTask.title);
            formData.append('Description', newTask.description || '');

            if (newTask.deadline) {
                formData.append('Deadline', new Date(newTask.deadline).toISOString());
            }

            if (newTask.uploadFile) {
                formData.append('UploadFile', newTask.uploadFile);
            }

            if (editingTask && newTask.progressPercentage !== undefined) {
                formData.append('ProgressPercentage', newTask.progressPercentage);
            }

            if (editingTask) {
                await taskService.updateTask(editingTask.id, formData, token);

                await taskService.updateProjectProgress(cardData.id, token);

                const [tasksRes, detailsRes] = await Promise.all([
                    taskService.getTasksByStatus(cardData.id, null, token),
                    taskService.getProjectTaskDetails(cardData.id, token)
                ]);

                const allTasks = tasksRes.data;

                const tasksByStatus = {
                    ToDo: [],
                    InProgress: [],
                    InReview: [],
                    Done: [],
                };

                allTasks.forEach(task => {
                    if (tasksByStatus[task.status]) {
                        tasksByStatus[task.status].push(task);
                    }
                });

                setTasks(tasksByStatus);
                setProjectDetails(detailsRes.data);

                setSnackbar({ open: true, message: 'Task updated successfully!', severity: 'success' });
            } else {
                const res = await taskService.createTask(cardData.id, formData, token);
                const createdTask = res.data;
                setTasks(prev => ({
                    ...prev,
                    [createdTask.status]: [...prev[createdTask.status], createdTask],
                }));
                setSnackbar({ open: true, message: 'Task added successfully!', severity: 'success' });
            }

            setOpenDialog(false);
            setNewTask({ title: '', description: '', deadline: '', status: 'ToDo', uploadFile: null, progressPercentage: 0 });
            setEditingTask(null);
        } catch (error) {
            console.error('Error saving task:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to save task',
                severity: 'error',
            });
        }
    };

    const handleTaskFromColumn = async (formData) => {
        if (!formData.title.trim()) {
            setSnackbar({ open: true, message: 'Please enter a task title', severity: 'error' });
            return;
        }

        try {
            const data = new FormData();
            data.append('Title', formData.title);
            data.append('Description', formData.description || '');

            if (formData.deadline) {
                data.append('Deadline', new Date(formData.deadline).toISOString());
            }

            if (formData.uploadFile) {
                data.append('UploadFile', formData.uploadFile);
            }

            const res = await taskService.createTask(cardData.id, data, token);
            console.log('Created Task:', res.data);
            const createdTask = res.data;
            setTasks(prev => ({
                ...prev,
                [createdTask.status]: [...prev[createdTask.status], createdTask],
            }));
            setSnackbar({ open: true, message: 'Task added successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error saving task:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to save task',
                severity: 'error',
            });
        }
    };

    const handleDeleteTask = async (status, taskId) => {
        try {
            await taskService.deleteTask(taskId, token);
            setTasks(prev => ({
                ...prev,
                [status]: prev[status].filter(t => t.id !== taskId),
            }));
            setSnackbar({ open: true, message: 'Task deleted!', severity: 'info' });
            setAnchorEl(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            setSnackbar({
                open: true,
                message: 'Failed to delete task',
                severity: 'error',
            });
        }
    };

    const handleEditTask = (task, status) => {
        setEditingTask({ ...task, status });
        setNewTask({
            title: task.title,
            description: task.description || '',
            deadline: task.deadline || '',
            status,
            uploadFile: null,
            progressPercentage: task.progressPercentage || 0,
        });
        setOpenDialog(true);
        setAnchorEl(null);
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        if (!draggedTask) return;

        let currentStatus = null;
        for (const status of statuses) {
            if (tasks[status].find(t => t.id === draggedTask.id)) {
                currentStatus = status;
                break;
            }
        }

        if (currentStatus === targetStatus) {
            setDraggedTask(null);
            return;
        }

        const allowedTransitions = {
            'ToDo': ['InProgress'],
            'InProgress': ['InReview'],
            'InReview': ['InProgress', 'Done'],
            'Done': [],
        };

        if (!allowedTransitions[currentStatus].includes(targetStatus)) {
            setSnackbar({
                open: true,
                message: `Cannot move task from ${statusLabels[currentStatus]} to ${statusLabels[targetStatus]}`,
                severity: 'warning',
            });
            setDraggedTask(null);
            return;
        }

        try {
            if (targetStatus === 'InProgress' && currentStatus === 'ToDo') {
                await taskService.moveToInProgress(draggedTask.id, token);
            } else if (targetStatus === 'InReview' && currentStatus === 'InProgress') {
                const reviewDueAt = new Date();
                reviewDueAt.setDate(reviewDueAt.getDate() + 7);
                await taskService.submitForReview(draggedTask.id, reviewDueAt.toISOString(), token);
            } else if (targetStatus === 'InProgress' && currentStatus === 'InReview') {
                await taskService.moveToInProgress(draggedTask.id, token);
            } else if (targetStatus === 'Done' && currentStatus === 'InReview') {
                await taskService.acceptTask(draggedTask.id, '', token);
            }

            await taskService.updateProjectProgress(cardData.id, token);

            const [tasksRes, detailsRes] = await Promise.all([
                taskService.getTasksByStatus(cardData.id, null, token),
                taskService.getProjectTaskDetails(cardData.id, token)
            ]);

            const allTasks = tasksRes.data;

            const tasksByStatus = {
                ToDo: [],
                InProgress: [],
                InReview: [],
                Done: [],
            };

            allTasks.forEach(task => {
                if (tasksByStatus[task.status]) {
                    tasksByStatus[task.status].push(task);
                }
            });

            setTasks(tasksByStatus);
            setProjectDetails(detailsRes.data);

            setSnackbar({
                open: true,
                message: `Task moved to ${statusLabels[targetStatus]}!`,
                severity: 'success',
            });
        } catch (error) {
            console.error('Error moving task:', error);
            setSnackbar({
                open: true,
                message: 'Failed to move task',
                severity: 'error',
            });
        }

        setDraggedTask(null);
    };

    const handleOpenMenu = (e, task, status) => {
        setSelectedTask({ task, status });
        setAnchorEl(e.currentTarget);
    };

    const completedTasks = tasks.Done.length;
    const totalTasks = Object.values(tasks).reduce((sum, list) => sum + list.length, 0);
    const progressPercentage = projectDetails?.progressPercentage || 0;

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!cardData) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Loading...</Typography>
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

            <ReviewDialog
                open={openReviewDialog}
                onClose={() => setOpenReviewDialog(false)}
                task={reviewingTask}
                onSubmitReview={handleSubmitReview}
            />

            <ViewReviewDialog
                open={openViewReviewDialog}
                onClose={() => setOpenViewReviewDialog(false)}
                task={viewingReviewTask}
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
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </Container>
    );
}