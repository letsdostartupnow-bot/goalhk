import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBshLXPZCdNZLPO5FOcy-0AiJaHjlniPlM",
  authDomain: "goalhk-4f74e.firebaseapp.com",
  projectId: "goalhk-4f74e",
  storageBucket: "goalhk-4f74e.firebasestorage.app",
  messagingSenderId: "838105580258",
  appId: "1:838105580258:web:c7e2812562742c9597d4bb",
  measurementId: "G-KYKRL3VLMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);