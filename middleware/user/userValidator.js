const { check, validationResult } = require('express-validator')
const createError = require('http-errors');
const path = require('path');
const { unlink } = require('fs');

const userValidator = [
  check('name').isLength({ min: 1 }).withMessage('Name is required!'),
  check('phone').isLength({ min: 1 }).withMessage('Phone number is required!'),
  check('email').isLength({ min: 1 }).withMessage('Email is required!'),
];

const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        },
      );
    }
    // response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
}
module.exports = { userValidator, addUserValidationHandler }
