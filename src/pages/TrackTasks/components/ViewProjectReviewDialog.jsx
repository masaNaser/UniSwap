import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Rating,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function ViewProjectReviewDialog({
  open,
  onClose,
  projectData,
  projectDetails,
  reviewData,
}) {
  const isRejected = projectData?.projectStatus === 'Active' && projectDetails?.rejectionReason;
  const isCompleted = projectData?.projectStatus === 'Completed';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isRejected ? (
            <>
              <CancelIcon sx={{ color: '#DC2626', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold">
                Project Rejected - Needs Rework
              </Typography>
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ color: '#059669', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold">
                Client Review
              </Typography>
            </>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Project Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {projectData?.title}
          </Typography>
          {projectData?.description && (
            <Typography variant="body2" color="text.secondary">
              {projectData.description}
            </Typography>
          )}
        </Box>

        {/* Rejection Content */}
        {isRejected && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                Client Decision
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#FEE2E2',
                  borderRadius: 1,
                  border: '1px solid #DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CancelIcon sx={{ color: '#DC2626', fontSize: 20 }} />
                <Typography fontWeight="bold" color="#DC2626">
                  Rejected - Rework Required
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                Rejection Reason
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#FEF2F2',
                  borderRadius: 1,
                  borderLeft: '4px solid #DC2626',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {projectDetails?.rejectionReason}
                </Typography>
              </Box>
            </Box>

            {/* Warning Box */}
            <Box
              sx={{
                p: 2,
                bgcolor: '#FEF3C7',
                borderRadius: 1,
                border: '1px solid #F59E0B',
                display: 'flex',
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box sx={{ flexShrink: 0, mt: 0.25 }}>
                <Typography variant="body1">⚠️</Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#92400E" sx={{ mb: 0.5 }}>
                  Action Required
                </Typography>
                <Typography variant="body2" color="#92400E">
                  The project has been returned to <strong>Active</strong> status. Please address the issues mentioned above and resubmit the project when ready.
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Review Content (for completed projects) */}
        {isCompleted && reviewData && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating
                  value={reviewData.rating}
                  readOnly
                  size="large"
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#F59E0B',
                    },
                  }}
                />
                <Typography variant="h6" fontWeight="bold" color="#3B82F6">
                  {reviewData.rating}.0
                </Typography>
              </Box>
            </Box>

            {reviewData.content && (
              <>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                    Client Feedback
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#F0F9FF',
                      borderRadius: 1,
                      borderLeft: '4px solid #3B82F6',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {reviewData.content}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {reviewData.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Reviewed on {formatDate(reviewData.createdAt)}
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* No Review Yet (for completed projects without review) */}
        {isCompleted && !reviewData && (
          <Box
            sx={{
              p: 3,
              bgcolor: '#F9FAFB',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No review has been submitted yet for this project.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            textTransform: 'none',
            background: isRejected
              ? 'linear-gradient(to right, #DC2626, #EF4444)'
              : 'linear-gradient(to right, #3B82F6, #60A5FA)',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}