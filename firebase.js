import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBYHWQipsnzzlas7X8YE_p0HRkWq0QfUkg",
    authDomain: "food-order-c5088.firebaseapp.com",
    projectId: "food-order-c5088",
    storageBucket: "food-order-c5088.firebasestorage.app",
    messagingSenderId: "812846641995",
    appId: "1:812846641995:web:c94ab3fe2c2fbb628e6ece",
    measurementId: "G-HZEXQL70DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app }