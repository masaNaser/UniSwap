import { Card, CardContent, Box, Typography, Avatar, IconButton, Chip } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TaskCard({
  task,
  status,
  isProvider,
  onDragStart,
  onMenuOpen,
}) {
  const getProgressColor = (percentage) => {
    if (percentage === 100) return '#059669';
    if (percentage >= 75) return '#0284C7';
    if (percentage >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Card
      draggable={isProvider}
      onDragStart={onDragStart}
      sx={{
        cursor: isProvider ? 'grab' : 'default',
        transition: 'all 0.2s ease',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: isProvider ? 'translateY(-2px)' : 'none',
        },
        '&:active': {
          cursor: isProvider ? 'grabbing' : 'default',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            {isProvider && (
              <DragIndicatorIcon
                sx={{
                  fontSize: 18,
                  color: '#D1D5DB',
                  mb: 0.5,
                  display: 'inline-block',
                  mr: 0.5,
                }}
              />
            )}
            <Typography fontWeight="bold" variant="body2" sx={{ mb: 0.5, lineHeight: 1.3 }}>
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {task.description}
              </Typography>
            )}

            {/* Progress Bar */}
            <Box sx={{ mb: 1, mt: 1 }}>
              <Box sx={{
                height: 4,
                backgroundColor: '#E5E7EB',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <Box sx={{
                  height: '100%',
                  width: `${task.progressPercentage}%`,
                  backgroundColor: getProgressColor(task.progressPercentage),
                  transition: 'width 0.3s ease',
                }} />
              </Box>
              <Typography variant="caption" sx={{ fontSize: '10px', color: '#9CA3AF', mt: 0.5, display: 'block' }}>
                {task.progressPercentage}%
              </Typography>
            </Box>

            {/* Overdue Badge */}
            {task.isOverdue && (
              <Chip
                label="Overdue"
                size="small"
                sx={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: '11px',
                  height: '20px',
                }}
              />
            )}
          </Box>
          {isProvider && (
            <IconButton size="small" onClick={onMenuOpen} sx={{ mt: -1, mr: -1 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}