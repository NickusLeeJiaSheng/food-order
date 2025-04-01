const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

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

module.exports = { db, app };
