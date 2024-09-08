// src/components/SeedData.jsx
import React, { useState } from "react";
import { ref, set } from "firebase/database"; // Import set and ref from Firebase database
import { v4 as uuidv4 } from "uuid";
import { realtimeDb, auth } from "../firebase"; // Import the realtimeDb and auth instances
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import for creating user

const emotions = [
  { emoji: "😠", color: "#C1BCBC", emotion: "Angry" },
  { emoji: "🤯", color: "#F5BCBB", emotion: "Mind Blown" },
  { emoji: "😊", color: "#D0E9BC", emotion: "Happy" },
  { emoji: "😎", color: "#B0DCF0", emotion: "Cool" },
  { emoji: "🤑", color: "#F5E0B2", emotion: "Greedy" },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomEmotion() {
  return emotions[getRandomInt(emotions.length)];
}

function createDummyUser(userId, email, password) {
  const publicTradesCount = getRandomInt(10);
  const followersCount = getRandomInt(100);

  const userData = {
    userId,
    avatar: `https://randomuser.me/api/portraits/lego/${getRandomInt(10)}.jpg`,
    createdAt: new Date().toISOString(),
    publicTrades: publicTradesCount,
    followers: followersCount,
    notifications: [],
    privateTrades: [],
    messages: [],
  };

  return { userData, email, password };
}

function createDummyTrade(userId, tradeId) {
  const { emoji, color, emotion } = getRandomEmotion();
  const tradeData = {
    tradeId,
    userId,
    title: `Trade ${tradeId}`,
    description: `This is a detailed description of trade ${tradeId}.`,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString(),
    isPublic: Math.random() < 0.5,
    tags: ["tag1", "tag2"],
    emotion,
    emoji,
    color,
    likes: getRandomInt(50),
    comments: [],
  };

  return tradeData;
}

const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const seedDatabase = async () => {
    setLoading(true);
    setMessage("");

    try {
      const userId = uuidv4();
      const email = `user${getRandomInt(1000)}@dummy.com`;
      const password = "password123"; // Ensure this aligns with Firebase's password requirements

      const { userData } = createDummyUser(userId, email, password);

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Save user data in the Realtime Database
      await set(ref(realtimeDb, `users/${firebaseUser.uid}`), userData);

      // Create trades for the user
      for (let j = 0; j < userData.publicTrades; j++) {
        const tradeId = uuidv4();
        const trade = createDummyTrade(firebaseUser.uid, tradeId);

        // Save trade under user's privateTrades
        await set(ref(realtimeDb, `users/${firebaseUser.uid}/privateTrades/${tradeId}`), trade);

        // Optionally: Save public trade separately
        if (trade.isPublic) {
          await set(ref(realtimeDb, `publicTrades/${tradeId}`), trade);
        }
      }

      setLoading(false);
      setMessage("Dummy data seeded successfully!");
    } catch (error) {
      setLoading(false);
      setMessage(`Error seeding data: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Seed Database</h1>
      {loading ? <p>Seeding data...</p> : <button onClick={seedDatabase}>Seed Data</button>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default SeedData;