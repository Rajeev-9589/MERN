// functions/addMoney.js
const db = require('./db'); // Firestore instance

exports.handler = async function(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',  // Adjust if necessary
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'POST') {
    try {
      const { from, amount, date, userId } = JSON.parse(event.body); // Parse incoming data

      if (!from || !amount || !date || !userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'All fields (from, amount, date, userId) are required' }),
          headers: corsHeaders,
        };
      }

      // Add the money record to Firestore
      const newMoneyRef = await db.collection('money').add({
        from,
        amount,
        date,
        userId,  // Link the record to a specific user
        createdAt: new Date().toISOString(),
      });

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Money added successfully', id: newMoneyRef.id }),
        headers: corsHeaders,
      };
    } catch (error) {
      console.error("Error adding money record:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to add money' }),
        headers: corsHeaders,
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: corsHeaders,
    };
  }
};
