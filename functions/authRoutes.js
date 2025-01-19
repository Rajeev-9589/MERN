// functions/authGoogle.js
const admin = require('./firebaseAdmin');

exports.handler = async function(event, context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',  // Adjust if necessary
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'POST') {
    const { token } = JSON.parse(event.body);  // Parse the token from the request body

    try {
      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      // Respond with the UID if authentication is successful
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User authenticated successfully', uid }),
        headers: corsHeaders,
      };
    } catch (error) {
      console.error("Error verifying token: ", error);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
        headers: corsHeaders,
      };
    }
  } else if (event.httpMethod === 'OPTIONS') {
    // Handle preflight requests for CORS
    return {
      statusCode: 204,
      headers: corsHeaders,
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: corsHeaders,
    };
  }
};
