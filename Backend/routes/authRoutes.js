// authRoutes.js (Backend)
const express = require('express');
const admin = require('../services/firebaseAdmin');
const router = express.Router();

router.post('/google', async (req, res) => {
  const idToken = req.body.token;

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // You can use the UID to find or create the user in your database
    res.status(200).send({ message: 'User authenticated successfully', uid });
  } catch (error) {
    console.error("Error verifying token: ", error);
    res.status(401).send({ message: 'Unauthorized' });
  }
});

module.exports = router;
