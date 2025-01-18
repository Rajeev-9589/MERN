const express = require('express');
const router = express.Router();
const db = require('../db'); // Firestore instance

// Route to add an expense
router.post('/addExpense', async (req, res) => {
    try {
        const { tag, amount, date, userId } = req.body; // Include userId for user-specific expenses

        if (!tag || !amount || !date || !userId) {
            return res.status(400).json({ error: 'All fields (tag, amount, date, userId) are required' });
        }

        // Add the expense to the Firestore 'expenses' collection
        const newExpenseRef = await db.collection('expenses').add({
            tag,
            amount,
            date,
            userId, // Include userId to link the expense to a user
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: 'Expense added successfully', id: newExpenseRef.id });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

// Route to delete an expense
router.delete('/deleteExpense/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Reference the expense document by ID and delete it
        const expenseRef = db.collection('expenses').doc(id);
        const doc = await expenseRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        await expenseRef.delete();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

module.exports = router;
