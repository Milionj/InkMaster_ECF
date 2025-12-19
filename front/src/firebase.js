import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { isMock } from "./api/backend";

// En mode mock, on renvoie des stubs pour éviter toute requête Firestore
if (isMock) {
  export const app = null;
  export const db = null;
  export const serverTimestampStub = () => new Date();
  export { serverTimestampStub as serverTimestamp };
} else {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const appInstance = initializeApp(firebaseConfig);
  const dbInstance = getFirestore(appInstance);

  export const app = appInstance;
  export const db = dbInstance;
  export { serverTimestamp };
}
