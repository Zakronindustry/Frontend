import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { Bell, ChevronRight, BookOpen, FileText, ShieldCheck, User } from 'lucide-react';
import TopBar from './TopBar';
import ProfileComponent from './ProfileComponent';
import Notifications from './Notifications';
import BookmarkComponent from './BookmarkComponent'; // Adjust path according to your project structure
import NotificationOverlay from './NotificationOverlay'; // Import the Notification Overlay

// Styled components with fallback values
const StyledBox = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  height: '600px',
  overflowY: 'auto',
});

const ProfileSettingsPage = ({ user }) => {  // Accept the `user` prop here
  const [selectedSetting, setSelectedSetting] = useState("Profile");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);  // State for notification overlay

  const profileData = {
    name: user?.userId || "Retro_D@niel!",  // Use user data if available
    joinDate: user?.createdAt || "Apr 19, 2023",
    publicTrades: 26,
    followers: 197,
  };

  // Updated menu items
  const menuItems = [
    { text: "Profile", icon: <User size={20} /> },
    { text: "Bookmark", icon: <BookOpen size={20} /> },
    { text: "Notifications", icon: <Bell size={20} /> },
    { text: "Platform Policy", icon: <FileText size={20} /> },
    { text: "Privacy Policy", icon: <ShieldCheck size={20} /> },
  ];

  const renderComponent = (component) => {
    switch (component) {
      case "Profile":
        return <ProfileComponent user={user} />; // Pass the `user` prop to the profile component
      case "Bookmark":
        return <BookmarkComponent />;
      case "Notifications":
        return <Notifications />;
      case "Platform Policy":
        return <PlatformPolicyComponent />;
      case "Privacy Policy":
        return <PrivacyPolicyComponent />;
      default:
        return <ProfileComponent user={user} />; // Pass the `user` prop by default
    }
  };

  // Toggle Notification Overlay
  const toggleNotificationOverlay = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <Box sx={{ bgcolor: '#FCF6F1', minHeight: '100vh' }}>
      <TopBar user={user} /> {/* Pass the `user` to the TopBar */}
      <Box sx={{ width: '90%', mx: 'auto', pt: '127px' }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <StyledBox padding='25px'>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3} position="relative">
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: '-5px', // Adjust positioning to the top-left corner of the card
                    left: '-5px',
                    backgroundColor: '#FCF6F1',
                  }}
                  onClick={toggleNotificationOverlay}
                >
                  <Bell size={24} color="black" />
                </IconButton>

                <Box
                  width={100}
                  height={100}
                  bgcolor="#FCF6F1"
                  border="2px solid #FFFFFF"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={1.5}
                  mt={1}
                  overflow="hidden" // Ensure the image fits within the circular box
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar} // Use the user's avatar URL from the database
                      alt={`${user.userId}'s avatar`} // Accessible alt text
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Make the image cover the box area
                    />
                  ) : (
                    <Typography variant="h4">👨</Typography> // Fallback emoji if no avatar is set
                  )}
                </Box>
                <Typography variant="h6" align="center">
                  Hi 👋 {profileData.name}
                </Typography>
              </Box>
              <Box
                bgcolor="black"
                color="white"
                borderRadius={5}
                p={2.5}
                mb={2}
                display="flex"
                justifyContent="space-between"
                fontSize="0.75rem"
              >
                <Box display="flex" alignItems="center">
                  <Box bgcolor="red" px={0.5} mr={0.5} borderRadius={0.5}>
                    17
                  </Box>
                  {profileData.joinDate}
                </Box>
                <Box display="flex" alignItems="center">
                  <Box mr={0.5}>🔨</Box>
                  {profileData.publicTrades} Trades
                </Box>
                <Box display="flex" alignItems="center">
                  <Box mr={0.5}>🔔</Box>
                  {profileData.followers} Followers
                </Box>
              </Box>
              <List disablePadding>
                {menuItems.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    divider={index !== menuItems.length - 1}
                    sx={{ py: 1 }}
                    onClick={() => setSelectedSetting(item.text)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} // Align the arrow to the right
                  >
                    <Box display="flex" alignItems="center">
                      {item.icon}
                      <ListItemText primary={item.text} sx={{ ml: 2 }} />
                    </Box>
                    {/* Align ChevronRight to the right */}
                    <ChevronRight size={20} />
                  </ListItem>
                ))}
              </List>
            </StyledBox>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            <StyledBox padding="25px">
              {renderComponent(selectedSetting)}
            </StyledBox>
          </Grid>
        </Grid>
      </Box>

      {/* Notification Overlay positioned at the top-left corner of the left card */}
      {isNotificationOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '160px',
            left: '75px',
            width: '300px',
            zIndex: 1500,
            bgcolor: 'white',
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            p: 2,
          }}
        >
          <NotificationOverlay notifications={[]} onClose={toggleNotificationOverlay} />
        </Box>
      )}
    </Box>
  );
};

export default ProfileSettingsPage;
