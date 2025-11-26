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
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function ProjectAcceptRejectDialog({
  open,
  onClose,
  projectTitle,
  projectDescription,
  onSubmitDecision,
}) {
  const [decision, setDecision] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = () => {
    if (!decision) {
      return;
    }

    if (decision === 'reject' && !rejectionReason.trim()) {
      return;
    }

    onSubmitDecision({
      isAccepted: decision === 'accept',
      rejectionReason: decision === 'reject' ? rejectionReason.trim() : undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setDecision('');
    setRejectionReason('');
    onClose();
  };

  const isSubmitDisabled = 
    !decision || 
    (decision === 'reject' && !rejectionReason.trim());

  const buttonBackground = (() => {
    if (isSubmitDisabled) {
      return '#D1D5DB';
    }
    if (decision === 'accept') {
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
        Accept or Reject Project
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

        {/* Decision */}
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          Your Decision
        </Typography>
        <RadioGroup
          value={decision}
          onChange={(e) => {
            setDecision(e.target.value);
            setRejectionReason('');
          }}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="accept"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                <Box>
                  <Typography fontWeight="500">Accept & Complete Project</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Project will be marked as completed and points will be transferred
                  </Typography>
                </Box>
              </Box>
            }
            sx={{
              border: decision === 'accept' ? '2px solid #3B82F6' : '1px solid #E5E7EB',
              borderRadius: 1,
              p: 1.5,
              mb: 1,
              ml: 0,
              bgcolor: decision === 'accept' ? '#EFF6FF' : 'transparent',
            }}
          />
          <FormControlLabel
            value="reject"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CancelOutlinedIcon sx={{ color: '#DC2626', fontSize: 20 }} />
                <Box>
                  <Typography fontWeight="500">Reject & Request Rework</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Project will return to Active status for improvements
                  </Typography>
                </Box>
              </Box>
            }
            sx={{
              border: decision === 'reject' ? '2px solid #DC2626' : '1px solid #E5E7EB',
              borderRadius: 1,
              p: 1.5,
              ml: 0,
              bgcolor: decision === 'reject' ? '#FEE2E2' : 'transparent',
            }}
          />
        </RadioGroup>

        {/* Rejection Reason Field (only if rejecting) */}
        {decision === 'reject' && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Rejection Reason *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain what needs to be improved or changed..."
              sx={{ mb: 2 }}
              error={decision === 'reject' && !rejectionReason.trim()}
              helperText={
                decision === 'reject' && !rejectionReason.trim()
                  ? 'Rejection reason is required'
                  : ''
              }
            />

            {/* Info Box for Rejection */}
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
                <Typography variant="body1">ℹ️</Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#92400E" sx={{ mb: 0.5 }}>
                  What Happens Next:
                </Typography>
                <Typography variant="body2" color="#92400E">
                  The project status will return to <strong>Active</strong>, and the provider will be able to see your rejection reason and make the necessary improvements before resubmitting.
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Info Box for Acceptance */}
        {decision === 'accept' && (
          <Box
            sx={{
              p: 2,
              bgcolor: '#EFF6FF',
              borderRadius: 1,
              border: '1px solid #3B82F6',
              display: 'flex',
              gap: 1.5,
            }}
          >
            <Box sx={{ flexShrink: 0, mt: 0.25 }}>
              <Typography variant="body1">ℹ️</Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1E40AF" sx={{ mb: 0.5 }}>
                What Happens Next:
              </Typography>
              <Typography variant="body2" color="#1E40AF">
                The project will be marked as <strong>Completed</strong>, points will be transferred to the provider, and you'll have the option to add a review with rating and feedback.
              </Typography>
            </Box>
          </Box>
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
            '&:disabled': {
              background: '#D1D5DB',
              color: '#9CA3AF',
            },
          }}
        >
          {decision === 'accept' ? 'Accept Project' : decision === 'reject' ? 'Reject Project' : 'Submit Decision'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}