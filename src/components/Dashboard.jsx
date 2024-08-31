import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import TradeCard from "./TradeCard";
import BottomBar from "./BottomBar";
import TradeForm from "./TradeForm";
import TradeCardOverlay from "./TradeCardOverlay";
import { getUserTrades, getPublicTrades, deleteTrade, updateTrade } from "../firebaseRealtimeCrud"; // Import the Realtime CRUD functions
import { isWithinInterval, parse } from "date-fns"; 

const Dashboard = ({ filters, userId }) => {
  const [tradeCards, setTradeCards] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [editingTrade, setEditingTrade] = useState(null); // New state to track editing

  // Function to apply filters to trade cards
  const applyFilters = (filters) => {
    let filteredCards = tradeCards;

    if (filters && Object.keys(filters).length > 0) {
      if (filters.emotions?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.emotions.includes(card.emoji)
        );
      }

      if (filters.symbols?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.symbols.includes(card.symbol)
        );
      }

      if (filters.sessions?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.sessions.includes(card.session)
        );
      }

      if (filters.strategies?.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          filters.strategies.includes(card.strategy)
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

  // Fetch trades data
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const privateTrades = await getUserTrades(userId);
        const publicTrades = await getPublicTrades();
        setTradeCards([...Object.values(privateTrades || {}), ...Object.values(publicTrades || {})]);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };

    fetchTrades();
  }, [userId]);

  useEffect(() => {
    if (filters) {
      applyFilters(filters);
    }
  }, [filters]);

  // Handling emotion selection and form save actions
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setEditingTrade(null); // Reset editing state
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmotion(null);
    setEditingTrade(null); // Reset editing state
  };

  const handleFormSave = (tradeData) => {
    if (editingTrade) {
      // Update existing trade
      const updatedTrades = tradeCards.map((trade) =>
        trade.id === editingTrade.id ? { ...editingTrade, ...tradeData } : trade
      );
      setTradeCards(updatedTrades);
      updateTrade(userId, editingTrade.id, tradeData); // Update in the database
    } else {
      // Create a new trade
      const newTradeCard = {
        ...tradeData,
        emotion: selectedEmotion,
        color: getColorForEmotion(selectedEmotion),
        emoji: getEmojiForEmotion(selectedEmotion),
      };
      setTradeCards([newTradeCard, ...tradeCards]);
    }
    handleFormClose();
  };

  const handleEditTrade = (trade) => {
    setSelectedEmotion(trade.emotion); // Set emotion to pre-fill form color/emoji
    setEditingTrade(trade); // Set the trade to be edited
    setIsFormOpen(true);
  };

  const handleDeleteTrade = (tradeId) => {
    const updatedTrades = tradeCards.filter((trade) => trade.id !== tradeId);
    setTradeCards(updatedTrades);
    deleteTrade(userId, tradeId); // Delete from the database
  };

  // Handle card click and overlay close
  const handleTradeCardClick = (trade) => {
    setSelectedTrade(trade);
  };

  const handleOverlayClose = () => {
    setSelectedTrade(null);
  };

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
                onClick={() => handleTradeCardClick(card)} // Handle card click
                onEdit={() => handleEditTrade(card)} // Handle edit
                onDelete={() => handleDeleteTrade(card.id)} // Handle delete
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
            existingTrade={editingTrade} // Pass existing trade data if editing
            userId={userId} // Pass userId for trade association
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