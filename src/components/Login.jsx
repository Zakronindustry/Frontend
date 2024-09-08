import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom"; // For navigation
import GoogleIcon from '@mui/icons-material/Google'; // Material UI Google Icon
import CarouselImage from "./Login.svg"; // Path to SVG image
import { ref, set } from "firebase/database";
import { realtimeDb } from "../firebase"; // Import Realtime Database

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to store user data in Firebase Realtime Database
  const storeUserInDb = (user) => {
    const userRef = ref(realtimeDb, `users/${user.uid}`); // Firebase path: users/<userId>
    set(userRef, {
      userId: user.displayName,  // Use displayName from Google as userId in your platform
      email: user.email,
      avatar: user.photoURL,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User logged in:", result.user);

      // Store user data in Firebase Realtime Database
      storeUserInDb(result.user);

      // Redirect to the Dashboard after successful login
      navigate("/"); // Assuming "/" is the Dashboard route
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
        padding: '10px',
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
          marginBottom: '0px',
        }}
      />

      {/* Welcome Text */}
      <Box sx={{ marginBottom: '10px' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: 'Montserat' }}>
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