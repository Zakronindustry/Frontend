import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import TradeCard from "./TradeCard";
import BottomBar from "./BottomBar";
import TradeForm from "./TradeForm";
import TradeCardOverlay from "./TradeCardOverlay";
import { getUserTrades, getPublicTrades } from "../firebaseRealtimeCrud"; // Import the Realtime CRUD functions
import { isWithinInterval, parse } from "date-fns"; 

const Dashboard = ({ filters, userId }) => {
  const [tradeCards, setTradeCards] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

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

  // Helper functions to get color and emoji based on emotion
  const getColorForEmotion = (emotion) => {
    switch (emotion) {
      case "Anxious":
        return "#F5BCBB";
      case "Calm":
        return "#D0E9BC";
      case "Confident":
        return "#B0DCF0";
      case "Greedy":
        return "#F5E0B2";
      case "Frustrated":
        return "#C1BCBC";
      default:
        return "#FFFFFF";
    }
  };

  const getEmojiForEmotion = (emotion) => {
    switch (emotion) {
      case "Anxious":
        return "🤯";
      case "Calm":
        return "😊";
      case "Confident":
        return "😎";
      case "Greedy":
        return "🤑";
      case "Frustrated":
        return "😠";
      default:
        return "😊";
    }
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
        bgcolor: "#f5f5f5",
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
