
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Slider
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

const statuses = ['ToDo', 'InProgress', 'InReview', 'Done'];
const statusLabels = {
  'ToDo': 'To Do',
  'InProgress': 'In Progress',
  'InReview': 'In Review',
  'Done': 'Done',
};
//  إضافة/تعديل مهمة
// 'Edit Task' : 'Add New Task'
export default function TaskDialog({
  open,
  onClose,
  editingTask,
  newTask,
  onTaskChange,
  onSubmit,
  isProvider,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onTaskChange(prev => ({ ...prev, uploadFile: file }));
    }
  };

  const handleRemoveFile = () => {
    onTaskChange(prev => ({ ...prev, uploadFile: null }));
    // Reset file input
    const fileInput = document.getElementById('task-file-upload');
    if (fileInput) fileInput.value = '';
  };
  //  تحديد إذا نعرض حقل الـ Progress
  const showProgressField = editingTask &&
    editingTask.status === 'InProgress' &&
    isProvider;
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
          label="Description (Optional)"
          value={newTask?.description || ''}
          onChange={(e) => onTaskChange(prev => ({ ...prev, description: e.target.value }))}
          multiline
          rows={4}
          margin="normal"
          placeholder="Enter task description"
        />

        {/*  Progress Slider - بس للـ InProgress Tasks */}
        {showProgressField && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Progress: {newTask?.progressPercentage || 0}%
            </Typography>
            <Slider
              value={newTask?.progressPercentage || 0}
              onChange={(e, value) => onTaskChange(prev => ({
                ...prev,
                progressPercentage: value
              }))}
              min={0}
              max={90}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 90, label: '89%' },
              ]}
              sx={{
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                },
                '& .MuiSlider-markLabel': {
                  fontSize: '11px',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Set the progress percentage for this task
            </Typography>
          </Box>
        )}
        {/* File Upload Section */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Upload File
          </Typography>
          <label htmlFor="task-file-upload">
            <input
              id="task-file-upload"
              type="file"
              hidden
              onChange={handleFileChange}
            />
            <Button
              component="span"
              variant="outlined"
              startIcon={<AttachFileIcon />}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              {newTask?.uploadFile ? 'Change File' : 'Choose File'}
            </Button>
          </label>

          {newTask?.uploadFile && (
            <Box sx={{
              mt: 1,
              p: 1,
              bgcolor: '#F3F4F6',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="caption" sx={{ flex: 1 }}>
                {newTask.uploadFile.name || newTask.uploadFile}
              </Typography>
              <IconButton size="small" onClick={handleRemoveFile}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      
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