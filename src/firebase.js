import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9MLFafQPpblgV9XuTKN3y0WLnVQLO0B8",
  authDomain: "tradeiq-e4e45.firebaseapp.com",
  projectId: "tradeiq-e4e45",
  storageBucket: "tradeiq-e4e45.appspot.com",
  messagingSenderId: "391623768180",
  appId: "1:391623768180:web:58edddda83758b2b7bb921",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
