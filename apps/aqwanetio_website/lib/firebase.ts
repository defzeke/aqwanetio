import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

if (!firebaseConfig.apiKey) {
  if (typeof window !== "undefined") {
    console.error(
      "[firebase] NEXT_PUBLIC_FIREBASE_API_KEY is missing. Check apps/aqwanetio_website/.env and restart dev server (pnpm --filter aqwanetio_website dev). Current env keys:",
      Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_FIREBASE"))
    );
  }
}

// Initialize Firebase 
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Export the database instance
export const db = getFirestore(app); 