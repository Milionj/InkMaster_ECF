import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { isMock } from "./api/backend";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// En mode mock, on n'initialise pas Firebase pour éviter les requêtes réseau.
const app = isMock ? null : initializeApp(firebaseConfig);
const db = isMock ? null : getFirestore(app);
const serverTimestampValue = isMock ? (() => new Date()) : serverTimestamp;

export { app, db };
export { serverTimestampValue as serverTimestamp };
