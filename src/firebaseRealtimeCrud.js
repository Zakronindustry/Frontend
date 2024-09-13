import { ref, set, get, push, update, remove, getDatabase, onValue } from "firebase/database";
import { realtimeDb } from "./firebase"; // Import the Realtime Database instance

// Function to store user data in the real-time database
const storeUserInDb = (user) => {
  const userRef = ref(realtimeDb, `users/${user.uid}`);
  set(userRef, {
    userId: user.uid,
    email: user.email,
    displayName: user.displayName,
    avatar: user.photoURL,
  });
};

const handleFirebaseOperation = async (operation, refPath, data = null) => {
  try {
    const ref = ref(realtimeDb, refPath);
    switch (operation) {
      case 'set':
        await set(ref, data);
        break;
      case 'update':
        await update(ref, data);
        break;
      case 'remove':
        await remove(ref);
        break;
      case 'push':
        const newRef = push(ref);
        await set(newRef, data);
        return newRef.key;
      default:
        throw new Error('Invalid operation');
    }
    console.log(`${operation} operation successful`);
  } catch (error) {
    console.error(`Error during ${operation} operation: `, error);
    throw error;
  }
};

// Usage
export const addNotification = async (userId, notificationData) => {
  return handleFirebaseOperation('push', `notifications/${userId}`, notificationData);
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
    throw new Error("Failed to fetch notifications");
  }
};

// Function to fetch notifications in real-time
export const listenToNotifications = (userId, callback) => {
  const notificationsRef = ref(realtimeDb, `notifications/${userId}`);
  onValue(notificationsRef, (snapshot) => {
    const notifications = snapshot.val();
    callback(notifications || []);
  });
};

// Function to mark a notification as read
export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const notificationRef = ref(
      realtimeDb,
      `notifications/${userId}/${notificationId}`,
    );
    await update(notificationRef, { read: true });
    console.log("Notification marked as read");
  } catch (error) {
    console.error("Error marking notification as read: ", error);
  }
};

// Function to delete a notification
export const deleteNotification = async (userId, notificationId) => {
  try {
    const notificationRef = ref(
      realtimeDb,
      `notifications/${userId}/${notificationId}`,
    );
    await remove(notificationRef);
    console.log("Notification deleted successfully");
  } catch (error) {
    console.error("Error deleting notification: ", error);
  }
};

// Function to create a new public trade
export const createPublicTrade = async (userId, tradeData) => {
  try {
    const publicTradesRef = ref(realtimeDb, `users/${userId}/Trades/publicTrades`);

    if (!tradeData.timestamp) {
      tradeData.timestamp = Date.now(); // Ensure a timestamp exists if not provided
    }

    // Create the new trade
    const newTradeRef = push(publicTradesRef);
    await set(newTradeRef, { ...tradeData, id: newTradeRef.key });
    console.log("Public trade created successfully with timestamp:", tradeData.timestamp);
    return newTradeRef.key;
  } catch (error) {
    console.error("Error creating public trade: ", error);
    throw error;
  }
};

// Function to create a new private trade
export const createPrivateTrade = async (userId, tradeData) => {
  try {
    const privateTradesRef = ref(realtimeDb, `users/${userId}/Trades/privateTrades`);

    if (!tradeData.timestamp) {
      tradeData.timestamp = Date.now(); // Ensure a timestamp exists if not provided
    }

    // Create the new trade
    const newTradeRef = push(privateTradesRef);
    await set(newTradeRef, { ...tradeData, id: newTradeRef.key });
    console.log("Private trade created successfully with timestamp:", tradeData.timestamp);
    return newTradeRef.key;
  } catch (error) {
    console.error("Error creating private trade: ", error);
    throw error;
  }
};

// Function to get a trade by Id (public or private)
export const getTradeById = async (userId, tradeId, isPublic = false) => {
  const tradeRef = isPublic
    ? ref(realtimeDb, `users/${userId}/Trades/publicTrades/${tradeId}`)
    : ref(realtimeDb, `users/${userId}/Trades/privateTrades/${tradeId}`);
  try {
    const snapshot = await get(tradeRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // No trade found
    }
  } catch (error) {
    console.error("Error fetching trade by ID:", error);
    return null;
  }
};

// Function to update an existing trade (public or private)
export const updateTrade = async (userId, tradeId, updatedData, isPublic = false) => {
  try {
    let tradeRef;

    if (isPublic) {
      // If the trade is public, update it in the public trades list 
      tradeRef = ref(realtimeDb, `users/${userId}/Tradesp/ublicTrades/${tradeId}`);
    } else {
      // If the trade is private, update it in the user's private trades list
      tradeRef = ref(realtimeDb, `users/${userId}/Trades/privateTrades/${tradeId}`);
    }

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
      return Object.keys(trades).map((key) => ({ id: key, ...trades[key] }));
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
      console.log("No user profile found for this userId.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Function to delete a trade
export const deleteTrade = async (userId, tradeId, isPublic = false) => {
  try {
    let tradeRef;

    if (isPublic) {
      // If the trade is public, delete it from the public trades list
      tradeRef = ref(realtimeDb, `publicTrades/${tradeId}`);
    } else {
      // If the trade is private, delete it from the user's private trades list
      tradeRef = ref(realtimeDb, `users/${userId}/Trades/privateTrades/${tradeId}`);
    }

    // Remove the trade from the database
    await remove(tradeRef);

    console.log("Trade deleted successfully");
  } catch (error) {
    console.error("Error deleting trade: ", error);
    throw error;
  }
};

// Function to get all public trades
export const getPublicTrades = async () => {
  try {
    const publicTradesRef = ref(realtimeDb, `publicTrades`);
    const snapshot = await get(publicTradesRef);
    if (snapshot.exists()) {
      const trades = snapshot.val();
      return Object.keys(trades).map((key) => ({ id: key, ...trades[key] }));
    } else {
      console.log("No public trades available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching public trades: ", error);
    return [];
  }
};

// Function to flag a trade
export const flagTrade = async (tradeId, userId) => {
  try {
    const tradeRef = ref(realtimeDb, `publicTrades/${tradeId}`);
    const snapshot = await get(tradeRef);
    if (snapshot.exists()) {
      const tradeData = snapshot.val();
      const currentFlags = tradeData.flags || 0;
      const flaggedBy = tradeData.flaggedBy || [];

      if (flaggedBy.includes(userId)) {
        console.log(`User ${userId} has already flagged trade ${tradeId}.`);
        return;
      }

      const updatedFlags = currentFlags + 1;
      const updatedFlaggedBy = [...flaggedBy, userId];

      await update(tradeRef, {
        flags: updatedFlags,
        flaggedBy: updatedFlaggedBy,
      });

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
    console.error("Error flagging trade:", error);
  }
};

// Function to get a user's public trades
export const getUserPublicTrades = async (userId) => {
  try {
    const publicTradesRef = ref(realtimeDb, `publicTrades`);
    const snapshot = await get(publicTradesRef);
    if (snapshot.exists()) {
      const allTrades = snapshot.val();
      const userTrades = Object.keys(allTrades)
        .filter((key) => allTrades[key].userId === userId)
        .map((key) => ({ id: key, ...allTrades[key] }));
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

// Function to update user profile in Firebase
export const updateUserProfile = async (userId, data) => {
  const userRef = ref(realtimeDb, `users/${userId}`);
  try {
    await update(userRef, data);
    console.log('User profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

// Function to follow a user
export const followUser = async (loggedInUserId, targetUserId) => {
  const userRef = ref(realtimeDb, `users/${loggedInUserId}/following/${targetUserId}`);
  return set(userRef, true);
};

// Function to unfollow a user
export const unfollowUser = async (loggedInUserId, targetUserId) => {
  const userRef = ref(realtimeDb, `users/${loggedInUserId}/following/${targetUserId}`);
  return remove(userRef);
};

// Function to flag a user
export const flagUser = async (loggedInUserId, targetUserId) => {
  const flagRef = ref(realtimeDb, `users/${targetUserId}/flags/${loggedInUserId}`);
  return set(flagRef, true);
};

// Function to block a user
export const blockUser = async (loggedInUserId, targetUserId) => {
  const blockRef = ref(realtimeDb, `users/${loggedInUserId}/blocked/${targetUserId}`);
  return set(blockRef, true);
};

// Function to start a chat with a user
export const startChatWithUser = async (loggedInUserId, targetUserId, firstMessage) => {
  const chatId = `${loggedInUserId}_${targetUserId}`;
  const chatRef = ref(realtimeDb, `chats/${chatId}`);
  const chatSnapshot = await get(chatRef);

  if (!chatSnapshot.exists()) {
    const newChat = {
      users: { [loggedInUserId]: true, [targetUserId]: true },
      messages: [],
    };

    if (firstMessage) {
      newChat.messages.push({
        sender: loggedInUserId,
        text: firstMessage,
        timestamp: Date.now(),
      });
    }

    await set(chatRef, newChat);
    console.log("New chat created!");
  }

  return chatId;
};

// Function to create a chat request
export const createChatRequest = async (loggedInUserId, targetUserId, message) => {
  const chatId = await startChatWithUser(loggedInUserId, targetUserId, message);
  const notificationRef = push(ref(realtimeDb, `notifications/${targetUserId}`));
  await set(notificationRef, {
    message: `Chat request from ${loggedInUserId}`,
    chatId: chatId,
    timestamp: Date.now(),
    read: false,
  });
  console.log("Chat request sent and notification created");
};

// Function to send message to a chat
export const sendMessageToChat = async (chatId, senderId, messageText) => {
  try {
    const messageRef = push(ref(realtimeDb, `chats/${chatId}/messages`));
    const messageData = {
      sender: senderId,
      text: messageText,
      timestamp: Date.now(),
    };
    await set(messageRef, messageData);
    console.log("Message sent to chat:", chatId);
  } catch (error) {
    console.error("Error sending message to chat:", error);
  }
};

// Fetch the list of users the logged-in user has interacted with
export const getUsersList = async () => {
  try {
    const usersRef = ref(realtimeDb, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.keys(users).map(key => ({ userId: key, ...users[key] }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};

// Function to add a user to an existing group chat
export const addUserToGroupChat = async (chatId, userId) => {
  try {
    const chatRef = ref(realtimeDb, `chats/${chatId}/users/${userId}`);
    await set(chatRef, true);

    const notificationRef = push(ref(realtimeDb, `notifications/${userId}`));
    await set(notificationRef, {
      message: `You've been added to a group chat.`,
      chatId: chatId,
      timestamp: Date.now(),
      read: false,
    });

    console.log(`User ${userId} added to group chat ${chatId} and notified.`);
  } catch (error) {
    console.error("Error adding user to group chat: ", error);
  }
};

// Function to listen to real-time messages in a chat
export const listenToMessages = (chatId, callback) => {
  const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    callback(messages ? Object.values(messages) : []);
  });
};

// Function to get a chat by users
export const getChatByUsers = async (loggedInUserId, targetUserId) => {
  const chatId = `${loggedInUserId}_${targetUserId}`;
  const chatRef = ref(realtimeDb, `chats/${chatId}`);
  const snapshot = await get(chatRef);

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

// Function to add message to chat
export const addMessageToChat = async (chatId, messageData) => {
  try {
    const messagesRef = push(ref(realtimeDb, `chats/${chatId}/messages`));
    await set(messagesRef, {
      ...messageData,
      timestamp: Date.now(),
    });
    console.log("Message added to chat");
  } catch (error) {
    console.error("Error adding message to chat: ", error);
  }
};

// Function to delete a user account
export const deleteUserAccount = async (uid) => {
  try {
    const user = auth.currentUser; // Get the currently authenticated user
    if (user && user.uid === uid) {
      await deleteDoc(doc(db, "users", uid)); // Delete user document from Firestore
      await user.delete(); // Delete user from Firebase Authentication
      console.log("User account deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting user account: ", error);
  }
};

// Real-time listener for public trades
export const listenToPublicTrades = (callback) => {
  const publicTradesRef = ref(realtimeDb, 'publicTrades');
  const unsubscribe = onValue(publicTradesRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback({});
    }
  });

  // Return a function to unsubscribe from the listener
  return unsubscribe;
};

// Real-time listener for user trades
export const listenToUserTrades = (userId, callback) => {
  const userTradesRef = ref(realtimeDb, `users/${userId}/privateTrades`);
  return onValue(userTradesRef, (snapshot) => {
    const trades = snapshot.exists() ? snapshot.val() : {};
    callback(trades);
  });
};