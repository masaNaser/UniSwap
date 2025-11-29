import { Snackbar, Alert } from '@mui/material';

export default function TaskSnackbar({ snackbar, onClose }) {
  const getAlertColor = (severity) => {
    switch (severity) {
      case 'success':
        return '#3b82f6';  
      case 'error':
        return '#EF4444'; 
      case 'warning':
        return '#F59E0B';   
      case 'info':
        return '#3b82f6';   
      default:
        return '#3b82f6';   
    }
  };

  const alertColor = getAlertColor(snackbar.severity);

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        sx={{
          width: '100%',
          bgcolor: alertColor,
          color: 'white',
          '& .MuiAlert-icon': { color: 'white' },
        }}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}