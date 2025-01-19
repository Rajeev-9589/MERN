// services/verifyToken.js
const admin = require('firebase-admin');

// Initialize Firebase Admin
function initializeFirebase() {
  if (!admin.apps.length) {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_Auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.FIREBASE_client_x509_cert_url,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin;
}

// Middleware to verify Firebase ID token in a serverless environment
const verifyToken = async (event, context) => {
  const token = event.headers['Authorization']?.replace('Bearer ', ''); // Get token from header

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Authorization token missing' }),
    };
  }

  try {
    // Initialize Firebase Admin
    const admin = initializeFirebase();
    
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Return decoded token if successful
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Token verified successfully', user: decodedToken }),
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid or expired token' }),
    };
  }
};

module.exports = verifyToken;
