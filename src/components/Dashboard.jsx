import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress } from "@mui/material";
import TradeCard from "./TradeCard";
import BottomBar from "./BottomBar";
import TradeForm from "./TradeForm";
import TradeCardOverlay from "./TradeCardOverlay";
import {
  listenToUserTrades,
  deleteTrade,
  updateTrade,
  createPrivateTrade,
} from "../firebaseRealtimeCrud"; // Use a listener function like the community page
import { push, ref } from "firebase/database"; // Firebase functions
import { realtimeDb } from "../firebase"; // Firebase database

const Dashboard = ({ filters, userId }) => {
  const [tradeCards, setTradeCards] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [editingTrade, setEditingTrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const handleUserTrades = (trades) => {
      const privateTrades = Object.values(trades || {});
      setTradeCards(privateTrades); // Set the user's private trades
      setLoading(false); // Set loading to false after data is fetched
    };

    // Set up the real-time listener for private trades
    const unsubscribe = listenToUserTrades(userId, handleUserTrades);

    // Cleanup listener when the component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (filters) {
      applyFilters(filters);
    }
  }, [filters, tradeCards]);

  // Function to apply filters to trade cards
  const applyFilters = (filters) => {
    let filteredCards = tradeCards;

    if (filters && Object.keys(filters).length > 0) {
      if (filters.emotion?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.emotion.includes(card.emoji),
        );
      }

      if (filters.instrument?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.instrument.includes(card.instrument),
        );
      }

      if (filters.sessions?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.sessions.includes(card.session),
        );
      }

      if (filters.strategies?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.strategies.includes(card.strategy),
        );
      }

      if (filters.dateRange?.startDate && filters.dateRange?.endDate) {
        filteredCards = filteredCards.filter((card) => {
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

    setTradeCards(filteredCards);
  };

  // Function to map emotions to colors
  const getColorForEmotion = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'anxious': return '#F5BCBB';
      case 'calm': return '#D0E9BC';
      case 'confident': return '#B0DCF0';
      case 'greedy': return '#F5E0B2';
      case 'frustrated': return '#C1BCBC';
    }
  };

  // Function to map emotions to emojis
  const getEmojiForEmotion = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'anxious': return '🤯';
      case 'calm': return '😊';
      case 'confident': return '😎';
      case 'greedy': return '🤑';
      case 'frustrated': return '😠';
    }
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setEditingTrade(null); // Reset editing state when creating a new trade
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmotion(null);
    setEditingTrade(null); // Reset editing state
  };

  const handleFormSave = (tradeData) => {
    const color = getColorForEmotion(selectedEmotion);
    const emoji = getEmojiForEmotion(selectedEmotion);

    if (editingTrade) {
      const updatedTrades = tradeCards.map((trade) =>
        trade.id === editingTrade.id
          ? { ...editingTrade, ...tradeData, color, emoji }
          : trade,
      );
      setTradeCards(updatedTrades);

      // Update the trade in Firebase
      updateTrade(userId, editingTrade.id, { ...tradeData, color, emoji }, editingTrade.isPublic);
    } else {
      // Create a new private trade by default
      const newTradeId = push(ref(realtimeDb, `users/${userId}/privateTrades`)).key;
      const newTradeCard = {
        ...tradeData,
        id: newTradeId,
        emotion: selectedEmotion,
        color,
        emoji,
      };
      setTradeCards([newTradeCard, ...tradeCards]);
      createPrivateTrade(userId, { ...newTradeCard });
    }
    handleFormClose();
  };

  const handleEditTrade = (trade) => {
    setSelectedEmotion(trade.emotion);
    setEditingTrade(trade);
    setIsFormOpen(true);
  };

  const handleDeleteTrade = (tradeId) => {
    const updatedTrades = tradeCards.filter((trade) => trade.id !== tradeId);
    setTradeCards(updatedTrades);
    deleteTrade(userId, tradeId);
  };

  const handleTradeCardClick = (trade) => {
    setSelectedTrade(trade);
  };

  const handleOverlayClose = () => {
    setSelectedTrade(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        bgcolor: "#FCF6F1",
        minHeight: "100vh",
        p: 3,
        pt: "125px",
        pb: "140px",
      }}
    >
      <Box sx={{ width: "95%" }}>
        <Grid container spacing={3}>
          {tradeCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <TradeCard
                {...card}
                onClick={() => handleTradeCardClick(card)}
                onEdit={() => handleEditTrade(card)}
                onDelete={() => handleDeleteTrade(card.id)}
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
            existingTrade={editingTrade}
            userId={userId}
          />
        )}
        {selectedTrade && (
          <TradeCardOverlay
            card={selectedTrade}
            onClose={handleOverlayClose}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;