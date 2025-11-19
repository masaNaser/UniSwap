import { Box, Typography, Avatar, Chip, Button, IconButton, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { getImageUrl } from '../../../utils/imageHelper';
import CustomButton from '../../../components/CustomButton/CustomButton';
import ProgressSection from './ProgressSection';
import { updateTask } from '../../../services/taskService';

export default function TrackTasksHeader({
  cardData,
  projectDetails,
  isProvider,
  totalTasks,
  completedTasks,
  progressPercentage,
  onBack,
  token,        // IMPORTANT: make sure you pass token
}) {
  if (!cardData) return <div>Loading...</div>;

  const [isEditing, setIsEditing] = useState(false);
  const [newDeadline, setNewDeadline] = useState(cardData.deadline);
  const [loading, setLoading] = useState(false);

  const displayRole = cardData.isProvider ? 'Client' : 'Service Provider';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formattedDeadline = formatDate(cardData.deadline);

  // Min date = current deadline + 1 day
  const minSelectableDate = (() => {
    const d = new Date(cardData.deadline);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  // ------------ Save Deadline (PATCH) -------------
  const handleSaveDeadline = async () => {
    const chosen = new Date(newDeadline);
    const current = new Date(cardData.deadline);

    if (chosen <= current) {
      alert("New deadline must be at least 1 day AFTER current deadline.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("deadline", newDeadline);

      await updateTask(cardData.id, formData, token);

      // Update UI
      cardData.deadline = newDeadline;
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update deadline.");
    } finally {
      setLoading(false);
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
          onClick={() => setIsEditing(true)}
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

          <Button variant="contained" fullWidth onClick={handleSaveDeadline} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      )}

      {/* Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
    </Box>
  );
}
