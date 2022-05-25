const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const path = require('path');
const { unlink } = require('fs');
const userModel = require('../../models/UserModel')

const passwordValidator = [
  check('password').custom(async (value, { req }) => {
    console.log(req.body.oldPassword.length)
    const isValidPass = await bcrypt.compare(req.body.oldPassword, req.user.user_pass)
    if (value.length > 1) {
      if (req.body.oldPassword.length < 1) {
        throw Error('Old password required')
      } else if (!isValidPass) {
        throw Error('Old password wrong')
      }
    }
  }),
];
const passwordValidationHandler = function (req, res, next) {
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

module.exports = { passwordValidator, passwordValidationHandler }
