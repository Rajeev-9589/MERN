const admin = require('firebase-admin');

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get the token from the header
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Store the user data in the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
