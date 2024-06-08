const path = require('path');
const admin = require('firebase-admin');
const serviceAccountPath = path.resolve(__dirname, 'serviceAccount.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const GeoPoint = admin.firestore.GeoPoint; // Add GeoPoint to the export

module.exports = { admin, firestore, FieldValue, GeoPoint };