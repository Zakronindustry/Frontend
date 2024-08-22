import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import PublicTradeCard from './PublicTradeCard'; // Import the PublicTradeCard component
import { dummyPublicTradeCards } from './dummyPublicTradeCards'; // Import the dummyPublicTradeCards
import BottomBar from './BottomBar'; // Import the BottomBar component
import TradeForm from './TradeForm'; // Import the TradeForm component (for creating new trades)

const CommunityPage = ({ filters }) => {
  const [publicTradeCards, setPublicTradeCards] = useState([]);

  useEffect(() => {
    // Show only public trades on the Community Page
    setPublicTradeCards(dummyPublicTradeCards.filter(trade => trade.isPublic));
  }, []);

  useEffect(() => {
    // Apply filters when they change
    if (filters) {
      let filteredCards = dummyPublicTradeCards.filter(trade => trade.isPublic);

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

      setPublicTradeCards(filteredCards);
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
      isPublic: true, // Ensure the new trade card is public
    };
    setPublicTradeCards([newTradeCard, ...publicTradeCards]);
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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#f5f5f5', minHeight: '100vh', p: 3, pt: '125px', pb: '100px' }}>
      <Box sx={{ width: '95%' }}>
        <Grid container spacing={3}>
          {publicTradeCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <PublicTradeCard {...card} />
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
      </Box>
    </Box>
  );
};

export default CommunityPage;
