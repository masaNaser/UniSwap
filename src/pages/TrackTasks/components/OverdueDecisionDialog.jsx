import React, { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GenericModal from '../../../components/Modals/GenericModal';

export default function OverdueDecisionDialog({
  open,
  onClose,
  projectTitle,
  projectDescription,
  currentDeadline,
  onSubmit,
}) {
  const [decision, setDecision] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const getMinDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!decision) {
      setSnackbar({
        open: true,
        message: 'Please select an option',
        severity: 'error',
      });
      return;
    }

    if (decision === 'extend' && !newDeadline) {
      setSnackbar({
        open: true,
        message: 'Please select a new deadline',
        severity: 'error',
      });
      return;
    }

    if (decision === 'extend') {
      const selectedDate = new Date(newDeadline);
      const minDate = new Date(getMinDateTime());

      if (selectedDate < minDate) {
        setSnackbar({
          open: true,
          message: 'New deadline must be at least tomorrow',
          severity: 'error',
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        acceptExtend: decision === 'extend',
        newDeadline: decision === 'extend' ? new Date(newDeadline).toISOString() : null,
      };

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error submitting overdue decision:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to submit decision',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDecision('');
      setNewDeadline('');
      onClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isSubmitDisabled = !decision || (decision === 'extend' && !newDeadline);

  const headerInfo = (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
        {projectTitle}
      </Typography>
      {projectDescription && (
        <Typography variant="body2" color="text.secondary">
          {projectDescription}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 18, color: '#DC2626' }} />
        <Typography variant="body2" color="#DC2626" fontWeight="500">
          Original Deadline: {new Date(currentDeadline).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <GenericModal
      open={open}
      onClose={handleClose}
      title="Handle Overdue Project"
      icon={<WarningAmberIcon sx={{ color: '#DC2626', fontSize: 28 }} />}
      headerInfo={headerInfo}
      primaryButtonText={
        decision === 'extend' ? 'Extend Deadline' : decision === 'cancel' ? 'Cancel & Refund' : 'Submit'
      }
      primaryButtonIcon={decision === 'extend' ? <EventIcon /> : decision === 'cancel' ? <CancelOutlinedIcon /> : null}
      onPrimaryAction={handleSubmit}
      isPrimaryDisabled={isSubmitDisabled}
      isSubmitting={isSubmitting}
      secondaryButtonText="Close"
      snackbar={snackbar}
      onSnackbarClose={handleSnackbarClose}
      maxWidth="sm"
    >
      {/* Warning Banner */}
      <Alert
        icon={<WarningAmberIcon />}
        severity="error"
        sx={{
          mb: 3,
          bgcolor: '#FEE2E2',
          border: '1px solid #DC2626',
          '& .MuiAlert-icon': {
            color: '#DC2626',
          },
        }}
      >
        <Typography variant="body2" sx={{ color: '#991B1B' }}>
          <strong>Project Overdue:</strong> This project has exceeded its deadline. Please choose how you'd like to proceed.
        </Typography>
      </Alert>

      {/* Decision Options */}
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
        Choose Your Action *
      </Typography>
      <RadioGroup
        value={decision}
        onChange={(e) => {
          setDecision(e.target.value);
          setNewDeadline('');
        }}
        sx={{ mb: 3 }}
      >
        {/* Option 1: Extend Deadline */}
        <FormControlLabel
          value="extend"
          control={<Radio />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
              <Typography fontWeight="500">Extend Project Deadline</Typography>
            </Box>
          }
          sx={{
            border: decision === 'extend' ? '2px solid #3B82F6' : '1px solid #E5E7EB',
            borderRadius: 1,
            p: 1.5,
            mb: 1,
            ml: 0,
            bgcolor: decision === 'extend' ? '#EFF6FF' : 'transparent',
          }}
        />

        {/* Option 2: Cancel & Refund */}
        <FormControlLabel
          value="cancel"
          control={<Radio />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CancelOutlinedIcon sx={{ color: '#DC2626', fontSize: 20 }} />
              <Typography fontWeight="500">Cancel Project & Refund Points</Typography>
            </Box>
          }
          sx={{
            border: decision === 'cancel' ? '2px solid #DC2626' : '1px solid #E5E7EB',
            borderRadius: 1,
            p: 1.5,
            ml: 0,
            bgcolor: decision === 'cancel' ? '#FEE2E2' : 'transparent',
          }}
        />
      </RadioGroup>

      {/* New Deadline Field - Show only if Extend is selected */}
      {decision === 'extend' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            New Deadline *
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            inputProps={{
              min: getMinDateTime(),
            }}
            error={decision === 'extend' && !newDeadline}
            helperText={
              decision === 'extend' && !newDeadline
                ? 'Please select a new deadline date'
                : 'Select a date at least one day from today'
            }
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
      )}

      {/* Info Box for Selected Option */}
      {decision && (
        <Alert
          icon={<InfoOutlinedIcon />}
          severity={decision === 'extend' ? 'info' : 'warning'}
          sx={{
            bgcolor: decision === 'extend' ? '#F0F9FF' : '#FEF3C7',
            border: decision === 'extend' ? '1px solid #3B82F6' : '1px solid #F59E0B',
            '& .MuiAlert-icon': {
              color: decision === 'extend' ? '#3B82F6' : '#F59E0B',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: decision === 'extend' ? '#1E40AF' : '#92400E' }}
          >
            {decision === 'extend' ? (
              <>
                <strong>What happens next:</strong> The project deadline will be updated to the new date you selected, and the project status will return to <strong>Active</strong>. The service provider will be notified of the extension.
              </>
            ) : (
              <>
                <strong>What happens next:</strong> The project will be cancelled permanently. All frozen points  will be immediately refunded to your account. This action cannot be undone.
              </>
            )}
          </Typography>
        </Alert>
      )}
    </GenericModal>
  );
}