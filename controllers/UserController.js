/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const UserModel = require('../models/UserModel');

const UserController = {
  // render page
  getUser: (req, res) => {
    res.render('pages/addUser');
  },
  // insert user
  addUser: async (req, res) => {
    const {
      userName, userPhone, userRole, userMail, userPass,
    } = req.body;
    // check validation
    const errors = validationResult(req).formatWith((error) => error.msg)
    if (!errors.isEmpty()) {
      return res.render('pages/addUser', {
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
      const insertedData = await UserModel.registerModel(
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

module.exports = UserController;
