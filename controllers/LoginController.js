/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const createError = require('http-errors')
const LoginModel = require('../models/LoginModel');

const maxAge = 5 * 24 * 60 * 60 * 1000;

const LoginController = {
  // render login page
  getLogin: (req, res) => {
    res.render('pages/login')
  },
  // handle loging user
  login: async (req, res) => {
    console.log('====> login data', req.body);
    const { userMail, userPass } = req.body;
    try {
      /* user form database  */
      const user = await LoginModel.getUserMail(userMail)
      const userMailFormDB = user[0].user_mail;
      const userID = user[0].id;
      const userName = user[0].user_name;
      const userPassFormDB = user[0].user_pass;
      const userRole = user[0].user_role;
      const userObject = {
        userID, userName, userMailFormDB, userRole,
      }

      // check valid user
      if (user) {
        const isValidPass = await bcrypt.compare(userPass, userPassFormDB)
        console.log({ isValidPass });
        if (isValidPass) {
          const token = jwt.sign({
            // set user info in token //
            userID,
            userName,
            userMailFormDB,
            userRole,

          },
          process.env.JWT_SECRET, { expiresIn: maxAge })
          res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true })
          // set userObject when user loggedin //
          res.locals.loggedInUser = userObject
          res.render('pages/login', { signIn: true })
        } else {
          res.locals.auth = true
          throw createError('Login Failed invalid authentication')
        }
      } else {
        console.log('=====> invalid mail');

        throw createError('Mail Not Found')
      }
    } catch (err) {
      console.log('catch', err)
      res.render('pages/login', {
        // catch mail in input filed //
        data: {
          username: req.body.userMail,
        },
        errors: {
          common: {
            msg: err.message,
          },
        },
      })
    }
  },
}

module.exports = LoginController
