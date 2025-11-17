import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const statuses = ['ToDo', 'InProgress', 'InReview', 'Done'];
const statusLabels = {
  'ToDo': 'To Do',
  'InProgress': 'In Progress',
  'InReview': 'In Review',
  'Done': 'Done',
};

export default function TaskDialog({
  open,
  onClose,
  editingTask,
  newTask,
  onTaskChange,
  onSubmit,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Task Title"
          value={newTask?.title || ''}
          onChange={(e) => onTaskChange(prev => ({ ...prev, title: e.target.value }))}
          margin="normal"
          placeholder="Enter task title"
        />
        <TextField
          fullWidth
          label="Description"
          value={newTask?.description || ''}
          onChange={(e) => onTaskChange(prev => ({ ...prev, description: e.target.value }))}
          multiline
          rows={4}
          margin="normal"
          placeholder="Enter task description"
        />
        <TextField
          fullWidth
          label="Deadline (Optional)"
          type="datetime-local"
          value={newTask?.deadline || ''}
          onChange={(e) => onTaskChange(prev => ({ ...prev, deadline: e.target.value }))}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {!editingTask && (
          <TextField
            fullWidth
            select
            label="Status"
            value={newTask?.status || 'ToDo'}
            onChange={(e) => onTaskChange(prev => ({ ...prev, status: e.target.value }))}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!newTask?.title?.trim()}
          sx={{ background: 'linear-gradient(to right, #00C8FF, #8B5FF6)' }}
        >
          {editingTask ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}