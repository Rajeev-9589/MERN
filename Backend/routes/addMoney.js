const express = require('express');
const router = express.Router();
const db = require('../db'); // Firestore instance

// Add Money Route
router.post('/addMoney', async (req, res) => {
    try {
        const { from, amount, date, userId } = req.body;

        if (!from || !amount || !date || !userId) {
            return res.status(400).json({ error: 'All fields (from, amount, date, userId) are required' });
        }

        // Add the money record to the Firestore 'money' collection
        const newMoneyRef = await db.collection('money').add({
            from,
            amount,
            date,
            userId, // Link the record to a specific user
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: 'Money added successfully', id: newMoneyRef.id });
    } catch (error) {
        console.error("Error adding money record:", error);
        res.status(500).json({ error: 'Failed to add money' });
    }
});

// Deletion Route
router.delete('/deleteMoney/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Reference the money record document by ID and delete it
        const moneyRef = db.collection('money').doc(id);
        const doc = await moneyRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Money record not found' });
        }

        await moneyRef.delete();
        res.status(200).json({ message: 'Money record deleted successfully' });
    } catch (error) {
        console.error("Error deleting money record:", error);
        res.status(500).json({ error: 'Failed to delete money record' });
    }
});

module.exports = router;
