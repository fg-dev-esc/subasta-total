// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY_FIREBASE,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMINIO,
  projectId: import.meta.env.VITE_FIREBASE_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
