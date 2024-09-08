import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import GoogleIcon from '@mui/icons-material/Google'; // Material UI Google Icon
import CarouselImage from "./Login.svg"; // Import the actual path to your carousel SVG image

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User logged in:", result.user);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FCF6F1',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      {/* Trade Card Carousel SVG */}
      <Box
        component="img"
        src={CarouselImage}
        alt="Trade card carousel"
        sx={{
          maxWidth: '100%',
          height: 'auto',
          marginBottom: '0px', // You can adjust the margin as needed
        }}
      />

      {/* Welcome Text */}
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '10px', fontFamily: 'Montserat' }}>
          Welcome to Pal 👋
        </Typography>
        <Typography variant="body1" sx={{ color: 'gray', marginBottom: '20px', fontFamily: 'Montserat' }}>
          Manage your trading emotions and notes in a single place, connect with the community, and improve.
        </Typography>
      </Box>

      {/* Google Sign-In Button */}
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        sx={{
          backgroundColor: '#000000',
          color: 'white',
          borderRadius: '50px',
          padding: '12px 24px',
          '&:hover': {
            backgroundColor: '#333333',
          },
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Login;