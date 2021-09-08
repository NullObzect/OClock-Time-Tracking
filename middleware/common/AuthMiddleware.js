const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const LoginModel = require('../../models/LoginModel')

dotenv.config()

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next()
      } else {
        console.log('=====>mail', req.body.userMailFormDB);

        const user = await LoginModel.getUserMail(decodedToken.userMailFormDB)
        console.log('=====> usre', user);

        res.locals.user = user;
        next()
      }
    })
  } else {
    res.locals.user = null;
    // res.redirect('/')

    next()
  }
}
const checkCurrentLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    res.redirect('/');

    // res.send("yes ace")
  }
  next()
}

module.exports = { checkUser, checkCurrentLogin }
