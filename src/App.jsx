import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import CommunityPage from './components/Community';

const App = () => {
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (newFilters) => {
    console.log("Setting filters:", newFilters);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    console.log("Resetting filters");
    setFilters({}); // Reset filters to an empty state
  };

  return (
    <Router>
      <TopBar onApplyFilters={handleApplyFilters} onResetFilters={handleResetFilters} />
      <Routes>
        <Route path="/" element={<Dashboard filters={filters} />} />
        <Route path="/community" element={<CommunityPage filters={filters} />} />
      </Routes>
    </Router>
  );
};

export default App;
