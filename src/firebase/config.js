// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBU09rB_pdnUyANwEItCLfCOtaUlCg_5Lg",
    authDomain: "proyecto-cafeteria-17fbc.firebaseapp.com",
    projectId: "proyecto-cafeteria-17fbc",
    storageBucket: "proyecto-cafeteria-17fbc.firebasestorage.app",
    messagingSenderId: "340703172044",
    appId: "1:340703172044:web:c5d968c5fa67137cb0f969"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);
