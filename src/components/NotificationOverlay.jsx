import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import { listenToNotifications, markNotificationAsRead, deleteNotification } from '../firebaseRealtimeCrud';

const NotificationOverlay = ({ user, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  // Listen for real-time notifications when the userId is available
  useEffect(() => {
    if (user?.userId) {
      listenToNotifications(user.userId, (newNotifications) => {
        setNotifications(newNotifications);
      });
    }
  }, [user?.userId]);

  // Mark a notification as read
  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(user.userId, notificationId);
  };

  // Delete a notification
  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(user.userId, notificationId);
  };

  // Prevent closing the overlay when clicking inside the notification box
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Box
      onClick={onClose}  // Detect clicks outside the content to close the overlay
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dim background
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1400,
      }}
    >
      <Box
        onClick={handleContentClick}  // Prevent event propagation when clicking inside content
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
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  mb: 2,
                  backgroundColor: notification.read ? '#EFEFEF' : '#FFF',
                  borderRadius: '12px',
                  p: 2,
                }}
                onClick={() => handleMarkAsRead(notification.id)}  // Mark notification as read
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
                <IconButton onClick={() => handleDeleteNotification(notification.id)}>
                  <CloseIcon sx={{ color: 'red' }} /> {/* Use red icon to represent deletion */}
                </IconButton>
                {notification.action.includes('replied') && <ReplyIcon sx={{ ml: 1, color: '#333' }} />}
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>No notifications available</Typography>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default NotificationOverlay;
