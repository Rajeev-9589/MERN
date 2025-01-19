// functions/addExpense.js
const verifyToken = require('./firebaseAdmin'); // Import the token verification
const initializeFirebase = require('../services/firebaseAdmin');
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event, context) => {
  // First, verify the token
  const tokenResponse = await verifyToken(event, context);
  if (tokenResponse.statusCode === 401) {
    return tokenResponse; // If token is invalid or missing, return the error response
  }

  // If token is valid, proceed with adding the expense
  const { tag, amount, date, userId } = JSON.parse(event.body);

  if (!tag || !amount || !date || !userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'All fields (tag, amount, date, userId) are required' }),
      headers: corsHeaders,
    };
  }

  try {
    const admin = initializeFirebase();
    const db = admin.firestore();

    // Add the expense to Firestore
    const newExpenseRef = await db.collection('expenses').add({
      tag,
      amount,
      date,
      userId,
      createdAt: new Date().toISOString(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Expense added successfully', id: newExpenseRef.id }),
      headers: corsHeaders,
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add expense' }),
      headers: corsHeaders,
    };
  }
};
