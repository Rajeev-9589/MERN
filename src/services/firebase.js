// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import modular methods

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqVkAvuROTTgVPk854Rp6PvZXlojKUg6E",
  authDomain: "expense-tracker-f1410.firebaseapp.com",
  projectId: "expense-tracker-f1410",
  storageBucket: "expense-tracker-f1410.firebasestorage.app",
  messagingSenderId: "732051761787",
  appId: "1:732051761787:web:8cbfea806e3bfd704dd0de",
  measurementId: "G-WJCJXMC7CR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export for use in other components
export { auth, googleProvider, signInWithPopup };
