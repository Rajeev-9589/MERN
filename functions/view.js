// functions/allTransaction.js
const db = require('./db'); // Firestore instance
const verifyToken = require('./firebaseAdmin'); // Import token verification
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000', // Adjust CORS if necessary
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event, context) => {
  // First, verify the token
  const tokenResponse = await verifyToken(event, context);
  if (tokenResponse.statusCode === 401) {
    return tokenResponse; // If token is invalid or missing, return the error response
  }

  try {
    const userId = JSON.parse(tokenResponse.body).user.uid; // Extract user ID from verified token
    
    // Fetch transactions from Firestore
    const expensesSnapshot = await db.collection('expenses').where('userId', '==', userId).get();
    const moneySnapshot = await db.collection('money').where('userId', '==', userId).get();

    const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const money = moneySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transactions fetched successfully',
        transactions: { expenses, addedMoney: money },
      }),
      headers: corsHeaders,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch transactions' }),
      headers: corsHeaders,
    };
  }
};
