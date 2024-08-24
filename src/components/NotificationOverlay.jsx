import React from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';

const NotificationOverlay = ({ notifications, onClose, onMarkAsRead }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight white tint
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1400,
    }}
  >
    <Box
      sx={{
        width: '90%',
        maxWidth: '400px',
        maxHeight: '95vh',
        backgroundColor: '#F8F4EF',
        borderRadius: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Notifications <Badge badgeContent={notifications.length} color="error" />
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              mb: 2,
              backgroundColor: notification.read ? '#EFEFEF' : '#FFF',
              borderRadius: '12px',
              p: 2,
            }}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {notification.user} {notification.action}
                </Typography>
              }
              secondary={
                <>
                  {notification.message && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                  )}
                  <Typography variant="caption" color="textSecondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </>
              }
            />
            {notification.action.includes('replied') && <ReplyIcon sx={{ ml: 1, color: '#333' }} />}
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
);

export default NotificationOverlay;