import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, IconButton, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import PublicTradeCard from './components/PublicTradeCard';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar';
import { getUserProfile } from './firebaseRealtimeCrud'; // Import from firebaseRealtimeCrud.js
import { useTheme, useMediaQuery } from '@mui/material';

const UserProfile = () => {
  const { userId } = useParams(); // Assuming userId is passed in the route
  const [userData, setUserData] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is mobile

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profileData = await getUserProfile(userId);
      setUserData(profileData);
    };

    fetchUserProfile();
  }, [userId]);

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{
        display: "flex",
        justifyContent: "center",
        bgcolor: "#FCF6F1", // Match the background color in the design
        minHeight: "100vh",
        p: 3,
        pt: "125px",
        pb: "140px",
      }}>
      <TopBar />
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        {/* Profile Info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={userData.avatar}
              alt={userData.userId}
              sx={{ width: 52, height: 52, mr: 2, borderRadius: '50%' }}
            />
            {!isMobile && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {userData.userId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(userData.profileAge).toLocaleDateString()} • {userData.publicTrades} Public trades • {userData.followers} Followers
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "50%",
                '&:hover': {
                  backgroundColor: "#333",
                },
              }}
            >
              <AddIcon />
            </IconButton>
            <IconButton>
              <MessageIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Public Trades Grid */}
        <Grid container spacing={3}>
          {userData.trades && userData.trades.map((trade, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Box sx={{
                backgroundColor: trade.color || "#e0e0e0", // Use the trade color or a default grey
                borderRadius: 3,
                paddingTop: "100%", // 1:1 aspect ratio
                position: "relative",
              }}>
                <PublicTradeCard {...trade} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <BottomBar />
    </Box>
  );
};

export default UserProfile;
