import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCE1xCvFMUtbiibEjenvhdQ1IQRAvGELMo",
  authDomain: "swapify-6f271.firebaseapp.com",
  projectId: "swapify-6f271",
  storageBucket: "swapify-6f271.firebasestorage.app",
  messagingSenderId: "998065569507",
  appId: "1:998065569507:web:d268384305ca0e03c54fd6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, signInWithPopup };
