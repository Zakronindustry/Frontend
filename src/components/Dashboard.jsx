import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import TradeCard from './TradeCard';
import BottomBar from './BottomBar';
import TradeForm from './TradeForm';
import { dummyTradeCards } from './dummyTradeCards';
import './Dashboard.css';

const Dashboard = () => {
  const [tradeCards, setTradeCards] = useState([]);

  useEffect(() => {
    setTradeCards(dummyTradeCards);
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmotion(null);
  };

  const handleFormSave = (tradeData) => {
    const newTradeCard = {
      ...tradeData,
      emotion: selectedEmotion,
      color: getColorForEmotion(selectedEmotion),
      emoji: getEmojiForEmotion(selectedEmotion),
    };
    setTradeCards([newTradeCard, ...tradeCards]);
    handleFormClose();
  };

  const getColorForEmotion = (emotion) => {
    // ... (unchanged)
  };

  const getEmojiForEmotion = (emotion) => {
    // ... (unchanged)
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      p: 2, 
      pt: '130px', 
      pb: '100px',
    }}>
      <div className="trade-card-grid">
        {tradeCards.map((card, index) => (
          <TradeCard key={index} {...card} />
        ))}
      </div>
      <BottomBar onCreateTradeCard={handleEmotionSelect} />
      {isFormOpen && (
        <TradeForm
          emotion={selectedEmotion}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </Box>
  );
};

export default Dashboard;