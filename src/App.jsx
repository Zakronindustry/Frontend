import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Community from "./components/Community";
import Messages from "./components/Messages";
import TopBar from "./components/TopBar";

const App = () => {
  const [filters, setFilters] = useState({ emotions: [], symbols: [], sessions: [] });

  return (
    <Router>
      <Layout>
        <TopBar onApplyFilters={setFilters} />
        <Routes>
          <Route path="/" element={<Dashboard filters={filters} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/community" element={<Community filters={filters} />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
