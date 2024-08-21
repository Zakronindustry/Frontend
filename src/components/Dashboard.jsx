import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import TradeCard from './TradeCard';
import BottomBar from './BottomBar';
import TradeForm from './TradeForm';
import TradeCardOverlay from './TradeCardOverlay'; // Import the overlay component
import { dummyTradeCards } from './dummyTradeCards';
import './Dashboard.css';

const Dashboard = () => {
  const [tradeCards, setTradeCards] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null); // State to manage selected card

  useEffect(() => {
    setTradeCards(dummyTradeCards);
  }, []);

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
    switch (emotion) {
      case 'Anxious': return '#F5BCBB';
      case 'Calm': return '#D0E9BC';
      case 'Confident': return '#B0DCF0';
      case 'Greedy': return '#F5E0B2';
      case 'Frustrated': return '#C1BCBC';
      default: return '#FFFFFF';
    }
  };

  const getEmojiForEmotion = (emotion) => {
    switch (emotion) {
      case 'Anxious': return '🤯';
      case 'Calm': return '😊';
      case 'Confident': return '😎';
      case 'Greedy': return '🤑';
      case 'Frustrated': return '😠';
      default: return '😊';
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleOverlayClose = () => {
    setSelectedCard(null);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      p: 2, 
      pt: '125px', 
      pb: '100px',
    }}>
      <div className="trade-card-grid">
        {tradeCards.map((card, index) => (
          <TradeCard 
            key={index} 
            {...card} 
            onClick={() => handleCardClick(card)} // Handle card click
          />
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
      {selectedCard && (
        <TradeCardOverlay card={selectedCard} onClose={handleOverlayClose} />
      )}
    </Box>
  );
};

export default Dashboard;
