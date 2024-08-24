import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, IconButton, Grid } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import MessageIcon from '@mui/icons-material/Message';
import PublicTradeCard from './components/PublicTradeCard';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar';
import { getUserProfile } from './firebaseRealtimeCrud'; // Import from firebaseRealtimeCrud.js

const UserProfile = () => {
  const { userId } = useParams(); // Assuming userId is passed in the route
  const [userData, setUserData] = useState(null);

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
    <Box sx={{ bgcolor: '#FAF9F7', minHeight: '100vh' }}>
      <TopBar />
      <Box sx={{ padding: 2 }}>
        {/* Profile Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={userData.avatar}
              alt={userData.userId}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {userData.userId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.profileAge} • {userData.publicTrades} Public trades • {userData.followers} Followers
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" sx={{ borderRadius: 6 }}>Follow</Button>
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
        <Grid container spacing={2}>
          {userData.trades && userData.trades.map((trade) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trade.id}>
              <PublicTradeCard {...trade} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <BottomBar />
    </Box>
  );
};

export default UserProfile;
