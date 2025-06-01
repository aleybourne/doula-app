
// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBDb-vJQQpkgJJyz0FycaLPnhGxEvSX0y0",
  authDomain: "push-environment.firebaseapp.com",
  projectId: "push-environment",
  storageBucket: "push-environment.firebasestorage.app",
  messagingSenderId: "440765036828",
  appId: "1:440765036828:web:3a30d24500a254705422d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
export const enableOfflineSupport = async () => {
  try {
    await enableNetwork(db);
    console.log("Firestore network enabled");
  } catch (error) {
    console.error("Error enabling Firestore network:", error);
  }
};

export const disableOfflineSupport = async () => {
  try {
    await disableNetwork(db);
    console.log("Firestore network disabled");
  } catch (error) {
    console.error("Error disabling Firestore network:", error);
  }
};
