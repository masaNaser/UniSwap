import { Box, Typography, Avatar, Chip, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { getImageUrl } from '../../../utils/imageHelper';
import CustomButton from '../../../components/CustomButton/CustomButton';
import ProgressSection from './ProgressSection';
import { editCollaborationRequest } from '../../../services/collaborationService';
import { closeProjectByProvider, closeProjectByClient } from '../../../services/taskService';

export default function TrackTasksHeader({
  cardData,
  projectDetails,
  isProvider,
  totalTasks,
  completedTasks,
  progressPercentage,
  onBack,
  onDeadlineUpdate,
  onProjectClosed, // Callback to refresh parent after closing
}) {
  if (!cardData) return <div>Loading...</div>;

  const [isEditing, setIsEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState(
    cardData.deadline ? new Date(cardData.deadline).toISOString().split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  // Close Project Dialog States
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [closeAction, setCloseAction] = useState(null); // 'accept' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [closingProject, setClosingProject] = useState(false);

  const displayRole = cardData.isProvider ? 'Client' : 'Service Provider';
  const token = localStorage.getItem('accessToken');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Min date = current deadline + 1 day
  const minSelectableDate = (() => {
    const d = new Date(cardData.deadline);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  // ------------ Save Deadline -------------
  const handleSaveDeadline = async () => {
    const chosen = new Date(newDeadline);
    const current = new Date(cardData.deadline);

    if (chosen <= current) {
      alert("New deadline must be at least 1 day AFTER current deadline.");
      return;
    }

    try {
      setLoading(true);

      const collaborationId = projectDetails?.collaborationRequestId;
      
      if (!collaborationId) {
        throw new Error(
          "Collaboration Request ID is missing. Please make sure your backend returns 'collaborationRequestId' in the project details response."
        );
      }

      const deadlineISO = new Date(newDeadline).toISOString();

      await editCollaborationRequest(token, collaborationId, {
        deadline: deadlineISO
      });

      if (onDeadlineUpdate) {
        onDeadlineUpdate(deadlineISO);
      }

      setIsEditing(false);
      alert("Deadline updated successfully!");
      
    } catch (err) {
      console.error("Error updating deadline:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to update deadline.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setNewDeadline(
      cardData.deadline ? new Date(cardData.deadline).toISOString().split('T')[0] : ''
    );
    setIsEditing(true);
  };

  // ------------ Close Project Logic -------------
  
  // Check if project can be closed
  const canCloseProject = () => {
    console.log('🔍 Checking canCloseProject:', {
      isProvider,
      projectStatus: cardData.projectStatus,
      progressPercentage,
    });

    // Provider can close when project is Active and all tasks are done
    if (isProvider) {
      const canClose = cardData.projectStatus === 'Active' && progressPercentage === 100;
      console.log('✅ Provider can close:', canClose);
      return canClose;
    }
    
    // Client can close when project is SubmittedForFinalReview
    const canClose = cardData.projectStatus === 'SubmittedForFinalReview';
    console.log('✅ Client can close:', canClose);
    return canClose;
  };

  const handleCloseProjectClick = () => {
    if (isProvider) {
      // Provider directly submits for review
      setOpenCloseDialog(true);
    } else {
      // Client chooses accept or reject
      setOpenCloseDialog(true);
    }
  };

  const handleCloseProject = async () => {
    if (!canCloseProject()) {
      alert("Project cannot be closed at this stage.");
      return;
    }

    try {
      setClosingProject(true);

      if (isProvider) {
        // Provider submits project for final review
        const response = await closeProjectByProvider(cardData.id, token);
        console.log("✅ Close by provider response:", response);
        alert("Project submitted for final review successfully!");
      } else {
        // Client accepts or rejects
        if (closeAction === 'accept') {
          const response = await closeProjectByClient(cardData.id, token, {
            isAccepted: true,
            rejectionReason: ""
          });
          console.log("✅ Close by client (accept) response:", response);
          alert("Project completed successfully! Points transferred.");
        } else if (closeAction === 'reject') {
          if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            setClosingProject(false);
            return;
          }
          const response = await closeProjectByClient(cardData.id, token, {
            isAccepted: false,
            rejectionReason: rejectionReason.trim()
          });
          console.log("✅ Close by client (reject) response:", response);
          alert("Project rejected and returned to Active status for rework.");
        }
      }

      setOpenCloseDialog(false);
      setCloseAction(null);
      setRejectionReason('');

      console.log('✅ Project closed successfully, calling onProjectClosed...');
      
      // Refresh parent component
      if (onProjectClosed) {
        await onProjectClosed();
        console.log('✅ onProjectClosed completed');
      }

    } catch (err) {
      console.error("❌ Error closing project:", err);
      
      // Extract error message from response
      let errorMessage = "Failed to close project.";
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setClosingProject(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 2,
        mb: 3,
        p: 3,
        pb: 0,
        border: '1px solid #E5E7EB',
        position: 'relative',
      }}
    >

      {/* EDIT BUTTON (CLIENT ONLY) */}
      {!isProvider && (
        <IconButton
          onClick={handleOpenEdit}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <EditIcon />
        </IconButton>
      )}

      {/* EDIT DEADLINE POPUP */}
      {isEditing && !isProvider && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: "#fff",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            zIndex: 20,
            width: 260,
            boxShadow: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight="bold">Edit Deadline</Typography>
            <IconButton size="small" onClick={() => setIsEditing(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            label="New Deadline"
            type="date"
            fullWidth
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minSelectableDate }}
            sx={{ mb: 2 }}
          />

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSaveDeadline} 
            disabled={loading}
            sx={{
              background: 'linear-gradient(to right, #0EA4E8 0%, #0284C7 100%)',
              '&:hover': {
                background: 'linear-gradient(to right, #0284C7 0%, #0EA4E8 100%)',
              }
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}

      {/* Back Button + Close Project Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <CustomButton
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: 'none',
            fontSize: '14px',
            py: 0.75,
            px: 1.5,
          }}
        >
          Back to Projects
        </CustomButton>

        {/* Close Project Button */}
        {canCloseProject() && (
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={handleCloseProjectClick}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              py: 0.75,
              px: 2,
              background: 'linear-gradient(to right, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(to right, #059669 0%, #10B981 100%)',
              }
            }}
          >
            {isProvider ? 'Submit Final Work' : 'Close Project'}
          </Button>
        )}
      </Box>

      {/* Title */}
      <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
        <Box flex={1}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5, fontSize: '1.25rem' }}>
            {cardData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cardData.description}
          </Typography>
          
          {/* ✅ Show rejection reason if project was rejected */}
          {projectDetails?.rejectionReason && cardData.projectStatus === 'Active' && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: '#FEF2F2', 
                borderLeft: '4px solid #DC2626',
                borderRadius: 1 
              }}
            >
              <Typography variant="body2" fontWeight="600" color="#DC2626" sx={{ mb: 0.5 }}>
                ⚠️ Project Rejected - Rework Required
              </Typography>
              <Typography variant="body2" color="#991B1B">
                <strong>Reason:</strong> {projectDetails.rejectionReason}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Client Info + Deadline */}
      <Box display="flex" alignItems="center" gap={3} mb={3} sx={{ flexWrap: 'wrap' }}>

        {/* Avatar + Name */}
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            src={getImageUrl(cardData.clientAvatar, cardData.clientName)}
            sx={{ width: 36, height: 36 }}
          >
            {cardData.clientInitials}
          </Avatar>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
              {displayRole}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: '500' }}>
              {cardData.clientName}
            </Typography>
          </Box>
        </Box>

        {/* DEADLINE */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
            Due: {formatDate(cardData.deadline)}
          </Typography>
        </Box>

        {/* Status */}
        {cardData.projectStatus && (
          <Chip
            label={cardData.projectStatus}
            size="small"
            sx={{
              fontWeight: '600',
              fontSize: '11px',
              height: '28px',
              backgroundColor: '#EFF6FF',
              color: '#0284C7',
            }}
          />
        )}
      </Box>

      <ProgressSection progressPercentage={progressPercentage} />

      {/* Close Project Dialog */}
      <Dialog 
        open={openCloseDialog} 
        onClose={() => !closingProject && setOpenCloseDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isProvider ? 'Submit Final Work' : 'Close Project'}
        </DialogTitle>
        <DialogContent>
          {isProvider ? (
            <Typography>
              Are you sure you want to submit this project for final review? 
              All tasks must be completed before submission.
            </Typography>
          ) : (
            <Box>
              <Typography sx={{ mb: 2 }}>
                Please review the final work and choose an action:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  fullWidth
                  variant={closeAction === 'accept' ? 'contained' : 'outlined'}
                  onClick={() => setCloseAction('accept')}
                  sx={{
                    ...(closeAction === 'accept' && {
                      background: 'linear-gradient(to right, #10B981 0%, #059669 100%)',
                    })
                  }}
                >
                  Accept & Complete
                </Button>
                <Button
                  fullWidth
                  variant={closeAction === 'reject' ? 'contained' : 'outlined'}
                  onClick={() => setCloseAction('reject')}
                  color="error"
                >
                  Reject & Request Rework
                </Button>
              </Box>

              {closeAction === 'reject' && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Rejection Reason *"
                  placeholder="Please explain what needs to be fixed..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenCloseDialog(false);
              setCloseAction(null);
              setRejectionReason('');
            }} 
            disabled={closingProject}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCloseProject} 
            variant="contained"
            disabled={closingProject || (!isProvider && !closeAction)}
            sx={{
              background: 'linear-gradient(to right, #0EA4E8 0%, #0284C7 100%)',
              '&:hover': {
                background: 'linear-gradient(to right, #0284C7 0%, #0EA4E8 100%)',
              }
            }}
          >
            {closingProject ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}