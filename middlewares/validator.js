const { body, validationResult } = require('express-validator');

// Validation and sanitization middleware
const validateUserInput = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 8 })
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateUserInput