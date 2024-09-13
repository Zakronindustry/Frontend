import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import TopBar from "./components/TopBar";
import { getUserProfile } from "./firebaseRealtimeCrud";
import { auth } from "./firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Listen for auth state changes
import CircularProgress from "@mui/material/CircularProgress";
import { ref, set } from "firebase/database";
import { realtimeDb } from "./firebase"; // Firebase Realtime Database

// Lazy load components
const Dashboard = lazy(() => import("./components/Dashboard"));
const CommunityPage = lazy(() => import("./components/Community"));
const UserProfile = lazy(() => import("./UserProfile"));
const SignUp = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
const Analytics = lazy(() => import("./components/Analytics"));
const Messages = lazy(() => import("./components/Messages"));
const ProfileSettingsPage = lazy(
  () => import("./components/ProfileSettingsPage"),
);

// Function to check if we are on the login page
const AppWrapper = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({});
  const [user, setUser] = useState(null); // Store the user data
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    // Function to store user data in Firebase Realtime Database
    const storeUserInDb = (user) => {
      const userRef = ref(realtimeDb, `users/${user.uid}`); // Path: users/<userId>
      set(userRef, {
        userId: user.displayName,  // Use Google displayName as userId in our platform
        email: user.email,
        avatar: user.photoURL,
      }).then(() => {
        console.log("User data saved to Firebase.");
      }).catch((error) => {
        console.error("Error saving user data to Firebase:", error);
      });
    };

    // Listen for changes to the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Store user data if they log in
        storeUserInDb(currentUser);

        // Fetch user profile from Firebase
        const userData = await getUserProfile(currentUser.uid);
        setUser({
          ...userData,
          userId: userData?.userId || currentUser.displayName,  // Use displayName as userId if available
        });
      } else {
        setUser(null); // No user is logged in
      }
      setLoading(false); // Stop showing loading once we know the user's state
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleApplyDateRange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleResetDateRange = () => {
    setDateRange(null);
  };

  // Conditionally render TopBar based on the current route
  const showTopBar = location.pathname !== "/";

  return (
    <>
      {showTopBar && (
        <TopBar
          userId={user?.userId} // Pass the userId (displayName) to TopBar
          avatar={user?.avatar}  // Pass the avatar to TopBar
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onApplyDateRange={handleApplyDateRange}
          onResetDateRange={handleResetDateRange}
        />
      )}
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          {/* Protected routes */}
          <Route
            path="/notes"
            element={<Dashboard filters={filters} userId={user?.userId} />}
          />
          <Route
            path="/community"
            element={<CommunityPage filters={filters} />}
          />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route
            path="/analytics"
            element={<Analytics dateRange={dateRange} />}
          />
          <Route
            path="/messages"
            element={<Messages dateRange={dateRange} />}
          />
          <Route
            path="/profile-settings"
            element={<ProfileSettingsPage user={user} />}
          />

          {/* Public routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
