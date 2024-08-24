import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import PublicTradeCard from './PublicTradeCard';
import { getPublicTrades } from "../firebaseRealtimeCrud";
import BottomBar from './BottomBar';
import TradeForm from './TradeForm';
import { parse, isWithinInterval } from 'date-fns';

const CommunityPage = ({ filters }) => {
  const [allTradeCards, setAllTradeCards] = useState([]); // Stores all trades
  const [filteredTradeCards, setFilteredTradeCards] = useState([]); // Stores filtered trades
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const applyFilters = (filters) => {
    let filteredCards = allTradeCards.filter(trade => trade.isPublic);

    if (filters && Object.keys(filters).length > 0) {
      if (filters.emotions?.length > 0) {
        filteredCards = filteredCards.filter(card =>
          filters.emotions.includes(card.emoji)
        );
      }

      if (filters.symbols?.length > 0) {
        filteredCards = filteredCards.filter(card =>
          filters.symbols.includes(card.symbol)
        );
      }

      if (filters.sessions?.length > 0) {
        filteredCards = filteredCards.filter(card =>
          filters.sessions.includes(card.session)
        );
      }

      if (filters.strategies?.length > 0) {
        filteredCards = filteredCards.filter(card =>
          filters.strategies.includes(card.strategy)
        );
      }

      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        filteredCards = filteredCards.filter(card => {
          try {
            const tradeDate = parse(card.date, 'dd-MM-yyyy', new Date());
            return isWithinInterval(tradeDate, {
              start: parse(filters.dateRange.startDate, 'dd-MM-yyyy', new Date()),
              end: parse(filters.dateRange.endDate, 'dd-MM-yyyy', new Date())
            });
          } catch (error) {
            console.error("Error parsing date for card:", card, error);
            return false; // Skip this card if there's a parsing error
          }
        });
      }
    }

    setFilteredTradeCards(filteredCards);
  };

  // Fetch public trades
  useEffect(() => {
    const fetchPublicTrades = async () => {
      try {
        const publicTrades = await getPublicTrades();
        const tradeCards = Object.values(publicTrades || {});
        setAllTradeCards(tradeCards); // Store all trades in state
        setFilteredTradeCards(tradeCards); // Initially, display all trades
      } catch (error) {
        console.error("Error fetching public trades:", error);
        setAllTradeCards([]);
        setFilteredTradeCards([]); // Set empty array on error
      }
    };

    fetchPublicTrades();
  }, []);

  // Apply filters whenever the filters or allTradeCards change
  useEffect(() => {
    applyFilters(filters);
  }, [filters, allTradeCards]); // Depend on filters and allTradeCards

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
      isPublic: true,
    };
    setAllTradeCards([newTradeCard, ...allTradeCards]); // Update allTradeCards
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
    <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#FCF6F1', minHeight: '100vh', p: 3, pt: '125px', pb: '100px' }}>
      <Box sx={{ width: '95%' }}>
        <Grid container spacing={3}>
          {filteredTradeCards.length > 0 ? (
            filteredTradeCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <PublicTradeCard {...card} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
              No trades found.
            </Typography>
          )}
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
