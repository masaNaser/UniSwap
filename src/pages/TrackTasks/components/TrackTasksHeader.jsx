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
import ProjectCloseReviewDialog from './ProjectCloseReviewDialog';
import { editCollaborationRequest } from '../../../services/collaborationService';
import { closeProjectByProvider, closeProjectByClient } from '../../../services/taskService';
import { addClientReviewToProvider } from '../../../services/reviewService';

export default function TrackTasksHeader({
  cardData,
  projectDetails,
  isProvider,
  totalTasks,
  completedTasks,
  progressPercentage,
  onBack,
  onDeadlineUpdate,
  onProjectClosed,
}) {
  if (!cardData) return <div>Loading...</div>;

  const [isEditing, setIsEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState(
    cardData.deadline ? new Date(cardData.deadline).toISOString().split('T')[0] : ''
  );
  const [loading, setLoading] = useState(false);

  // Close Project Dialog States
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
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
        throw new Error("Collaboration Request ID is missing.");
      }

      const deadlineISO = new Date(newDeadline).toISOString();
      await editCollaborationRequest(token, collaborationId, { deadline: deadlineISO });

      if (onDeadlineUpdate) {
        onDeadlineUpdate(deadlineISO);
      }

      setIsEditing(false);
      alert("Deadline updated successfully!");
    } catch (err) {
      console.error("Error updating deadline:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update deadline.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setNewDeadline(cardData.deadline ? new Date(cardData.deadline).toISOString().split('T')[0] : '');
    setIsEditing(true);
  };

  // ------------ Close Project Logic -------------
  const canCloseProject = () => {
    console.log('🔍 canCloseProject check:', {
      isProvider,
      projectStatus: cardData.projectStatus,
      progressPercentage,
      result: isProvider 
        ? (cardData.projectStatus === 'Active' && progressPercentage === 100)
        : (cardData.projectStatus === 'SubmittedForFinalReview')
    });

    if (isProvider) {
      return cardData.projectStatus === 'Active' && progressPercentage === 100;
    }
    return cardData.projectStatus === 'SubmittedForFinalReview';
  };

  const handleCloseProjectClick = () => {
    if (isProvider) {
      setOpenCloseDialog(true);
    } else {
      setOpenReviewDialog(true);
    }
  };

  // Provider submits for review
  const handleProviderSubmit = async () => {
    try {
      setClosingProject(true);
      await closeProjectByProvider(cardData.id, token);
      
      console.log('✅ Provider submission successful, waiting for backend to update...');
      
      // Wait a moment for backend to update status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Project submitted for final review successfully!");
      setOpenCloseDialog(false);
      
      if (onProjectClosed) {
        console.log('🔄 Calling onProjectClosed to refresh...');
        await onProjectClosed();
      }
    } catch (err) {
      console.error("❌ Error submitting project:", err);
      let errorMessage = "Failed to submit project.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      alert(errorMessage);
    } finally {
      setClosingProject(false);
    }
  };

  // Client reviews and closes
  const handleClientReview = async (reviewData) => {
    try {
      setClosingProject(true);

      console.log('📝 Client review data:', reviewData);
      console.log('🆔 Project ID:', cardData.id);

      if (reviewData.isAccepted) {
        console.log('✅ Client accepting with rating:', reviewData.rating);
        console.log('📝 Review comment:', reviewData.comment);
        
        // Submit review with rating and comment
        try {
          const reviewResponse = await addClientReviewToProvider(
            cardData.id,
            reviewData.rating,
            reviewData.comment, // Use the actual comment from user
            token
          );
          console.log('✅ Review submitted successfully:', reviewResponse);
        } catch (reviewError) {
          console.error('❌ Review submission failed:', reviewError);
          console.error('❌ Review error details:', reviewError.response?.data);
          throw new Error(reviewError.response?.data?.detail || reviewError.response?.data?.message || 'Failed to submit review');
        }

        // Then close the project
        try {
          const closeResponse = await closeProjectByClient(cardData.id, token, {
            isAccepted: true,
            rejectionReason: ''
          });
          console.log('✅ Project closed successfully:', closeResponse);
        } catch (closeError) {
          console.error('❌ Project close failed:', closeError);
          console.error('❌ Close error details:', closeError.response?.data);
          throw new Error(closeError.response?.data?.detail || closeError.response?.data?.message || 'Failed to close project');
        }

        alert("Project completed successfully! Rating and review submitted. Points transferred.");
      } else {
        console.log('❌ Client rejecting with reason:', reviewData.rejectionReason);
        
        // Reject without rating
        const closeResponse = await closeProjectByClient(cardData.id, token, {
          isAccepted: false,
          rejectionReason: reviewData.rejectionReason
        });
        console.log('✅ Project rejected:', closeResponse);

        alert("Project rejected and returned to Active status for rework.");
      }

      setOpenReviewDialog(false);

      if (onProjectClosed) {
        await onProjectClosed();
      }
    } catch (err) {
      console.error("❌ Error reviewing project:", err);
      let errorMessage = err.message || "Failed to review project.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
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
      {!isProvider && cardData.projectStatus === 'Active' && (
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
            {isProvider ? 'Submit Final Work' : 'Review & Close Project'}
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
          
          {/* Show rejection reason if project was rejected */}
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

        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
            Due: {formatDate(cardData.deadline)}
          </Typography>
        </Box>

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

      {/* Provider Submit Confirmation Dialog */}
      <Dialog 
        open={openCloseDialog} 
        onClose={() => !closingProject && setOpenCloseDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Final Work</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this project for final review? 
            All tasks must be completed before submission.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenCloseDialog(false)} 
            disabled={closingProject}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProviderSubmit} 
            variant="contained"
            disabled={closingProject}
            sx={{
              background: 'linear-gradient(to right, #10B981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(to right, #059669 0%, #10B981 100%)',
              }
            }}
          >
            {closingProject ? 'Submitting...' : 'Confirm Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Client Review Dialog */}
      <ProjectCloseReviewDialog
        open={openReviewDialog}
        onClose={() => !closingProject && setOpenReviewDialog(false)}
        projectTitle={cardData.title}
        projectDescription={cardData.description}
        onSubmitReview={handleClientReview}
      />
    </Box>
  );
}