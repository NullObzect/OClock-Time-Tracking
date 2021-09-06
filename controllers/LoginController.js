const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const LoginModel = require('../models/LoginModel');

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
      const userMailDB = user[0].user_mail;
      const userID = user[0].id;
      const userName = user[0].user_name;
      const userPassDB = user[0].user_pass;
      if (user) {
        const isValidPass = await bcrypt.compare(userPass, userPassDB)
        console.log({ isValidPass });
      }
    } catch (err) {
      console.log('====> Error form loginController', err);
      return err;
    }
  },

}

module.exports = LoginController
