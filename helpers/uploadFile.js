const { bucket } = require('../config/gcsClient.js');

/**
 * @function uploadFile
 * @description This function uploads an image file to Google Cloud Storage. 
 * It creates a writable stream to the specified file path in the storage bucket, handles errors, and resolves the promise with the file path upon successful upload.
 * 
 * @param {Object} file - The file object to be uploaded, typically coming from a form submission. This object should contain the file buffer and its MIME type.
 * @param {string} fullPath - The full path in the Google Cloud Storage bucket where the file will be uploaded.
 * 
 * @returns {Promise<string|null>} A promise that resolves with the full path of the uploaded file or null if no file is uploaded.
 * 
 * @async
 */
const uploadFile = (file, fullPath) => {
  return new Promise((resolve, reject) => {
    // Resolve with null if no file is uploaded
    if (!file) {
      resolve(null);
    }

    // Create a file upload reference in the Google Cloud Storage bucket
    const fileUpload = bucket.file(fullPath);

    // Create a writable stream for the file upload
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    });

    // Handle any errors that occur during the file upload
    blobStream.on('error', (error) => {
      reject(error);
    });

    // Resolve with the full path once the file upload is finished
    blobStream.on('finish', () => {
      resolve(fullPath);
    });

    // Write the file buffer to the stream and end it
    blobStream.end(file.buffer);
  });
};


module.exports = uploadFile;
