const { check } = require('express-validator');

// Export function validateReview
exports.validateReview = [
  check('BookTitle')
  .isLength({ min:2, max: 60 })
  .withMessage("Field must be between 2 and 60 characters"),

  check('BookAuthor')
  .isLength({ min: 2, max: 30 })
  .withMessage('Field must be between 2 and 40 characters'),

check('Comments')
  .isLength({ min: 2, max: 120 })
  .withMessage('Field must be between 2 and 120 characters'),

  body('BookTitle').trim().escape(),
  body('BookAuthor').trim().escape(),
  body('Comments').trim().escape()
];
