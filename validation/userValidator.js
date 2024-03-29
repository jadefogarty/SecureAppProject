const { body, check } = require('express-validator');

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
    .withMessage('Role must be either "user" or "admin"'),

    body('Username').trim().escape(),
    body('Password').trim().escape(),
    body('Role').trim().escape()
];

exports.validateLogin = [
  check('Username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  
  check('Password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),

    body('Username').trim().escape(),
    body('Password').trim().escape(),
];