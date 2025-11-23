import { Box } from '@mui/material';
import TaskColumn from './TaskColumn';

export default function KanbanBoard({
  statuses,
  statusLabels,
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
  projectStatus, // ✅ NEW: Receive project status from parent
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        gap: 2,
        pb: 4,
      }}
    >
      {statuses.map(status => (
        <TaskColumn
          key={status}
          status={status}
          label={statusLabels[status]}
          tasks={tasks[status] || []}
          isProvider={isProvider}
          draggedTask={draggedTask}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onMenuOpen={onMenuOpen}
          onAddTask={onAddTask}
          onReviewClick={onReviewClick}
          onViewReview={onViewReview}
          projectStatus={projectStatus} // ✅ Pass it down
        />
      ))}
    </Box>
  );
}