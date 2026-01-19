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
  FormControlLabel,
  Radio,
  RadioGroup,
  Rating,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import StarIcon from '@mui/icons-material/Star';

export default function ProjectCloseReviewDialog({
  open,
  onClose,
  projectTitle,
  projectDescription,
  onSubmitReview,
}) {
  const [reviewDecision, setReviewDecision] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!reviewDecision) {
      return;
    }

    if (!reviewComment.trim()) {
      return;
    }

    if (reviewDecision === 'accept' && rating === 0) {
      return;
    }

    console.log(' Submitting review:', {
      isAccepted: reviewDecision === 'accept',
      rating: reviewDecision === 'accept' ? Number(rating) : 0,
      comment: reviewComment.trim(),
    });

    onSubmitReview({
      isAccepted: reviewDecision === 'accept',
      rejectionReason: reviewDecision === 'reject' ? reviewComment.trim() : '',
      rating: reviewDecision === 'accept' ? Number(rating) : 0,
      comment: reviewComment.trim(),
    });

    handleClose();
  };

  const handleClose = () => {
    setReviewDecision('');
    setReviewComment('');
    setRating(0);
    onClose();
  };

  const isSubmitDisabled = 
    !reviewDecision || 
    !reviewComment.trim() ||
    (reviewDecision === 'accept' && rating === 0);

  const buttonBackground = (() => {
    if (isSubmitDisabled) {
      return '#D1D5DB';
    }
    if (reviewDecision === 'accept') {
      return 'linear-gradient(to right, #00C8FF, #8B5FF6)';
    }
    return 'linear-gradient(to right, #DC2626, #EF4444)';
  })();

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
      <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
        Review Project Completion
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Project Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {projectTitle}
          </Typography>
          {projectDescription && (
            <Typography variant="body2" color="text.secondary">
              {projectDescription}
            </Typography>
          )}
        </Box>

        {/* Review Decision */}
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          Review Decision
        </Typography>
        <RadioGroup
          value={reviewDecision}
          onChange={(e) => {
            setReviewDecision(e.target.value);
            setReviewComment('');
            setRating(0);
          }}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="accept"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                <Typography>Accept & Complete Project</Typography>
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
                <Typography>Reject & Request Rework</Typography>
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

        {/* Rating for Accept */}
        {reviewDecision === 'accept' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
              Rate the Service Provider *
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                bgcolor: '#F0F9FF',
                borderRadius: 1,
                border: '1px solid #3B82F6'
              }}
            >
              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#F59E0B',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: '#D1D5DB',
                  },
                }}
              />
              {rating > 0 && (
                <Typography variant="h6" fontWeight="bold" color="#3B82F6">
                  {rating}.0
                </Typography>
              )}
            </Box>
            {rating === 0 && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                Please select a rating before submitting
              </Typography>
            )}
          </Box>
        )}

        {/* Comment Field - Required for BOTH Accept and Reject */}
        {reviewDecision && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {reviewDecision === 'accept' ? 'Review Comment *' : 'Rejection Reason *'}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={
                reviewDecision === 'accept'
                  ? 'Share your feedback about the work quality, communication, and overall experience...'
                  : 'Please explain what needs to be improved...'
              }
              sx={{ mb: 2 }}
              error={reviewDecision && !reviewComment.trim()}
              helperText={
                reviewDecision && !reviewComment.trim()
                  ? 'Comment is required'
                  : ''
              }
            />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            textTransform: 'none',
            background: buttonBackground,
          }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}