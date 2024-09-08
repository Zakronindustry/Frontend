import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createPublicTrade, createPrivateTrade, updateTrade } from '../firebaseRealtimeCrud'; // Import Firebase CRUD functions

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

const TradeForm = ({ emotion, onClose, onSave, onAddStrategy, userId, existingTrade = null }) => { 
  // If existingTrade is provided, populate fields with its data
  const [title, setTitle] = useState(existingTrade?.reason || '');
  const [description, setDescription] = useState(existingTrade?.description || '');
  const [date, setDate] = useState(existingTrade?.date || '');
  const [time, setTime] = useState(existingTrade?.time || '');
  const [isPublic, setIsPublic] = useState(existingTrade?.isPublic || false);

  useEffect(() => {
    if (existingTrade) {
      // If editing, set form data based on existing trade
      setTitle(existingTrade.reason || '');
      setDescription(existingTrade.description || '');
      setDate(existingTrade.date || '');
      setTime(existingTrade.time || '');
      setIsPublic(existingTrade.isPublic || false);
    }
  }, [existingTrade]);

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

  const determineSessionTag = (time) => {
    const hours = parseInt(time.split(':')[0], 10);

    if (hours >= 4 && hours < 9) return '#MorningSession';
    if (hours >= 9 && hours < 12) return '#MidDaySession';
    if (hours >= 12 && hours < 14) return '#NoonSession';
    if (hours >= 14 && hours < 16) return '#AfternoonSession';
    if (hours >= 16 && hours < 20) return '#EveningSession';

    return '#OtherSession'; // Default or for times outside these ranges
  };

  const handleSave = async () => {
    const trimmedTitle = title.substring(0, 30);
    const trimmedDescription = description.substring(0, 80);

    const strategy = document.getElementById("strategy").value;
    const sessionTag = determineSessionTag(time);

    const tags = [`#${strategy}`, sessionTag];

    const tradeData = {
      instrument: document.getElementById("instrument").value,
      strategy,
      entryPoint: document.getElementById("entryPoint").value,
      exitPoint: document.getElementById("exitPoint").value,
      positionSize: document.getElementById("positionSize").value,
      profitLoss: document.getElementById("profitLoss").value,
      date,
      time,
      reason: trimmedTitle,
      description: trimmedDescription,
      isPublic,
      tags,
      emoji: getEmotionEmoji(),
      color: getEmotionColor(),
      userId,  // Ensure userId is correctly included
    };

    try {
      if (existingTrade) {
        await updateTrade(userId, existingTrade.id, tradeData); // Ensure userId is passed here
      } else {
        if (isPublic) {
          await createPublicTrade(tradeData); // Save as public trade
        } else {
          await createPrivateTrade(userId, tradeData); // Save as private trade
        }
      }
      onSave(tradeData);
      onClose();
    } catch (error) {
      console.error("Error saving trade: ", error);
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight white tint
      backdropFilter: 'blur(10px)', // Blur effect 
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
          <InputField icon="🔧" placeholder="Instrument" id="instrument" defaultValue={existingTrade?.instrument || ''} />
          <InputField icon="📊" placeholder="Strategy" id="strategy" defaultValue={existingTrade?.strategy || ''} />
          <InputField icon="📈" placeholder="Entry Point" id="entryPoint" defaultValue={existingTrade?.entryPoint || ''} />
          <InputField icon="📉" placeholder="Exit Point" id="exitPoint" defaultValue={existingTrade?.exitPoint || ''} />
          <InputField icon="💼" placeholder="Position Size" id="positionSize" defaultValue={existingTrade?.positionSize || ''} />
          <InputField icon="💰" placeholder="Profit/Loss" id="profitLoss" defaultValue={existingTrade?.profitLoss || ''} />
          <InputField
            icon="📅"
            placeholder="DD-MM-YYYY"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <InputField
            icon="⏰"
            placeholder="00:00:00"
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Box>

        <InputField 
          placeholder="Note title..." 
          multiline 
          rows={1} 
          id="reason"
          value={title}
          onChange={(e) => setTitle(e.target.value.substring(0, 35))}
        />
        <InputField 
          placeholder="Describe your trade..." 
          multiline 
          rows={9} 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.substring(0, 500))}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <FormControlLabel
            control={<Switch color="primary" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
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