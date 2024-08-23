import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterOverlay = ({ open, onClose, onApply, onReset, strategies = [] }) => {
  const [emotions, setEmotions] = useState([]);
  const [instrument, setInstrument] = useState("");
  const [strategy, setStrategy] = useState("");
  const [session, setSession] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const emotionOptions = [
    { emoji: "😠", color: "#C1BCBC" },
    { emoji: "🤯", color: "#FFD6E5" },
    { emoji: "😊", color: "#D5F0C1" },
    { emoji: "😎", color: "#C3E7FF" },
    { emoji: "🤑", color: "#FFD6A5" },
  ];

  const sessionOptions = [
    "4 AM - 9 AM: Pre-market",
    "9 AM - 12 PM: Morning",
    "12 PM - 2 PM: Midday",
    "2 PM - 4 PM: Afternoon",
    "4 PM - 8 PM: After-hours",
  ];

  const instrumentOptions = ["AAPL", "GOOGL", "MSFT", "AMZN", "FB"];

  const handleEmotionChange = (emoji) => {
    setEmotions(
      emotions.includes(emoji)
        ? emotions.filter((e) => e !== emoji)
        : [...emotions, emoji]
    );
  };

  const handleReset = () => {
    setEmotions([]);
    setInstrument("");
    setStrategy("");
    setSession("");
    setStartDate(null);
    setEndDate(null);
    if (onReset) onReset();
  };

  const handleApply = () => {
    const filters = {
      emotions,
      instrument,
      strategy,
      session,
      dateRange: startDate && endDate ? { startDate, endDate } : null,
    };

    if (
      emotions.length > 0 ||
      instrument ||
      strategy ||
      session ||
      (startDate && endDate)
    ) {
      onApply(filters);
      onClose();
    } else {
      alert("Please select at least one filter criterion.");
    }
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 400,
          maxHeight: "95vh",
          bgcolor: "#FFF8F0",
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Filter
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            {emotionOptions.map(({ emoji, color }) => (
              <IconButton
                key={emoji}
                onClick={() => handleEmotionChange(emoji)}
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: emotions.includes(emoji) ? color : "transparent",
                  border: `2px solid ${color}`,
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>

          <Select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            displayEmpty
            fullWidth
            sx={{
              bgcolor: "white",
              borderRadius: 6,
              mb: 2,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem disabled value="">
              <span style={{ color: "#aaa" }}>🔍 Instrument</span>
            </MenuItem>
            {instrumentOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            displayEmpty
            fullWidth
            sx={{
              bgcolor: "white",
              borderRadius: 6,
              mb: 0.5,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem disabled value="">
              <span style={{ color: "#aaa" }}>🚀 Trade strategy</span>
            </MenuItem>
            {strategies.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mt: 2, mb: 0.5 }}
          >
            Sessions
          </Typography>
          <RadioGroup value={session} onChange={(e) => setSession(e.target.value)}>
            {sessionOptions.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={
                  <Radio sx={{ "&.Mui-checked": { color: "black" } }} />
                }
                label={option}
              />
            ))}
          </RadioGroup>

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", mt: 1, mb: 2 }}
          >
            Date Range
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              customInput={
                <input
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "none",
                    borderRadius: "20px",
                    backgroundColor: "white",
                  }}
                />
              }
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              customInput={
                <input
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "none",
                    borderRadius: "20px",
                    backgroundColor: "white",
                  }}
                />
              }
            />
          </Box>
        </Box>

        <Box sx={{ p: 3, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={handleReset}
              sx={{
                bgcolor: "#E0E0E0",
                color: "black",
                borderRadius: 6,
                px: 4,
                "&:hover": { bgcolor: "#D0D0D0" },
              }}
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              sx={{
                bgcolor: "black",
                color: "white",
                borderRadius: 6,
                px: 4,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterOverlay;
