// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./cardion-95801-firebase-adminsdk-fbsvc-0ef1a4ce30.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
