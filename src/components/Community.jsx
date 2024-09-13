import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import PublicTradeCard from './PublicTradeCard';
import { listenToPublicTrades } from "../firebaseRealtimeCrud"; 
import BottomBar from './BottomBar';
import TradeForm from './TradeForm';
import { parse, isWithinInterval } from 'date-fns';

const CommunityPage = ({ filters }) => {
  const [allTradeCards, setAllTradeCards] = useState([]); 
  const [filteredTradeCards, setFilteredTradeCards] = useState([]); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const applyFilters = (filters) => {
    let filteredCards = allTradeCards.filter(trade => trade.isPublic);

    if (filters && Object.keys(filters).length > 0) {
      if (filters.emotion?.length > 0) {
        filteredCards = filteredCards.filter(card =>
          filters.emotion.includes(card.emoji)
        );
      }

      if (filters.instrument?.length > 0) {
        filteredCards = filteredCards.filter(card =>
          filters.instrument.includes(card.instrument)
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
            return false; 
          }
        });
      }
    }

    setFilteredTradeCards(filteredCards);
  };

  // Fetch public trades in real-time
  useEffect(() => {
    const handleNewPublicTrades = (newTrades) => {
      const tradeCards = Object.values(newTrades || {});
      setAllTradeCards(tradeCards); 
      setFilteredTradeCards(tradeCards); 
    };

    const unsubscribe = listenToPublicTrades(handleNewPublicTrades);

    return () => {
      // Unsubscribe from real-time updates when component unmounts
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    applyFilters(filters);
  }, [filters, allTradeCards]);

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
    setAllTradeCards([newTradeCard, ...allTradeCards]); 
    handleFormClose();
  };

  const getColorForEmotion = (emotion) => {
    switch (emotion) {
      case 'Anxious': return '#F5BCBB';
      case 'Calm': return '#D0E9BC';
      case 'Confident': return '#B0DCF0';
      case 'Greedy': return '#F5E0B2';
      case 'Frustrated': return '#C1BCBC';
    }
  };

  const getEmojiForEmotion = (emotion) => {
    switch (emotion) {
      case 'Anxious': return '🤯';
      case 'Calm': return '😊';
      case 'Confident': return '😎';
      case 'Greedy': return '🤑';
      case 'Frustrated': return '😠';
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#FCF6F1', minHeight: '100vh', p: 3, pt: '125px', pb: '100px' }}>
      <Box sx={{ width: '95%' }}>
        <Grid container spacing={3}>
          {filteredTradeCards.length > 0 ? (
            filteredTradeCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <PublicTradeCard
                  id={card.id}
                  color={getColorForEmotion(card.color)}
                  emotion={card.emotion}
                  reason={card.title}
                  instrument={card.instrument}
                  profitLoss={card.profitLoss}
                  entryPoint={card.entryPoint}
                  exitPoint={card.exitPoint}
                  positionSize={card.positionSize}
                  description={card.description}
                  time={card.time}
                  tags={card.tags}
                  emoji={getEmojiForEmotion(card.emotion)}
                  likes={card.likes}
                  comments={card.comments}
                  commentsList={card.commentsList}
                  userId={card.userId}
                />
              </Grid>
            ))
          ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          width: '100%',
        }}
      >
        <Typography variant="subtitle1">No trades from the community!</Typography>
      </Box>
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