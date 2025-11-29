import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function ReviewDueDateDialog({
  open,
  onClose,
  onSubmit,
  taskTitle,
  projectType,
}) {
  const [reviewDueDate, setReviewDueDate] = useState('');
  const [error, setError] = useState('');

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = () => {
    if (!reviewDueDate) {
      setError('Review due date and time is required');
      return;
    }

    const selectedDate = new Date(reviewDueDate);
    const now = new Date();

    if (selectedDate <= now) {
      setError('Review due date must be in the future');
      return;
    }

    onSubmit(reviewDueDate);
    handleClose();
  };

  const handleClose = () => {
    setReviewDueDate('');
    setError('');
    onClose();
  };

  const isRequestProject = projectType === 'RequestProject';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ color: '#3B82F6' }} />
        Set Review Deadline
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Task Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1, border: '1px solid #E5E7EB' }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {taskTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You're about to submit this task for client review
          </Typography>
        </Box>

        {/* Date/Time Picker */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            Review Deadline {isRequestProject && '*'}
          </Typography>
          <TextField
            fullWidth
            type="datetime-local"
            value={reviewDueDate}
            onChange={(e) => {
              setReviewDueDate(e.target.value);
              setError('');
            }}
            inputProps={{
              min: getMinDateTime(),
            }}
            error={!!error}
            helperText={error || 'Set the deadline for client to review this task'}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                },
              },
            }}
          />
        </Box>

        {/* Info Box */}
        <Alert
          icon={<InfoOutlinedIcon />}
          severity="info"
          sx={{
            mb: 2,
            bgcolor: '#F0F9FF',
            border: '1px solid #3B82F6',
            '& .MuiAlert-icon': {
              color: '#3B82F6',
            },
          }}
        >
          <Typography variant="body2" sx={{ color: '#1E40AF' }}>
            {isRequestProject ? (
              <>
                <strong>Auto-Accept Feature:</strong> If the client doesn't review by this deadline,
                the task will be automatically accepted and marked as Done.
              </>
            ) : (
              <>
                This deadline helps the client know when to review your work.
                The task will be submitted for review immediately.
              </>
            )}
          </Typography>
        </Alert>

        {/* Course Project Note */}
        {!isRequestProject && (
          <Box
            sx={{
              p: 2,
              bgcolor: '#FEF3C7',
              borderRadius: 1,
              border: '1px solid #F59E0B',
              display: 'flex',
              gap: 1.5,
            }}
          >
            <Box sx={{ flexShrink: 0, mt: 0.25 }}>
              <Typography variant="body1">💡</Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#92400E" sx={{ mb: 0.5 }}>
                Course Project
              </Typography>
              <Typography variant="body2" color="#92400E">
                For course projects, the review deadline is optional but recommended to help manage expectations.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: 'none', color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isRequestProject && !reviewDueDate}
          sx={{
            textTransform: 'none',
            background: (isRequestProject && !reviewDueDate)
              ? '#D1D5DB'
              : 'linear-gradient(to right, #3B82F6, #60A5FA)',
            '&:disabled': {
              background: '#D1D5DB',
              color: '#9CA3AF',
            },
            '&:hover': {
              background: (isRequestProject && !reviewDueDate)
                ? '#D1D5DB'
                : 'linear-gradient(to right, #60A5FA, #3B82F6)',
            },
          }}
        >
          Submit for Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}