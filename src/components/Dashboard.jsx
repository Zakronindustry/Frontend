import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import TradeCard from './TradeCard'; // Private and Public trade card component
import BottomBar from './BottomBar';
import TradeForm from './TradeForm';
import { dummyTradeCards } from './dummyTradeCards';
import TradeCardOverlay from './TradeCardOverlay'; // Import the correct overlay component

const Dashboard = ({ filters }) => {
  const [tradeCards, setTradeCards] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    // Show all trades on the Dashboard (both private and public)
    setTradeCards(dummyTradeCards);
  }, []);

  useEffect(() => {
    // Apply filters when they change
    if (filters) {
      let filteredCards = dummyTradeCards;

      if (filters.emotions.length) {
        filteredCards = filteredCards.filter(card =>
          filters.emotions.includes(card.emoji)
        );
      }

      if (filters.symbols.length) {
        filteredCards = filteredCards.filter(card =>
          filters.symbols.includes(card.symbol)
        );
      }

      if (filters.sessions.length) {
        filteredCards = filteredCards.filter(card =>
          filters.sessions.some(session => card.tags.includes(session))
        );
      }

      setTradeCards(filteredCards);
    }
  }, [filters]);

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

  const handleTradeCardClick = (trade) => {
    setSelectedTrade(trade); // Set the clicked trade to be displayed in the overlay
  };

  const handleOverlayClose = () => {
    setSelectedTrade(null); // Close the overlay by setting the selectedTrade to null
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#f5f5f5', minHeight: '100vh', p: 3, pt: '125px', pb: '140px' }}>
      <Box sx={{ width: '95%' }}>
        <Grid container spacing={3}>
          {tradeCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <TradeCard 
                {...card} 
                onClick={() => handleTradeCardClick(card)} // Handle card click
              />
            </Grid>
          ))}
        </Grid>
        <BottomBar onCreateTradeCard={handleEmotionSelect} />
        {isFormOpen && (
          <TradeForm
            emotion={selectedEmotion}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
        {selectedTrade && (
          <TradeCardOverlay // Use TradeCardOverlay here
            card={selectedTrade} 
            onClose={handleOverlayClose} 
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
