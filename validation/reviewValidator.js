const { check } = require('express-validator');

// Export function validateTask
exports.validateReview = [
  check('Review')
  .isLength({ min:2, max: 120 })
  .withMessage("Fields must have between 2 and 120 characters")
];
