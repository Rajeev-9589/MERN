const admin = require('firebase-admin');
const serviceAccount = require('./expense-tracker-f1410-firebase-adminsdk-zxpgu-e5f7fced68.json'); // path to the downloaded JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



module.exports = admin;
