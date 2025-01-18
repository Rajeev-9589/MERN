import React from 'react';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore'; // Firestore methods

const Login = ({ onLogin ,setUserData}) => {
  const db = getFirestore(); // Initialize Firestore

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("User logged in: ", user);

      // Save user data to Firestore
      const userRef = doc(db, "users", user.uid); // Reference to user's document
      await setDoc(userRef, {
        profile: {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        },
      }, { merge: true }); // Merge to prevent overwriting existing data

      onLogin(true); // Mark the user as authenticated'
      setUserData(user)
      
    } catch (error) {
      console.error("Error logging in with Google: ", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 w-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
