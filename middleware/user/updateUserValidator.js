const { check, validationResult } = require('express-validator')

const updateUserValidator = [
  check('email').isLength({ min: 1 }).withMessage('Email is required!'),
];

const updateUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  console.log(mappedErrors)
  if (Object.keys(mappedErrors).length === 0) {
    next();
  }
  // response the errors
  res.status(500).json({
    errors: mappedErrors,
  });
}
module.exports = { updateUserValidator, updateUserValidationHandler }
