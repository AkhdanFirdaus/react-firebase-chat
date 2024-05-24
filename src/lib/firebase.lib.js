// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "xxxxxxxx",
  authDomain: "xxxxxxxxxxx",
  projectId: "xxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxx",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const firestore = getFirestore(app);
export const database = getDatabase(
  app,
  "https://chat-app-js-761f0-default-rtdb.asia-southeast1.firebasedatabase.app/"
);
export const storage = getStorage(app);
