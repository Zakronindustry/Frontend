import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import PublicTradeCard from './components/PublicTradeCard';
import BottomBar from './components/BottomBar';
import TopBar from './components/TopBar';
import { getUserProfile, getUserPublicTrades } from './firebaseRealtimeCrud';
import { useTheme, useMediaQuery } from '@mui/material';

const UserProfile = () => {
  const { userId } = useParams(); // Get the userId from the URL parameters
  const [userData, setUserData] = useState(null);
  const [publicTrades, setPublicTrades] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleStartChat = async () => {
    try {
      // Use the logged-in user's ID and the visited user's ID to start the chat
      const chatId = await startChatWithUser(user.userId, visitedUser.userId, "Chat request"); // Pass the initial message

      // After creating the chat, navigate to the Messages page with the chat ID
      navigate(`/messages?chatId=${chatId}`);
    } catch (error) {
      console.error("Error starting chat: ", error);
    }
  };

  useEffect(() => {
    const fetchUserProfileAndTrades = async () => {
      try {
        // Fetch user data
        const profileData = await getUserProfile(userId);
        setUserData(profileData);

        // Fetch public trades associated with this user
        const trades = await getUserPublicTrades(userId);
        setPublicTrades(trades);
      } catch (error) {
        console.error('Error fetching user profile or trades:', error);
      }
    };

    fetchUserProfileAndTrades();
  }, [userId]);

  if (!userData) {
    return <Typography>Loading...</Typography>; // Show a loading message while data is being fetched
  }


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        bgcolor: "#FCF6F1",
        minHeight: "100vh",
        p: 3,
        pt: "125px",
        pb: "140px",
      }}
    >
      <TopBar profileData={{ avatar: userData.avatar, userName: userData.userId }} />

      <Box sx={{ width: "95%" }}>
        <Grid container spacing={3}>
          {publicTrades.length > 0 ? (
            publicTrades.map((trade, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Box
                  sx={{
                    backgroundColor: trade.color || "#e0e0e0",
                    borderRadius: 5,
                    paddingTop: "0%",
                    position: "relative",
                  }}
                >
                  <PublicTradeCard {...trade} />
                </Box>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
                width: '100%',
              }}
            >
              <Typography variant="subtitle1">No public trades found</Typography>
            </Box>
          )}
        </Grid>
      </Box>
      <BottomBar />
    </Box>
  );
};

export default UserProfile;
