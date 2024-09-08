import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database"; // Import the necessary functions from the Realtime Database SDK
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9MLFafQPpblgV9XuTKN3y0WLnVQLO0B8",
  authDomain: "tradeiq-e4e45.firebaseapp.com",
  projectId: "tradeiq-e4e45",
  storageBucket: "tradeiq-e4e45.appspot.com",
  messagingSenderId: "391623768180",
  appId: "1:391623768180:web:58edddda83758b2b7bb921",
  databaseURL: "https://tradeiq-e4e45-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export { storage }; // Export the storage instance

// Export the `ref` and `set` functions from the Realtime Database SDK
export { ref, set };
