// functions/deleteMoney.js
const db = require('./db'); // Firestore instance

exports.handler = async function(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',  // Adjust if necessary
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'DELETE') {
    try {
      const { id } = event.queryStringParameters;  // Get the ID from query params

      // Reference the money record document by ID and delete it
      const moneyRef = db.collection('money').doc(id);
      const doc = await moneyRef.get();

      if (!doc.exists) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Money record not found' }),
          headers: corsHeaders,
        };
      }

      await moneyRef.delete();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Money record deleted successfully' }),
        headers: corsHeaders,
      };
    } catch (error) {
      console.error("Error deleting money record:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to delete money record' }),
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
