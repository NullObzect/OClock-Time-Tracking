/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path');
const { unlink } = require('fs');
const UserModel = require('../models/UserModel');
const sendMail = require('../utilities/sendMail');

const UserController = {
  // render page
  getUsers: async (req, res) => {
    const users = await UserModel.getAllUsersList()
    res.render('pages/users', { users });
  },
  // insert user
  addUser: async (req, res) => {
    let result;
    let avatar = null;
    const {
      name, email, phone, password,
    } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    if (req.files && req.files.length > 0) {
      avatar = req.files[0].filename
      result = await UserModel.addUser(name, phone, email, hashedPassword, avatar)
    } else {
      console.log('else')
      result = await UserModel.addUser(name, phone, email, hashedPassword, avatar)
    }
    try {
      if (result.affectedRows > 0) {
        res.status(200).json({
          message: 'User was added successfully!',
        })
      }
    } catch (error) {
      console.log(error)
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
            if (userAvatar !== 'demo_profile.png') {
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
  getFindUser: async (req, res) => {
    // req.flash('key', 'hello')
    // const message = req.flash()
    // console.log(message)
    res.render('pages/find-user')
  },
  postFindUser: async (req, res) => {
    const { email } = req.body
    const [user] = await UserModel.findUserByEmail(email)
    if (!user) {
      res.send('user not find')
    }
    res.render('pages/forgot-password', { email })
  },
  recoverUser: async (req, res) => {
    const userMail = req.body.email
    try {
      const [user] = await UserModel.findUserByEmail(userMail)
      if (user) {
        const { id } = user
        const email = user.user_mail

        const token = jwt.sign({
          id,
          email,
        }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const link = `${process.env.BASE_URL}/recover/${token}`
        const subject = 'Oclock reset password ,Link expire in 15 minutes'
        const textMessage = 'Oclock reset password ,'
        const htmlMessage = `<h1>Oclock reset password</h1>
        <div>
          <h4> Link expire in 15 minutes</h4>
          <h5>${link}</h5>
          <a href="${link}"> Click Here</a>
        </div>`
        await sendMail(email, subject, textMessage, htmlMessage)
        res.send(`mail send in ${email} <a href='/'>Go back</a>`)
      } else {
        res.send('user not find')
      }
    } catch (err) {
      console.log(err)
    }
  },
  recoverUserVerify: async (req, res) => {
    const { token } = req.params
    try {
      const isVerified = jwt.verify(token, process.env.COOKIE_SECRET)
      if (isVerified) {
        const { email } = isVerified
        console.log('usermail', email)
        const [user] = await UserModel.findUserByEmail(email)
        if (user) {
          res.render('pages/new-password', { email })
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
  userUpdatePassword: async (req, res) => {
    const { email, password } = req.body
    try {
      const hashPass = await bcrypt.hash(password, 10);
      UserModel.UpdatePassword(email, hashPass)
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
        res.redirect('/all-users')
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
  userVerify: async (req, res) => {
    const { id, user_mail } = req.user
    console.log(id, user_mail)
    const token = jwt.sign({
      id,
      user_mail,
    }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const link = `${process.env.BASE_URL}/user-verify/${token}`
    const subject = 'Oclock Account Verify ,Link expire in 15 minutes'
    const textMessage = 'Oclock Account Verify ,'
    const htmlMessage = `<h1>Oclock Account Verify</h1>
    <div>
      <h4> Link expire in 15 minutes</h4>
      <h5>${link}</h5>
      <a href="${link}"> Click Here</a>
    </div>`
    console.log(link)
    await sendMail(user_mail, subject, textMessage, htmlMessage)
    res.send(`mail send in ${user_mail} <a href='/'>Go back</a>`)
  },
  userVerifySet: async (req, res) => {
    const { token } = req.params
    try {
      const isVerified = jwt.verify(token, process.env.COOKIE_SECRET)
      console.log('verify', isVerified)
      if (isVerified) {
        const { user_mail } = isVerified
        const [user] = await UserModel.findUserByEmail(user_mail)
        if (user) {
          console.log(user)
          await UserModel.userVerify(user.id)
          res.redirect('/profile')
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  // update user
  updateUser: async (req, res) => {
    const userInfo = await UserModel.getUpdateUserInfo(req.params.id)
    global.userId = userInfo[0].id

    res.render('pages/updateUser', { userInfo })
  },
  // update user post
  updateUserPush: async (req, res) => {
    const id = userId
    const {
      userName, userPhone, userRole, userMail, userPass,
    } = req.body;
    const hashPass = await bcrypt.hash(userPass, 10)
    const isUpdate = await UserModel.adminCanUpdateUser(
      id,
      userName,
      userPhone,
      userRole,
      userMail,
      hashPass,
      userId,
    )
    if (isUpdate.errno) {
      res.send('Error')
    } else {
      res.redirect('/all-users')
    }
  },
  userCanEditName: async (req, res) => {
    const uId = req.user.id;
    const id = uId
    console.log('user name', req.body);
    const { name, number } = req.body;
    const isEdit = await UserModel.getUserEditInfo(uId, name, number, id);
    if (isEdit.errno) {
      res.send('Error')
    } else {
      res.redirect('/profile')
    }
  },
};

module.exports = UserController;
