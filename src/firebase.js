// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase pour Oroyo
const firebaseConfig = {
    apiKey: "AIzaSyAiWl20rBSSHya0WkwMyj4ZpNhoQFyQbxA",
    authDomain: "oroyo-d80c1.firebaseapp.com",
    projectId: "oroyo-d80c1",
    storageBucket: "oroyo-d80c1.firebasestorage.app",
    messagingSenderId: "722717233733",
    appId: "1:722717233733:web:8d27c6432a16ba1ecf892c",
    measurementId: "G-83NJL83BT3"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;