// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./contaadmin.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
