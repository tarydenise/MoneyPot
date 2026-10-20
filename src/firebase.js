import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBp3YI6fJ7DfkmzMl0U9zH2LvP15z2zBYo",
  authDomain: "moneypot-d28fd.firebaseapp.com",
  projectId: "moneypot-d28fd",
  storageBucket: "moneypot-d28fd.firebasestorage.app",
  messagingSenderId: "382921525355",
  appId: "1:382921525355:web:d6b43a0ba6379e72ac492e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);