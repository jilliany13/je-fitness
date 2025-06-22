import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get, push, update } from 'firebase/database';

// TODO: Replace this configuration with your actual Firebase project credentials
// Go to Firebase Console -> Project Settings -> Your Apps -> Web App
// Copy the firebaseConfig object and replace the values below
const firebaseConfig = {
    apiKey: "AIzaSyDB7xAK26XTkh1-c6p3rpyuqKBZsw3SJiw",
    authDomain: "je-fitness.firebaseapp.com",
    projectId: "je-fitness",
    storageBucket: "je-fitness.appspot.com",
    messagingSenderId: "380827946135",
    appId: "1:380827946135:web:3b424d9c228c5fcef4edd2",
    measurementId: "G-T94CQZFJJH",
    databaseURL: "https://je-fitness-default-rtdb.firebaseio.com"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app; 