const { check } = require('express-validator')

const loginValidator = [
  check('userMail').isLength({ min: 1 }).withMessage('Email is required!'),
  check('userPass').isLength({ min: 1 }).withMessage('Password   is required!'),
]

module.exports = { loginValidator };
