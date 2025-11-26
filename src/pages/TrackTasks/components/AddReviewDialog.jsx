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
  Rating,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';

export default function AddReviewDialog({
  open,
  onClose,
  projectTitle,
  onSubmitReview,
}) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }

    onSubmitReview({
      rating: Number(rating),
      content: content.trim() || '',
    });

    handleClose();
  };

  const handleClose = () => {
    setRating(0);
    setContent('');
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  const isSubmitDisabled = rating === 0;

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
        <RateReviewIcon sx={{ color: '#3B82F6' }} />
        Add Your Review
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Project Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F0F9FF', borderRadius: 1, border: '1px solid #3B82F6' }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, color: '#1E40AF' }}>
            {projectTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project completed successfully! Share your experience with the provider.
          </Typography>
        </Box>

        {/* Rating */}
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
              border: rating === 0 ? '1px solid #E5E7EB' : '1px solid #3B82F6'
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

        {/* Comment */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Review Comment (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your feedback about the work quality, communication, and overall experience..."
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            Your review helps other clients make informed decisions and helps the provider improve their services.
          </Typography>
        </Box>

        {/* Info Box */}
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
              Optional but Recommended
            </Typography>
            <Typography variant="body2" color="#92400E">
              You can skip adding a review now and add it later from the project page. However, reviews help build trust in the community!
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleSkip} 
          sx={{ textTransform: 'none', color: 'text.secondary' }}
        >
          Skip for Now
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
          sx={{
            textTransform: 'none',
            background: isSubmitDisabled 
              ? '#D1D5DB' 
              : 'linear-gradient(to right, #F59E0B, #EAB308)',
            '&:disabled': {
              background: '#D1D5DB',
              color: '#9CA3AF',
            },
            '&:hover': {
              background: isSubmitDisabled 
                ? '#D1D5DB'
                : 'linear-gradient(to right, #EAB308, #F59E0B)',
            },
          }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}