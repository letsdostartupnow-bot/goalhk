import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "你firebase畀嘅apiKey",
  authDomain: "你project.firebaseapp.com",
  projectId: "你project-id",
  storageBucket: "你project.appspot.com",
  messagingSenderId: "xxxx",
  appId: "xxxx"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);