import React, { useState } from 'react';
import { Box, Chip, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';
import TaskDialog from './TaskDialog';

const statusColors = {
  'ToDo': { bg: '#FEF3C7', text: '#F59E0B' },
  'InProgress': { bg: '#DBEAFE', text: '#0284C7' },
  'InReview': { bg: '#F3E8FF', text: '#A855F7' },
  'Done': { bg: '#ECFDF5', text: '#059669' },
};

export default function TaskColumn({
  status,
  label,
  tasks,
  isProvider,
  draggedTask,
  onDragStart,
  onDragOver,
  onDrop,
  onMenuOpen,
  onAddTask,
  onReviewClick,
  onViewReview,
  projectStatus, // ✅ NEW: Receive project status
}) {
  const isToDoColumn = status === 'ToDo';
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'ToDo',
    uploadFile: null,
  });

  // ✅ Hide '+' button if provider AND ToDo column AND status is SubmittedForFinalReview
  const shouldShowAddButton = isProvider && 
                               isToDoColumn && 
                               projectStatus !== 'SubmittedForFinalReview';

  const handleAddClick = () => {
    setNewTask({
      title: '',
      description: '',
      deadline: '',
      status: 'ToDo',
      uploadFile: null,
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTaskChange = (updater) => {
    if (typeof updater === 'function') {
      setNewTask(updater);
    } else {
      setNewTask(updater);
    }
  };

  const handleSubmitTask = () => {
    if (newTask.title.trim() && onAddTask) {
      onAddTask(newTask);
      setOpenDialog(false);
      setNewTask({
        title: '',
        description: '',
        deadline: '',
        status: 'ToDo',
        uploadFile: null,
      });
    }
  };

  return (
    <>
      <Box
        onDragOver={isProvider ? onDragOver : null}
        onDrop={isProvider ? (e) => onDrop(e, status) : null}
        sx={{
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          border: '2px solid #E5E7EB',
          p: 2,
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          ...(draggedTask && {
            backgroundColor: '#F0F9FF',
            borderColor: '#0284C7',
          }),
        }}
      >
        {/* Column Header */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${label} (${tasks.length})`}
            sx={{
              backgroundColor: statusColors[status].bg,
              color: statusColors[status].text,
              fontWeight: 'bold',
              flex: 1,
              justifyContent: 'center',
              height: 32,
            }}
          />
          {/* ✅ Show '+' button only when conditions are met */}
          {shouldShowAddButton && (
            <Button
              onClick={handleAddClick}
              sx={{
                minWidth: '32px',
                width: '32px',
                height: '32px',
                p: 0,
                borderRadius: '6px',
                backgroundColor: statusColors[status].bg,
                color: statusColors[status].text,
                border: `2px solid ${statusColors[status].text}`,
                fontSize: '18px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: statusColors[status].text,
                  color: statusColors[status].bg,
                },
              }}
            >
              <AddIcon sx={{ fontSize: '18px' }} />
            </Button>
          )}
        </Box>

        {/* Tasks Container */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {tasks.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#9CA3AF',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2">No tasks yet</Typography>
            </Box>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                status={status}
                isProvider={isProvider}
                onDragStart={(e) => isProvider && onDragStart(e, task)}
                onMenuOpen={(e) => isProvider && onMenuOpen(e, task, status)}
                onReviewClick={onReviewClick}
                onViewReview={onViewReview}
              />
            ))
          )}
        </Box>
      </Box>

      {/* Task Dialog */}
      <TaskDialog
        open={openDialog}
        onClose={handleDialogClose}
        editingTask={null}
        newTask={newTask}
        onTaskChange={handleTaskChange}
        onSubmit={handleSubmitTask}
      />
    </>
  );
}