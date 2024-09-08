import React, { useState } from 'react';
import { Box, Grid, Typography, Switch, Divider } from '@mui/material';
import { styled } from '@mui/system';
import {
  Analytics as AnalyticsIcon,
  Email as EmailIcon,
  FavoriteBorder as MoodIcon,
  People as PeopleIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  Forum as ForumIcon,
  MailOutline as MessageRequestIcon,
  AddCircleOutline as NewFollowerIcon,
  NotificationsActive as MentionIcon
} from '@mui/icons-material';
import { updateUserProfile } from "../firebaseRealtimeCrud"; // Assume this function updates the user profile in Firebase

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.grey[300],
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.common.white,
  },
}));

const Notifications = ({ user }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    topStrategy: user?.notificationSettings?.topStrategy || false,
    topInstrument: user?.notificationSettings?.topInstrument || false,
    moodAlerts: user?.notificationSettings?.moodAlerts || false,
    newMessages: user?.notificationSettings?.newMessages || false,
    messageRequests: user?.notificationSettings?.messageRequests || false,
    newFollowers: user?.notificationSettings?.newFollowers || false,
    mentions: user?.notificationSettings?.mentions || false,
    commentsOnPost: user?.notificationSettings?.commentsOnPost || false,
    likesOnPost: user?.notificationSettings?.likesOnPost || false,
    newPublicTrade: user?.notificationSettings?.newPublicTrade || false,
    comments: user?.notificationSettings?.comments || false,
  });

  const handleToggleChange = (setting) => async (event) => {
    const updatedSettings = { ...notificationSettings, [setting]: event.target.checked };
    setNotificationSettings(updatedSettings);

    // Update user settings in Firebase
    await updateUserProfile(user.userId, { notificationSettings: updatedSettings });
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 0 }}>
      <Typography sx={{ mb: 2 }} variant="h6" gutterBottom>Notifications</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Analytics Section */}
      <Typography sx={{ mb: 1 }} variant="subtitle1" gutterBottom>Analytics</Typography>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Top Strategie</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.topStrategy} 
            onChange={handleToggleChange('topStrategy')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ForumIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Top instrument</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.topInstrument} 
            onChange={handleToggleChange('topInstrument')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoodIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Mood alerts</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.moodAlerts} 
            onChange={handleToggleChange('moodAlerts')} 
          />
        </Box>
      </Grid>

      {/* Messages Section */}
      <Typography sx={{ mb: 1, mt: 1 }} variant="subtitle1" gutterBottom>Messages</Typography>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>New messages</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.newMessages} 
            onChange={handleToggleChange('newMessages')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MessageRequestIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Message requests</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.messageRequests} 
            onChange={handleToggleChange('messageRequests')} 
          />
        </Box>
      </Grid>

      {/* Activities Section */}
      <Typography sx={{ mb: 1, mt: 1 }} variant="subtitle1" gutterBottom>Activities</Typography>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NewFollowerIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>New followers</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.newFollowers} 
            onChange={handleToggleChange('newFollowers')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MentionIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Mentions of u/username</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.mentions} 
            onChange={handleToggleChange('mentions')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CommentIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Comments on your post</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.commentsOnPost} 
            onChange={handleToggleChange('commentsOnPost')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LikeIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Likes on your post</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.likesOnPost} 
            onChange={handleToggleChange('likesOnPost')} 
          />
        </Box>
      </Grid>

      {/* User you follow Section */}
      <Typography sx={{ mb: 1, mt: 1 }} variant="subtitle1" gutterBottom>User you follow</Typography>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ForumIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>New Public trade</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.newPublicTrade} 
            onChange={handleToggleChange('newPublicTrade')} 
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CommentIcon />
            <Typography variant="body1" sx={{ ml: 2 }}>Comments</Typography>
          </Box>
          <StyledSwitch 
            checked={notificationSettings.comments} 
            onChange={handleToggleChange('comments')} 
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default Notifications;
