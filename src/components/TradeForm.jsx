import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const InputField = ({ icon, placeholder, ...props }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '25px', p: 1 }}>
    <Typography sx={{ mr: 1, fontSize: '1.2rem' }}>{icon}</Typography>
    <TextField
      variant="standard"
      placeholder={placeholder}
      fullWidth
      InputProps={{ disableUnderline: true }}
      sx={{ input: { color: 'inherit', '&::placeholder': { color: 'inherit', opacity: 0.9 } } }}
      {...props}
    />
  </Box>
);

const TradeForm = ({ emotion, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getEmotionColor = () => {
    switch (emotion.toLowerCase()) {
      case 'anxious': return '#F5BCBB';
      case 'calm': return '#D0E9BC';
      case 'confident': return '#B0DCF0';
      case 'greedy': return '#F5E0B2';
      case 'frustrated': return '#C1BCBC';
      default: return '#D0E9BC';
    }
  };

  const getEmotionEmoji = () => {
    switch (emotion.toLowerCase()) {
      case 'anxious': return '🤯';
      case 'calm': return '😊';
      case 'confident': return '😎';
      case 'greedy': return '🤑';
      case 'frustrated': return '😠';
      default: return '😐';
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.substring(0, 30);
    const trimmedDescription = description.substring(0, 80);

    onSave({
      instrument: document.getElementById("instrument").value,
      strategy: document.getElementById("strategy").value,
      entryPoint: document.getElementById("entryPoint").value,
      exitPoint: document.getElementById("exitPoint").value,
      positionSize: document.getElementById("positionSize").value,
      profitLoss: document.getElementById("profitLoss").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      reason: trimmedTitle,
      description: trimmedDescription,
    });
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      bgcolor: 'rgba(0, 0, 0, 0.6)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      zIndex: 1300 
    }}>
      <Box sx={{ 
        width: '90%', 
        maxWidth: '600px', 
        maxHeight: '100vh',
        overflowY: 'auto',
        bgcolor: getEmotionColor(), 
        borderRadius: '20px', 
        p: 3,
        color: '#333'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{getEmotionEmoji()}</span> {emotion}
          </Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 18px', mb: 0.5 }}>
          <InputField icon="🔧" placeholder="Instrument" id="instrument" />
          <InputField icon="📊" placeholder="Trade strategy" id="strategy" />
          <InputField icon="📈" placeholder="Entry Point" id="entryPoint" />
          <InputField icon="📉" placeholder="Exit Point" id="exitPoint" />
          <InputField icon="💼" placeholder="Position Size" id="positionSize" />
          <InputField icon="💰" placeholder="Profit/Loss" id="profitLoss" />
          <InputField icon="📅" placeholder="DD-MM-YYYY" id="date" />
          <InputField icon="⏰" placeholder="00:00:00" id="time" />
        </Box>

        <InputField 
          placeholder="Note title..." 
          multiline 
          rows={1} 
          id="reason"
          value={title}
          onChange={(e) => setTitle(e.target.value.substring(0, 30))}
        />
        <InputField 
          placeholder="Describe your trade..." 
          multiline 
          rows={5} 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.substring(0, 80))}
        />

        <Box sx={{ display: 'fix', justifyContent: 'space-between', mt: 2 }}>
          <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.6)', borderRadius: '25px' }}>
            <span style={{ fontSize: '1.5rem' }}>📷</span>
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Make trade public"
          />
          <Button 
            variant="contained" 
            onClick={handleSave} 
            sx={{ 
              bgcolor: 'black', 
              color: 'white', 
              '&:hover': { bgcolor: 'grey.800' },
              borderRadius: '20px',
              px: 4
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TradeForm;
