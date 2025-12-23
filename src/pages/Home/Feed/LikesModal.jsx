// src/components/Modals/LikesModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import { getImageUrl } from '../../../utils/imageHelper';

function LikesModal({ open, onClose, likes, onUserClick }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxWidth: '400px',
          width: '100%',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FavoriteIcon sx={{ color: '#EF4444' }} />
          <Typography variant="h6" fontWeight="bold">
            Likes ({likes?.length || 0})
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 0 }}>
        {likes && likes.length > 0 ? (
          <List sx={{ py: 0 }}>
            {likes.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    px: 3,
                    py: 2,
                  }}
                  onClick={() => {
                    if (onUserClick) onUserClick(user.id);
                    onClose();
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={getImageUrl(user.profilePictureUrl, user.userName)}
                      sx={{ width: 48, height: 48 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="600">
                        {user.userName}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < likes.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No likes yet
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default LikesModal;