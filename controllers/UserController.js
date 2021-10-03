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
    console.log(req.body)
    console.log(req.files)
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
      const avatar = req.files[0].filename
      console.log({ avatar })
      const insertedData = await UserModel.registerModel(
        userName,
        userPhone,
        userRole,
        userMail,
        hashPass,
        avatar,
      );
      console.log({ insertedData })
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
    const { user } = req.query
    // console.log({ user });

    const users = await UserModel.getUsersList(user)
    return res.json(users)
    // res.render('pages/usersList', { users })
  },
  // show admin list
  adminList: async (req, res) => {
    try {
      const { admin } = req.query
      const admins = await UserModel.getAdminList(admin)
      return res.json(admins)
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
  // User view
  userView: async (req, res) => {
    try {
      const { userId } = req.query;
      const isUserView = await UserModel.getViewUser(userId)
      return res.json(isUserView)
    } catch (err) {
      console.log('====>Error form', err);
    }
  },
  // search user
  searchUser: async (req, res) => {
    try {
      const { userName } = req.query;
      const isSearchUser = await UserModel.getSearchUser([userName])
      // console.log({ userName });
      return res.json(isSearchUser)
    } catch (err) {
      console.log('====>Error form  search user Controller', err);
      return err;
    }
  },
  // sort by asecending order
  userSortByAscendingOrder: async (req, res) => {
    try {
      const { userName } = req.query
      const isUserSort = await UserModel.getUserSortByAscendingOrder([userName]);
      // console.log({ userName });
      // console.log({ isUserSort });
      return res.json(isUserSort)
    } catch (err) {
      console.log('====>Error form userSortByAscendingOrder Controller', err);
    }
  },

  // sort by Descending order
  userSortByDescendingOrder: async (req, res) => {
    try {
      const { userName } = req.query
      const isUserSortByDesc = await UserModel.getUserSortByDescendingOrder([userName]);
      // console.log({ userName });
      // console.log({ isUserSortByDesc });

      return res.json(isUserSortByDesc)
    } catch (err) {
      console.log('====>Error form userSortByDescendingOrder  Controller', err);
    }
  },

  userProfile: async (req, res) => {
    try {
      res.render('pages/userProfile')
    } catch (err) {
      console.log('====>Error form userProfile Controller', err);
    }
  },

};

module.exports = UserController;
