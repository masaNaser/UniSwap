import { Box, Typography, Avatar, Chip, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getImageUrl } from '../../../utils/imageHelper';
import CustomButton from '../../../components/CustomButton/CustomButton';
import ProgressSection from './ProgressSection';

export default function TrackTasksHeader({
  cardData,
  projectDetails,
  isProvider,
  totalTasks,
  completedTasks,
  progressPercentage,
  onBack,
}) {
  if (!cardData) return <div>Loading...</div>;
console.log('Rendering TrackTasksHeader with cardData:', cardData);
  const displayRole = cardData.isProvider ? 'Client' : 'Service Provider';

  // Format deadline date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formattedDeadline = formatDate(cardData.deadline);

  // Calculate progress based on completed tasks
  // Starts at 0% when no tasks are done, increases with each task moved to done column
  // const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 2,
        mb: 3,
        p: 3,
        pb: 0,
        border: '1px solid #E5E7EB',
      }}
    >
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

      {/* Title Section */}
      <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
        <Box flex={1}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 0.5, fontSize: '1.25rem' }}
          >
            {cardData.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cardData.description}
          </Typography>
        </Box>
      </Box>

      {/* Provider Info Section */}
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        mb={3}
        sx={{ flexWrap: 'wrap' }}
      >
        {/* Provider Avatar + Name */}
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

        {/* Due Date */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
            Due: {formattedDeadline}
          </Typography>
        </Box>

        {/* Status Chip */}
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

      {/* Progress Section Component */}
      <ProgressSection progressPercentage={progressPercentage} />

    </Box>
  );
}