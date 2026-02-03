// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKoMXVO4vdCYC5FAxJqgqDbOrROe94z0U",
  authDomain: "stallmaster-e28aa.firebaseapp.com",
  projectId: "stallmaster-e28aa",
  storageBucket: "stallmaster-e28aa.firebasestorage.app",
  messagingSenderId: "351259390265",
  appId: "1:351259390265:web:6ad6bfe49b03d98ba4f8e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);