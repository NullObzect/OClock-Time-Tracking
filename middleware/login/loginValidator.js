const { check, validationResult } = require('express-validator')

const loginValidator = [
  check('userMail').isLength({ min: 1 }).withMessage('Email is required!'),
  check('userPass').isLength({ min:  1}).withMessage('Password   is required!'),
]
const loginValidationHandler = (req, res, next) => {
  const error = validationResult(req)
  const mappedErrors = error.mapped()
  if (Object.keys(mappedErrors).length === 0) {
    next()
  } else {
    res.render('pages/login', {
      data: {
        username: req.body.userMail,
      },
      errors: mappedErrors,
    })
  }
}
module.exports = { loginValidator, loginValidationHandler };
