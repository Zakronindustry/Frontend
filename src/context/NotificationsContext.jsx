import React, { createContext, useState, useContext } from "react";

// Create the context
const NotificationsContext = createContext({
  notificationOpen: false, // Default state
  setNotificationOpen: () => {}, // Default function
});

//  Create the Provider component
export function NotificationsProvider({ children }) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Provide the state and functions to the child components
  const value = {
    notificationOpen,
    setNotificationOpen,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

//  Create a custom hook to easily access the context
export function useNotifications() {
  return useContext(NotificationsContext);
}

export default NotificationsContext; // Export the context