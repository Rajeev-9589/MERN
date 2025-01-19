// services/db.js
const admin = require('./firebaseAdmin'); // Import the initialized Admin SDK

// Initialize Firestore and export a function to get it
function getFirestore() {
  return admin.firestore();
}

module.exports = getFirestore;
