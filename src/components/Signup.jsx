import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { createUser } from "./firebaseCrud";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore
      await createUser({ userId: user.uid, email, profileAge: new Date() });

      console.log("User signed up and added to Firestore");
    } catch (e) {
      console.error("Error during signup: ", e);
    }
  };

  return (
    // Your form JSX here
  );
};

export default Signup;
