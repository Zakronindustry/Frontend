import React, { useState } from 'react';
import { Box } from '@mui/material';
import BottomBar from './BottomBar'; // Import the BottomBar component
import TradeForm from './TradeForm'; // Import the TradeForm component

const AnalyticsPage = () => {
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
    // Logic to handle saving the trade, similar to the Community page
    handleFormClose();
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', p: 3, pt: '130px', pb: '100px' }}>
      {/* Content specific to the Analytics page */}
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

export default AnalyticsPage;