// src/components/BottomBar.jsx
import React from 'react';
import { Box, Avatar } from '@mui/material';

const EmotionChip = ({ emoji, color, onClick }) => (
  <Avatar
    sx={{
      bgcolor: color,
      width: 48,
      height: 48,
      fontSize: '1.5rem',
      margin: '0 4px',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.8,
      },
    }}
    onClick={onClick}
  >
    {emoji}
  </Avatar>
);

const BottomBar = ({ onCreateTradeCard }) => (
  <Box
    sx={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px',
      height: '71px',
      background: '#000000',
      borderRadius: '50px',
      opacity: 1,
      backdropFilter: 'blur(19px)',
      WebkitBackdropFilter: 'blur(19px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <EmotionChip emoji="😠" color="#C1BCBC" onClick={() => onCreateTradeCard('frustrated')} />
    <EmotionChip emoji="🤯" color="#F5BCBB" onClick={() => onCreateTradeCard('anxious')} />
    <EmotionChip emoji="😊" color="#D0E9BC" onClick={() => onCreateTradeCard('happy')} />
    <EmotionChip emoji="😎" color="#B0DCF0" onClick={() => onCreateTradeCard('confident')} />
    <EmotionChip emoji="🤑" color="#F5E0B2" onClick={() => onCreateTradeCard('greedy')} />
  </Box>
);

export default BottomBar;
