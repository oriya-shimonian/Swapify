// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE1xCvFMUtbiibEjenvhdQ1IQRAvGELMo",
  authDomain: "swapify-6f271.firebaseapp.com",
  projectId: "swapify-6f271",
  storageBucket: "swapify-6f271.firebasestorage.app",
  messagingSenderId: "998065569507",
  appId: "1:998065569507:web:d268384305ca0e03c54fd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);