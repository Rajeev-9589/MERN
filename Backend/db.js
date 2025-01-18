const admin = require('./services/firebaseAdmin'); // Import the initialized Admin SDK

// Initialize Firestore
const db = admin.firestore(); // Correct way to get Firestore instance

module.exports = db;
