/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path');
const { unlink } = require('fs');
const UserModel = require('../models/UserModel');
const sendMail = require('../utilities/sendMail');
const { pageNumbers } = require('../utilities/pagination')
const htmlMailText = require('./htmlMailText')

const UserController = {
  // render page
  getUsers: async (req, res) => {
    const user = await UserModel.getAllUsersList()
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const users = user.slice(startIndex, endIndex)
    const pageLength = user.length / limit
    const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
    console.log({ numberOfPage, page })
    const pageNumber = pageNumbers(numberOfPage, 2, page)
    console.log(pageNumber)
    res.render('pages/users', {
      users, numberOfPage, page, pageNumber,
    });
  },
  // insert user
  addUser: async (req, res) => {
    let result;
    let avatar = null;
    console.log(req.body)
    const {
      name, email, phone, gender,
    } = req.body
    try {
      if (req.files && req.files.length > 0) {
        avatar = req.files[0].filename
        result = await UserModel.addUser(name, gender, phone, email, avatar)
      } else {
        console.log('else')
        result = await UserModel.addUser(name, gender, phone, email, avatar)
        console.log(result)
      }
      if (result.affectedRows > 0) {
        const id = result.insertId
        const token = jwt.sign({
          id,
          email,
        }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const link = `${process.env.BASE_URL}/user-verify/${token}`
        const subject = 'Oclock active account, link expire in 15 minutes'
        const textMessage = 'Oclock Account Verify ,'
        const htmlMessage = htmlMailText.addUser(name, link)
        await sendMail(email, subject, textMessage, htmlMessage)
        res.status(200).json({
          message: 'User was added successfully!',
        })
      }
    } catch (error) {
      res.status(500).json({
        errors: {
          common: {
            msg: 'Unknown error occured!',
          },
        },
      });
    }
  },
  avatarChange: async (req, res) => {
    const { user } = req
    const userAvatar = user.avatar
    const urlR = /^(http|https)/
    const platformAvatar = userAvatar.search(urlR)
    try {
      const avatar = req.files[0].filename
      if (avatar) {
        if (platformAvatar === 0) {
          try {
            await UserModel.updateAvatar(avatar, user.id)
            req.flash('success', 'Change image');
            res.redirect('/profile');
          } catch (err) {
            console.log(err)
          }
        } else {
          try {
            if (userAvatar !== null) {
              unlink(
                path.join(__dirname, `../public/uploads/avatars/${userAvatar}`), (err) => {
                  console.log(err)
                  console.log(`${userAvatar} delete`)
                },
              )
            }
            await UserModel.updateAvatar(avatar, user.id)
            res.redirect('/profile');
          } catch (err) {
            console.log(err)
          }
        }
      }
    } catch (err) {
      req.flash('fail', 'Select image')
      res.redirect('/profile')
    }
  },
  // Find User
  getSearchUser: async (req, res) => {
    // req.flash('key', 'hello')
    // const message = req.flash()
    // console.log(message)
    res.render('pages/search-forgot-user')
  },
  getAccountActive: async (req, res) => {
    // req.flash('key', 'hello')
    // const message = req.flash()
    // console.log(message)
    res.render('pages/search-account-active')
  },
  postSearchUser: async (req, res) => {
    const { email } = req.body
    try {
      const user = await UserModel.searchUser(email)
      if (user.length) {
        res.status(200).json({ result: user })
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: '  Your search did not return any results. Please try again with other information.',
            },
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        errors: {
          common: {
            msg: '  Your search did not return any results. Please try again with other information.',
          },
        },
      });
    }
  },
  postSearchInactiveUser: async (req, res) => {
    const { email } = req.body
    try {
      const user = await UserModel.searchInactiveUser(email)
      if (user.length) {
        res.status(200).json({ result: user })
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: '  Your search did not return any results. Please try again with other information.',
            },
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        errors: {
          common: {
            msg: '  Your search did not return any results. Please try again with other information.',
          },
        },
      });
    }
  },

  recoverUser: async (req, res) => {
    const userMail = req.body.email
    try {
      const [user] = await UserModel.findUserByEmail(userMail)
      console.log(user)
      if (user) {
        const { id } = user
        const email = user.user_mail
        const name = user.user_name

        const token = jwt.sign({
          id,
          email,
        }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const link = `${process.env.BASE_URL}/recover/${token}`
        const subject = 'Oclock reset password , link expire in 15 minutes'
        const textMessage = 'Oclock reset password ,'
        const htmlMessage = htmlMailText.recoverUser(name, link)
        await sendMail(email, subject, textMessage, htmlMessage)
        res.status(200).json({
          result: 'We sent your code to successfully',
          email,
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
  recoverUserVerify: async (req, res) => {
    const { token } = req.params
    try {
      const isVerified = jwt.verify(token, process.env.JWT_SECRET)
      if (isVerified) {
        const { email } = isVerified
        console.log('usermail', email)
        const [user] = await UserModel.findUserByEmail(email)
        if (user) {
          res.render('pages/new-password', { email })
        }
      }
    } catch (err) {
      res.render('pages/link-expire')
    }
  },
  userUpdatePassword: async (req, res) => {
    const { email, password } = req.body
    try {
      const hashPass = await bcrypt.hash(password, 10);
      UserModel.UpdatePassword(email, hashPass)
      const [user] = await UserModel.findUserByEmail(email)
      await UserModel.userVerify(user.id)
      res.redirect('/')
    } catch (err) {
      console.log(err)
    }
  },

  // Reset password
  getResetPassword: async (req, res) => {
    res.render('pages/reset-password')
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
        res.redirect('/users')
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

      return res.json(isUserSortByDesc)
    } catch (err) {
      console.log('====>Error form userSortByDescendingOrder  Controller', err);
    }
  },
  userVerify: async (req, res) => {
    const userMail = req.body.email
    const [user] = await UserModel.findUserByEmail(userMail)
    console.log(user)
    if (user) {
      const { id } = user
      const email = user.user_mail
      const name = user.user_name
      const token = jwt.sign({
        id,
        email,
      }, process.env.JWT_SECRET, { expiresIn: '15m' })
      const link = `${process.env.BASE_URL}/user-verify/${token}`
      const subject = 'Oclock active account, link expire in 15 minutes'
      const textMessage = 'Oclock Account Verify ,'
      const htmlMessage = htmlMailText.userVerify(name, link)
      await sendMail(email, subject, textMessage, htmlMessage)
      res.status(200).json({
        result: 'We sent your mail to successfully',
        email,
      })
    }
  },
  userVerifySet: async (req, res) => {
    const { token } = req.params
    try {
      const isVerified = jwt.verify(token, process.env.COOKIE_SECRET)
      console.log('verify', isVerified)
      if (isVerified) {
        const { email } = isVerified
        const [user] = await UserModel.findUserByEmail(email)
        if (user) {
          res.render('pages/new-password', { email })
        }
      }
    } catch (err) {
      res.render('pages/link-expire')
    }
  },

  // update user
  updateUser: async (req, res) => {
    try {
      const [findIdFormUser] = await UserModel.getUpdateUserInfo(req.params.id)
      const {
        id, finger_id, user_name, gender, user_phone, user_mail, status, create_at,
      } = findIdFormUser
      const { avatar } = findIdFormUser
      const userAvatar = avatar
      res.render('pages/updateUser', {
        id, finger_id, user_name, gender, user_phone, user_mail, status, userAvatar, create_at,
      })
    } catch (err) {
      console.log('====>Error form userProfile Controller', err);
    }
  },
  // update user post
  updateUserPush: async (req, res) => {
    const {
      id, fingerId, email, joinDate,
    } = req.body
    const [findIdFormUser] = await UserModel.getUpdateUserInfo(id)
    if (email !== findIdFormUser.user_mail) {
      await UserModel.adminCanUpdateUser(id, email)
    }
    if (joinDate !== findIdFormUser.create_at || fingerId !== findIdFormUser.finger_id) {
      await UserModel.userJoinDateChange(id, fingerId, joinDate)
    }

    res.redirect('/users')
  },
  searchUserByName: async (req, res) => {
    const { user } = req.body
    console.log(user)
    const input = user.replace(/^\s+|\s+$/gm, '')
    const result = await UserModel.userSearch(input)
    console.log(result)
    res.json(result)
  },
};

module.exports = UserController;
