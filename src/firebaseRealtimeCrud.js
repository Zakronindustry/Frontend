import { ref, set, get, push, update, remove } from "firebase/database";
import { realtimeDb } from "./firebase"; // Import the Realtime Database instance

// Function to add a new notification for a user
export const addNotification = async (userId, notificationData) => {
  try {
    const newNotificationRef = push(ref(realtimeDb, `notifications/${userId}`));
    await set(newNotificationRef, notificationData);
    console.log("Notification added successfully");
  } catch (error) {
    console.error("Error adding notification: ", error);
  }
};

// Function to get notifications for a user
export const getNotifications = async (userId) => {
  try {
    const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
    const snapshot = await get(notificationsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No notifications available");
      return {};
    }
  } catch (error) {
    console.error("Error fetching notifications: ", error);
  }
};

// Function to mark a notification as read
export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const notificationRef = ref(realtimeDb, `notifications/${userId}/${notificationId}`);
    await update(notificationRef, { read: true });
    console.log("Notification marked as read");
  } catch (error) {
    console.error("Error marking notification as read: ", error);
  }
};

// Function to delete a notification
export const deleteNotification = async (userId, notificationId) => {
  try {
    const notificationRef = ref(realtimeDb, `notifications/${userId}/${notificationId}`);
    await remove(notificationRef);
    console.log("Notification deleted successfully");
  } catch (error) {
    console.error("Error deleting notification: ", error);
  }
};

// Function to create a new public trade
export const createPublicTrade = async (tradeData) => {
  try {
    const newTradeRef = push(ref(realtimeDb, 'publicTrades')); // Create a new key for the public trade
    await set(newTradeRef, { ...tradeData, id: newTradeRef.key }); // Save the trade with its unique ID
    console.log("Public trade created successfully");
  } catch (error) {
    console.error("Error creating public trade: ", error);
  }
};

// Function to create a new private trade
export const createPrivateTrade = async (userId, tradeData) => {
  try {
    const newTradeRef = push(ref(realtimeDb, `users/${userId}/privateTrades`)); // Create a new key for the private trade
    await set(newTradeRef, { ...tradeData, id: newTradeRef.key }); // Save the trade with its unique ID
    console.log("Private trade created successfully");
  } catch (error) {
    console.error("Error creating private trade: ", error);
  }
};

// Function to get a user's trades (public and private)
export const getUserTrades = async (userId) => {
  try {
    const tradesRef = ref(realtimeDb, `users/${userId}/trades`);
    const snapshot = await get(tradesRef);
    if (snapshot.exists()) {
      const trades = snapshot.val();
      // Convert the object of trades into an array of trades
      return Object.keys(trades).map(key => ({ id: key, ...trades[key] }));
    } else {
      console.log("No trades available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching user trades: ", error);
    return [];
  }
};

// Function to get a user's profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = ref(realtimeDb, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    return null;
  }
};

// Function to delete a trade
export const deleteTrade = async (userId, tradeId) => {
  try {
    const tradeRef = ref(realtimeDb, `users/${userId}/trades/${tradeId}`);
    await remove(tradeRef);
    console.log("Trade deleted successfully");
  } catch (error) {
    console.error("Error deleting trade: ", error);
  }
};

// Function to get all public trades
export const getPublicTrades = async () => {
  try {
    const publicTradesRef = ref(realtimeDb, `publicTrades`);
    const snapshot = await get(publicTradesRef);
    if (snapshot.exists()) {
      const trades = snapshot.val();
      // Convert the object of trades into an array of trades
      return Object.keys(trades).map(key => ({ id: key, ...trades[key] }));
    } else {
      console.log("No public trades available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching public trades: ", error);
    return [];
  }
};
