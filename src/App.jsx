import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Community from "./components/Community";
import Messages from "./components/Messages";

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/community" element={<Community />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
