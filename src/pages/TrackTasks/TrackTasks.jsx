import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import TrackTasksHeader from './components/TrackTasksHeader';
import StatsSection from './components/StatsSection';
import KanbanBoard from './components/KanbanBoard';
import TaskDialog from './components/TaskDialog';
import TaskMenu from './components/TaskMenu';
import TaskSnackbar from './components/TaskSnackbar';
import * as taskService from '../../services/taskService';

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
  const cardData = location.state;

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
  const [newTask, setNewTask] = useState({ title: '', description: '', deadline: '', status: 'ToDo' ,UploadFile: null});
  const [draggedTask, setDraggedTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch project details and tasks
  useEffect(() => {
    const fetchData = async () => {
      if (!cardData?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch project details
        const detailsRes = await taskService.getProjectTaskDetails(cardData.id, token);
        console.log('Project Details:', detailsRes.data);
        setProjectDetails(detailsRes.data);

        // Fetch all tasks
        const tasksRes = await taskService.getTasksByStatus(cardData.id, null, token);
        console.log('All Tasks:', tasksRes.data);
        const tasksByStatus = {
          ToDo: [],
          InProgress: [],
          InReview: [],
          Done: [],
        };

        tasksRes.data.forEach(task => {
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

    fetchData();
  }, [cardData?.id, token]);

  // Task management functions
const handleAddTask = async () => {
  if (!newTask.title.trim()) {
    setSnackbar({ open: true, message: 'Please enter a task title', severity: 'error' });
    return;
  }

  try {
    // هون بتحضر الـ FormData
    const formData = new FormData();
    formData.append('Title', newTask.title);
    formData.append('Description', newTask.description || '');
    
    if (newTask.deadline) {
      formData.append('Deadline', new Date(newTask.deadline).toISOString());
    }
    
    if (newTask.uploadFile) {
      formData.append('UploadFile', newTask.uploadFile);
    }
     // 🔥 أضف الـ Progress إذا موجود
    if (editingTask && newTask.progressPercentage !== undefined) {
      formData.append('ProgressPercentage', newTask.progressPercentage);
    }
       
     if (editingTask) {
      const res = await taskService.updateTask(editingTask.id, formData, token);
      
      // 🔥 بعد التحديث، اعمل refresh للبيانات
      await taskService.updateProjectProgress(cardData.id, token);
      
      const [tasksRes, detailsRes] = await Promise.all([
        taskService.getTasksByStatus(cardData.id, null, token),
        taskService.getProjectTaskDetails(cardData.id, token)
      ]);

      const tasksByStatus = {
        ToDo: [],
        InProgress: [],
        InReview: [],
        Done: [],
      };

      tasksRes.data.forEach(task => {
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
    // هون بتحضر الـ FormData
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
    uploadFile: null, // الملف القديم موجود بس ما بنقدر نعدله
    progressPercentage: task.progressPercentage || 0, // 🔥 أضف الـ Progress
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

  // Define allowed transitions
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
    // Handle different status transitions
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

    // 🔥 حدّث الـ project progress أول شي
    await taskService.updateProjectProgress(cardData.id, token);

    // 🔥 بعدين اجلب كل شي من جديد
    const [tasksRes, detailsRes] = await Promise.all([
      taskService.getTasksByStatus(cardData.id, null, token),
      taskService.getProjectTaskDetails(cardData.id, token)
    ]);

    // 🔥 حدّث التاسكات بالبيانات الجديدة من الـ API
    const tasksByStatus = {
      ToDo: [],
      InProgress: [],
      InReview: [],
      Done: [],
    };

    tasksRes.data.forEach(task => {
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

  console.log('Current cardData :', cardData);
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
      />

      <TaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingTask={editingTask}
        newTask={newTask}
        onTaskChange={setNewTask}
        onSubmit={handleAddTask}
        isProvider={isProvider} // 🔥 أضف هذا

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