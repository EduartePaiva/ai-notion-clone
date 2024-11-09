// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "@/firebase_config.json";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
