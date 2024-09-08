import { ref, set, get, push, update, remove } from "firebase/database";
import { realtimeDb } from "./firebase"; // Import the Realtime Database instance

// Funtion to store user data in the real-time database
const storeUserInDb = (user) => {
  const userRef = ref(realtimeDb, `users/${user.uid}`);
  set(userRef, {
    userId: user.uid,
    email: user.email,
    displayName: user.displayName,
    avatar: user.photoURL,
  });
};

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

// Function to update an existing trade (private trade)
export const updateTrade = async (userId, tradeId, updatedData) => {
  try {
    console.log('Updating trade for userId:', userId);  // Debug userId
    const tradeRef = ref(realtimeDb, `users/${userId}/privateTrades/${tradeId}`);
    await update(tradeRef, updatedData);
    console.log("Trade updated successfully");
  } catch (error) {
    console.error("Error updating trade: ", error);
    throw error;
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

export const flagTrade = async (tradeId, userId) => {
  try {
    const tradeRef = ref(realtimeDb, `publicTrades/${tradeId}`);
    const snapshot = await get(tradeRef);

    if (snapshot.exists()) {
      const tradeData = snapshot.val();
      const currentFlags = tradeData.flags || 0;
      const flaggedBy = tradeData.flaggedBy || [];

      // Check if the user has already flagged this trade
      if (flaggedBy.includes(userId)) {
        console.log(`User ${userId} has already flagged trade ${tradeId}.`);
        return; // Exit the function if the user has already flagged the trade
      }

      const updatedFlags = currentFlags + 1;
      const updatedFlaggedBy = [...flaggedBy, userId]; // Add the user to the flaggedBy array

      // Update the flag count and flaggedBy array
      await update(tradeRef, { flags: updatedFlags, flaggedBy: updatedFlaggedBy });

      // If the trade has been flagged 10 times, ban it
      if (updatedFlags >= 10) {
        await update(tradeRef, { banned: true });
        console.log(`Trade ${tradeId} has been banned from the Community page.`);
      } else {
        console.log(`Trade ${tradeId} flagged ${updatedFlags} times by user ${userId}.`);
      }
    } else {
      console.log(`Trade ${tradeId} not found.`);
    }
  } catch (error) {
    console.error('Error flagging trade:', error);
  }
};

// Function to get a user's public trades
export const getUserPublicTrades = async (userId) => {
  try {
    const publicTradesRef = ref(realtimeDb, `publicTrades`);
    const snapshot = await get(publicTradesRef);
    if (snapshot.exists()) {
      const allTrades = snapshot.val();
      // Filter trades that belong to the specific user
      const userTrades = Object.keys(allTrades)
        .filter(key => allTrades[key].userId === userId)
        .map(key => ({ id: key, ...allTrades[key] }));
      return userTrades;
    } else {
      console.log("No public trades available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching user's public trades: ", error);
    return [];
  }
};

// Function to update a user's profile (using Firestore)
export const updateUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);  // Firestore reference to the user document
    await updateDoc(userRef, data);  // Updating the user document
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile: ", error);
  }
};

// Function to delete a user's account (using Firestore & Firebase Auth)
export const deleteUserAccount = async (uid) => {
  try {
    const user = auth.currentUser;  // Get the currently authenticated user
    if (user && user.uid === uid) {
      await deleteDoc(doc(db, 'users', uid));  // Delete user document from Firestore
      await user.delete();  // Delete user from Firebase Authentication
      console.log("User account deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting user account: ", error);
  }
};