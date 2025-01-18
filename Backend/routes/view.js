const express = require('express'); 
const router = express.Router();
const db = require('../db'); // Firestore instance
const verifyToken = require('../middleware/verifyToken'); // Import the middleware

// Route to get transactions for the logged-in user
router.get('/alltransaction', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid; // Get the UID of the logged-in user
    
    // Fetch user-specific data from Firestore
    const expensesSnapshot = await db.collection('expenses').where('userId', '==', userId).get();
    const moneySnapshot = await db.collection('money').where('userId', '==', userId).get();

    const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const money = moneySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions: { expenses, addedMoney: money }
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
