const multer = require('multer');

// Use memory storage to avoid saving files locally
const storage = multer.memoryStorage();

/**
 * Middleware for handling file uploads.
 *
 * @param {Object} req - The request object.
 * @param {Object} file - The uploaded file object.
 * @param {Function} cb - The callback function.
 * @returns {void}
 * @throws {Error} If the uploaded file is not an image (jpeg, jpg, or png).
 */
const upload = multer({
    storage,
    limits: { fileSize: 1000000 }, // 1MB file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(file.originalname.toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    }
});

module.exports = upload;
