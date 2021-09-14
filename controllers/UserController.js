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
        res.render('pages/addUser', { addUser: true });
      }
    } catch (err) {
      return err;
    }
  },
  // show all users list
  allUsersList: async (req, res) => {
    const users = await UserModel.getAllUsersList()

    res.render('pages/allUsers', { users })
  },
  // show user list
  usersList: async (req, res) => {
    const users = await UserModel.getUsersList()
    res.render('pages/usersList', { users })
  },
  // show admin list
  adminList: async (req, res) => {
    try {
      const admins = await UserModel.getAdminList()
      res.render('pages/adminList', { admins })
    } catch (err) {
      console.log('====>Error form Admin list controller', err);
    }
  },
  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id
      const isUserDelete = await UserModel.getDeleteUser(userId)
      if (isUserDelete.errno) {
        res.send('Error')
      } else {
        res.render('pages/allUsers')
      }
    } catch (err) {
      console.log('====>Error form Delet controller', err);
      return err;
    }
  },

};

module.exports = UserController;
