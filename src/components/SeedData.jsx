// src/components/SeedData.jsx
import React from "react";
import { ref, set } from "../firebase"; // Adjust the path if needed
import { v4 as uuidv4 } from "uuid";
import { realtimeDb } from "../firebase"; // Import the realtimeDb instance

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

function createDummyUser(userId) {
  const publicTradesCount = getRandomInt(10);
  const followersCount = getRandomInt(100);

  const userData = {
    userId,
    avatar: `https://randomuser.me/api/portraits/lego/${getRandomInt(10)}.jpg`,
    profileAge: new Date().toISOString(),
    publicTrades: publicTradesCount,
    followers: followersCount,
    notifications: [],
    privateTrades: [],
    messages: [],
  };

  return userData;
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
  const seedDatabase = async () => {
    const usersRef = ref(realtimeDb, "users/");

    for (let i = 0; i < 10; i++) {
      const userId = uuidv4();
      const user = createDummyUser(userId);

      // Save user
      await set(ref(realtimeDb, `users/${userId}`), user);

      // Create trades for the user
      for (let j = 0; j < user.publicTrades; j++) {
        const tradeId = uuidv4();
        const trade = createDummyTrade(userId, tradeId);

        // Save trade under user's privateTrades
        await set(ref(realtimeDb, `users/${userId}/privateTrades/${tradeId}`), trade);

        // Optionally: Save public trade separately
        if (trade.isPublic) {
          await set(ref(realtimeDb, `publicTrades/${tradeId}`), trade);
        }
      }
    }

    console.log("Dummy data seeded successfully!");
  };

  return (
    <div>
      <h1>Seed Database</h1>
      <button onClick={seedDatabase}>Seed Data</button>
    </div>
  );
};

export default SeedData;
