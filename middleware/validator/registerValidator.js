const { check } = require('express-validator')

const registerValidator = [
  check('userName').isLength({ min: 1 }).withMessage('Name is required!'),
  check('userPhone').isLength({ min: 1 }).withMessage('Phone number is required!'),
  check('userRole').isLength({ min: 1 }).withMessage('Role is required!'),
  check('userMail').isLength({ min: 1 }).withMessage('Email is required!'),
  check('userPass').isLength({ min: 1 }).withMessage('Password is required!'),
];

module.exports = { registerValidator }
