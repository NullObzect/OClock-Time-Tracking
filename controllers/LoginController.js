/* eslint-disable consistent-return */
/* eslint-disable no-console */
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const LoginModel = require('../models/LoginModel');

const maxAge = 5 * 24 * 60 * 60 * 1000;

const LoginController = {
  getLogin: (req, res) => {
    res.render('pages/login')
  },
  login: async (req, res) => {
    console.log('====> login data', req.body);
    const { userMail, userPass } = req.body;

    const errors = validationResult(req).formatWith((error) => error.msg)
    if (!errors.isEmpty()) {
      return res.render('pages/login', { error: errors.mapped(), value: { userMail, userPass } })
    }
    try {
      const user = await LoginModel.getUserMail(userMail)
      console.log({ user })
      console.log(Object.keys(user).length)

      const userMailFormDB = user[0].user_mail;
      const userID = user[0].id;
      const userName = user[0].user_name;
      const userPassFormDB = user[0].user_pass;

      if (user) {
        const isValidPass = await bcrypt.compare(userPass, userPassFormDB)
        console.log({ isValidPass });
        if (isValidPass) {
          const token = jwt.sign({
            userID,
            userName,
            userMailFormDB,

          },
          process.env.JWT_SECRET, { expiresIn: maxAge })
          res.cookie('jwt', token, { maxAge })
          // res.send('Login success')
          res.render('pages/home')
        } else {
          return res.render('pages/login', { auth: true })
          // res.send('Login failed')
        }
      } else {
        res.send('Mail not found')
      }
    } catch (err) {
      res.render('pages/login', {
        data: {
          username: req.body.username,
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
