const { Storage } = require('@google-cloud/storage');
const path = require('path'); // Import the path module

// Get the absolute path to the serviceAccount.json file
const serviceAccountPath = path.join(__dirname, 'serviceAccount.json');

// Create a storage client
const storage = new Storage({
  projectId: 'aktivio-development',
  keyFilename: serviceAccountPath, // Use the absolute path to the serviceAccount.json file
});

const bucket = storage.bucket('aktivio-users'); // Replace with your GCS bucket name

module.exports = { bucket };