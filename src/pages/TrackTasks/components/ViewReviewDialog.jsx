import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function ViewReviewDialog({ open, onClose, task }) {
  if (!task) {
    return null;
  }

  const comment = task.clientReviewComment || 'No comment provided';

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
          <CancelIcon sx={{ color: '#DC2626', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Task Rejected - Needs Revision
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Task Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}
        </Box>

        {/* Review Decision */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            Client Decision
          </Typography>
          <Chip
            icon={<CancelIcon />}
            label="Rejected - Revision Required"
            sx={{
              backgroundColor: '#FEE2F2',
              color: '#DC2626',
              fontWeight: 'bold',
              fontSize: '14px',
              height: '36px',
              '& .MuiChip-icon': {
                color: '#DC2626',
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Client Feedback */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            Client Feedback
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
              {comment}
            </Typography>
          </Box>
        </Box>

        {/* Review Date */}
        {task.reviewedAt && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Reviewed on {formatDate(task.reviewedAt)}
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
            background: 'linear-gradient(to right, #3B82F6, #60A5FA)',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}