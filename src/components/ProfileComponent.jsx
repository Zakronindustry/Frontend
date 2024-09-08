import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Switch, TextField, IconButton, Input, Divider } from '@mui/material';  // Ensure Input is imported
import { styled } from '@mui/system';
import { Upload as UploadIcon, Edit as EditIcon } from '@mui/icons-material';
import { updateUserProfile, deleteUserAccount } from "../firebaseRealtimeCrud";  // Adjusted import path
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";  // Make sure storage is imported

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.grey[300],
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.common.white,
  },
}));

const ProfileComponent = ({ user }) => {
  // Default to empty object if user.settings is undefined
  const [displayName, setDisplayName] = useState(user?.userId || '');
  const [editMode, setEditMode] = useState(false);
  const [followTrades, setFollowTrades] = useState(user?.settings?.followTrades || false);
  const [followComments, setFollowComments] = useState(user?.settings?.followComments || false);
  const [chatPermission, setChatPermission] = useState(user?.settings?.chatPermission || false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);  // For handling avatar file
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');  // Storing avatar URL

  useEffect(() => {
    if (user) {
      setDisplayName(user.userId);
      // Ensure settings exist before accessing them
      const settings = user.settings || {};
      setFollowTrades(settings.followTrades || false);
      setFollowComments(settings.followComments || false);
      setChatPermission(settings.chatPermission || false);
      setAvatarUrl(user.avatarUrl || '');  // Set avatar URL if available
    }
  }, [user]);

  const handleDisplayNameBlur = async () => {
    setEditMode(false);
    if (user.userId !== displayName) {
      await updateUserProfile(user.uid, { userId: displayName });
    }
  };

  const handleToggleChange = async (setting, value) => {
    const updatedSettings = { ...user.settings, [setting]: value };
    switch (setting) {
      case 'followTrades':
        setFollowTrades(value);
        break;
      case 'followComments':
        setFollowComments(value);
        break;
      case 'chatPermission':
        setChatPermission(value);
        break;
      default:
        break;
    }
    await updateUserProfile(user.userId, { settings: updatedSettings });
  };

  // Avatar Upload handler
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];  // Get the selected file
    if (file) {
      setAvatarFile(file);  // Set the file in state
    }
  };

  // Upload the avatar to Firebase Storage and update the user's profile
  const handleUpload = async () => {
    if (avatarFile) {
      const avatarRef = ref(storage, `avatars/${user.userId}`);  // Reference to the Firebase Storage location
      await uploadBytes(avatarRef, avatarFile);  // Upload the file to Firebase Storage
      const downloadURL = await getDownloadURL(avatarRef);  // Get the download URL for the uploaded file
      setAvatarUrl(downloadURL);  // Update the avatar URL in the component state
      await updateUserProfile(user.userId, { avatarUrl: downloadURL });  // Save the download URL to the user's profile
      console.log("Avatar uploaded and profile updated");
    } else {
      console.log("No file selected");
    }
  };

  // Handle Account Deletion
  const handleDelete = async () => {
    if (confirmDelete === user.userId) {
      try {
        // Deleting user data from Firestore or Realtime Database
        await deleteUserAccount(user.userId);
        console.log('Account deleted successfully');
        // Optionally redirect the user or log them out after deletion
      } catch (error) {
        console.error('Error deleting user account: ', error);
      }
    } else {
      alert('Please enter the correct profile name to confirm.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 0 }}>
      <Typography sx={{ mb: 2 }} variant="h6" gutterBottom fontWeight="bold">
        Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Avatar upload button */}
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ borderRadius: '25px', color: 'black', textTransform: 'none', borderColor: 'lightgray' }}
            component="label"
          >
            Upload profile avatar
            <Input type="file" accept="image/*" onChange={handleAvatarChange} sx={{ display: 'none' }} />
          </Button>
          {avatarUrl && <img src={avatarUrl} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '100%' }} />}
          <Button onClick={handleUpload} sx={{ marginLeft: 2 }} variant="contained">Save Avatar</Button>
        </Grid>

        {/* Display name with edit functionality */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#FCF6F1', padding: 1, borderRadius: 10 }}>
            {!editMode ? (
              <Typography sx={{ flexGrow: 1, pl: 2, pr: 2 }}>{displayName}</Typography>
            ) : (
              <TextField
                value={displayName}
                placeholder="Display_name"
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={handleDisplayNameBlur}
                autoFocus
                fullWidth
                variant="standard"
              />
            )}
            <IconButton size="small" onClick={() => setEditMode(true)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Settings: Allow people to follow public trades */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontSize: '15px' }}>Allow people to follow your public trades</Typography>
              <Typography variant="caption" color="textSecondary">
                Followers will be notified about the public trades you make in the community.
              </Typography>
            </Box>
            <StyledSwitch 
              checked={followTrades}
              onChange={(e) => handleToggleChange('followTrades', e.target.checked)}
            />
          </Box>
        </Grid>

        {/* Settings: Allow people to follow your comments */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontSize: '15px' }}>Allow people to follow your comments</Typography>
              <Typography variant="caption" color="textSecondary">
                Followers will be notified about your comments in the community.
              </Typography>
            </Box>
            <StyledSwitch 
              checked={followComments}
              onChange={(e) => handleToggleChange('followComments', e.target.checked)}
            />
          </Box>
        </Grid>

        {/* Settings: Chat permission */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontSize: '15px' }}>Chat permission</Typography>
              <Typography variant="caption" color="textSecondary">
                Only the people you follow can send you a direct message.
              </Typography>
            </Box>
            <StyledSwitch 
              checked={chatPermission}
              onChange={(e) => handleToggleChange('chatPermission', e.target.checked)}
            />
          </Box>
        </Grid>

        {/* Account Deletion Section */}
        <Grid item xs={12} sx={{ marginTop: 25 }}>
          <Typography variant="h6" color="error" gutterBottom>Delete account</Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Once you delete your account, your profile, username and trade notes are completely erased from the platform.
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Enter your profile to confirm"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            sx={{ backgroundColor: 'none', borderRadius: 10, marginBottom: 2 }}
          />
          <Button variant="contained" color="error" disabled={!confirmDelete} onClick={handleDelete} sx={{ backgroundColor: '#ffccd5' }}>
            Delete
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileComponent;
