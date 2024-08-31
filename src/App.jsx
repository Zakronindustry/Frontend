import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import CommunityPage from './components/Community';
import UserProfile from './UserProfile';
import SignUp from "./components/Signup";
import Login from "./components/Login";    // Import Login component
import { getUserProfile } from "./firebaseRealtimeCrud";
import { auth } from './firebase';  // Import Firebase auth
import SeedData from "./components/SeedData";
import Analytics from './components/Analytics';
import Messages from './components/Messages';

const App = () => {
  const [filters, setFilters] = useState({});
  const [user, setUser] = useState(null); // State to hold user data
  const [dateRange, setDateRange] = useState(null); // State to hold the selected date range

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userData = await getUserProfile(currentUser.uid);  // Fetch user data based on the logged-in user's ID
        setUser(userData);
      }
    };

    fetchUserData();
  }, []);

  const handleApplyFilters = (newFilters) => {
    console.log("Setting filters:", newFilters);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    console.log("Resetting filters");
    setFilters({}); // Reset filters to an empty state
  };

  const handleApplyDateRange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    console.log("Applied date range:", startDate, endDate);
  };

  const handleResetDateRange = () => {
    setDateRange(null);
    console.log("Reset date range");
  };

  return (
    <Router>
      <TopBar 
        user={user}  // Pass the user data to the TopBar component
        onApplyFilters={handleApplyFilters} 
        onResetFilters={handleResetFilters}
        onApplyDateRange={handleApplyDateRange}
        onResetDateRange={handleResetDateRange}
      />
      <Routes>
        <Route path="/" element={<Dashboard filters={filters} />} />
        <Route path="/community" element={<CommunityPage filters={filters} />} />
        <Route path="/user/:userId" element={<UserProfile />} /> {/* Add route for user profile */}
        <Route path="/signup" element={<SignUp />} /> {/* Add SignUp route */}
        <Route path="/login" element={<Login />} />   {/* Add Login route */}
        <Route path="/analytics" element={<Analytics dateRange={dateRange} />} /> {/* Pass dateRange to Analytics */}
        <Route path="/messages" element={<Messages dateRange={dateRange} />}/> {/* Pass dateRange to Messages */}
      </Routes>
    </Router>
  );
};

export default App;