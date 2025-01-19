// functions/deleteExpense.js
const db = require('./db'); // Firestore instance

exports.handler = async function(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',  // Adjust if necessary
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'DELETE') {
    try {
      const { id } = event.queryStringParameters;  // Get expense ID from query parameters

      const expenseRef = db.collection('expenses').doc(id);
      const doc = await expenseRef.get();

      if (!doc.exists) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Expense not found' }),
          headers: corsHeaders,
        };
      }

      await expenseRef.delete();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Expense deleted successfully' }),
        headers: corsHeaders,
      };
    } catch (error) {
      console.error("Error deleting expense:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to delete expense' }),
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
