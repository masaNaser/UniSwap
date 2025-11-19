import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function ReviewDialog({
  open,
  onClose,
  task,
  onSubmitReview,
}) {
  const [reviewDecision, setReviewDecision] = React.useState('');
  const [reviewComment, setReviewComment] = React.useState('');

  const handleSubmit = () => {
    if (!reviewComment.trim()) {
      return;
    }
    onSubmitReview(task.id, reviewDecision, reviewComment);
    handleClose();
  };

  const handleClose = () => {
    setReviewDecision('');
    setReviewComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
        Review Task
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {/* Task Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {task?.title}
          </Typography>
          {task?.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}
        </Box>

        {/* Review Decision */}
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          Review Decision
        </Typography>
        <RadioGroup
          value={reviewDecision}
          onChange={(e) => setReviewDecision(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="accept"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                <Typography>Accept</Typography>
              </Box>
            }
            sx={{
              border: reviewDecision === 'accept' ? '2px solid #3B82F6' : '1px solid #E5E7EB',
              borderRadius: 1,
              p: 1.5,
              mb: 1,
              ml: 0,
              bgcolor: reviewDecision === 'accept' ? '#EFF6FF' : 'transparent',
            }}
          />
          <FormControlLabel
            value="reject"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CancelOutlinedIcon sx={{ color: '#DC2626', fontSize: 20 }} />
                <Typography>Reject</Typography>
              </Box>
            }
            sx={{
              border: reviewDecision === 'reject' ? '2px solid #DC2626' : '1px solid #E5E7EB',
              borderRadius: 1,
              p: 1.5,
              ml: 0,
              bgcolor: reviewDecision === 'reject' ? '#FEE2E2' : 'transparent',
            }}
          />
        </RadioGroup>

        {/* Review Comment */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Review Comment
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder={
            reviewDecision === 'accept'
              ? 'Share your feedback about the completed task...'
              : 'Please explain what needs to be improved...'
          }
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!reviewComment.trim()}
          sx={{
            textTransform: 'none',
            background: reviewDecision === 'accept' 
              ? 'linear-gradient(to right, #3B82F6, #60A5FA)' 
              : 'linear-gradient(to right, #DC2626, #EF4444)',
          }}
        >
          Send Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Add React import at the top
import React from 'react';