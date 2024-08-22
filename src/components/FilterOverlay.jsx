import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Close, FilterList } from "@mui/icons-material";

const FilterOverlay = ({ open, onClose, onApply }) => {
  const [emotions, setEmotions] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    console.log("FilterOverlay open state:", open);
  }, [open]);

  const emotionOptions = [
    { emoji: "😠", color: "#C1BCBC" },
    { emoji: "🤯", color: "#F5BCBB" },
    { emoji: "😊", color: "#D0E9BC" },
    { emoji: "😎", color: "#B0DCF0" },
    { emoji: "🤑", color: "#F5E0B2" },
  ];

  const sessionOptions = [
    "4AM - 9AM",
    "9AM - 12PM",
    "12PM - 2PM",
    "2PM - 4PM",
    "4PM - 8PM",
  ];

  const symbolOptions = ["AAPL", "GOOGL", "MSFT", "AMZN", "FB"];

  const handleEmotionChange = (emoji) => {
    setEmotions(
      emotions.includes(emoji)
        ? emotions.filter((e) => e !== emoji)
        : [...emotions, emoji]
    );
  };

  const handleSymbolChange = (event) => {
    setSymbols(event.target.value);
  };

  const handleSessionChange = (session) => {
    setSessions(
      sessions.includes(session)
        ? sessions.filter((s) => s !== session)
        : [...sessions, session]
    );
  };

  const handleApply = () => {
    onApply({ emotions, symbols, sessions });
    onClose();
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight white tint
          backdropFilter: 'blur(10px)', // Blur effect 
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: 600,
          bgcolor: "white",
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6">Filter Options (Debug)</Typography>
        <Typography>Open state: {open.toString()}</Typography>
        <Typography>Emotions: {emotions.join(', ')}</Typography>
        <Typography>Symbols: {symbols.join(', ')}</Typography>
        <Typography>Sessions: {sessions.join(', ')}</Typography>

        <FormGroup>
          <Typography variant="subtitle1">Emotions</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {emotionOptions.map(({ emoji, color }) => (
              <IconButton
                key={emoji}
                onClick={() => handleEmotionChange(emoji)}
                sx={{
                  bgcolor: emotions.includes(emoji) ? color : "transparent",
                  border: `1px solid ${color}`,
                }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
        </FormGroup>

        <FormControl fullWidth>
          <InputLabel>Symbols</InputLabel>
          <Select
            multiple
            value={symbols}
            onChange={handleSymbolChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {symbolOptions.map((symbol) => (
              <MenuItem key={symbol} value={symbol}>
                <Checkbox checked={symbols.indexOf(symbol) > -1} />
                <Typography>{symbol}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormGroup>
          <Typography variant="subtitle1">Sessions</Typography>
          {sessionOptions.map((session) => (
            <FormControlLabel
              key={session}
              control={
                <Checkbox
                  checked={sessions.includes(session)}
                  onChange={() => handleSessionChange(session)}
                />
              }
              label={session}
            />
          ))}
        </FormGroup>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
          <IconButton onClick={handleApply} color="primary">
            <FilterList />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterOverlay;