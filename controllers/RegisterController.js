const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const RegisterModel = require('../models/RegisterModel');

const RegisterController = {
  // render page
  register: (req, res) => {
    res.render('pages/register');
  },
  // insert user
  registerController: async (req, res) => {
    const {
      userName, userPhone, userRole, userMail, userPass,
    } = req.body;
    // check validation
    const errors = validationResult(req).formatWith((error) => error.msg)
    if (!errors.isEmpty()) {
      return res.render('pages/register', {
        error: errors.mapped(),
        value: {
          userName,
          userPhone,
          userRole,
          userMail,
          userPass,
        },
      });
    }

    try {
      // hashing password
      const hashPass = await bcrypt.hash(userPass, 10);
      const insertedData = await RegisterModel.registerModel(
        userName,
        userPhone,
        userRole,
        userMail,
        hashPass,
      );
      if (insertedData.errno) {
        res.send('ERROR');
      } else {
        res.send('SUCCESS');
      }
    } catch (err) {
      return err;
    }
  },
};

module.exports = RegisterController;
