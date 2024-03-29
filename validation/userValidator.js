const { check } = require('express-validator');

// Export function validateUser
exports.validateSignup = [
  check('Username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  
  check('Password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),

  check('Role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"')
];

exports.validateLogin = [
  check('Username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  
  check('Password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),

];