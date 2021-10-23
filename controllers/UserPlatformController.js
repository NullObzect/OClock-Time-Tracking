/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
require('dotenv').config()
const jwt = require('jsonwebtoken')
const UserPlatformModel = require('../models/userPlatformModels')
const UserModel = require('../models/UserModel');
const userPlatformModel = require('../models/userPlatformModels');

const maxAge = 5 * 24 * 60 * 60 * 1000;
const UserPlatformController = {

  // User set google id in user connection table
  googleUserSet: async (req, res) => {
    const { userMail, userName, userPic } = req.user
    // Get token from cookie
    const token = req.signedCookies.Oclock;
    if (token) {
    // token verify
      const verify = jwt.verify(token, process.env.JWT_SECRET)
      const { userObject } = verify
      if (verify) {
      // Get email from cookie
        const email = userObject.userMailFormDB
        const platform = 'google'
        // Get user from database
        const [user] = await UserModel.findUserByEmail(email)
        if (user) {
          // If user find then user save in user connection table
          await UserPlatformModel.googlePlatformSet(user.id, platform, userMail, userName, userPic)
        }
        res.redirect('/profile')
      }
      // If token null
    } else if (!token) {
      // Find user from user connection table
      const [isVerify] = await UserPlatformModel.getGoogleUserByMail(userMail)
      if (isVerify) {
      // If user then user find in user database
        const { user_id } = isVerify
        const [user] = await UserModel.findId(user_id)
        // Google user infomation Update
        await userPlatformModel.googleUserUpdate(userName, userPic, userMail)
        if (user) {
          const userMailFormDB = user.user_mail;
          const userName = user.user_name;
          const userRole = user.user_role;
          const userObject = {
            userName, userMailFormDB, userRole,
          }
          // Create token for user login
          const token = jwt.sign({
            userObject,
          }, process.env.JWT_SECRET, { expiresIn: maxAge })
          // Set cookie
          res.cookie(process.env.COOKIE_NAME, token, { maxAge, httpOnly: true, signed: true });
          res.redirect('/dashboard')
        }
      } else {
        res.redirect('/')
      }
    } else {
      res.redirect('/')
    }
  },
  // User google information delete from user connection table
  googleUserDelete: async (req, res) => {
    const token = req.signedCookies.Oclock;
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    const { userObject } = verify
    const email = userObject.userMailFormDB
    const [user] = await UserModel.findUserByEmail(email)
    await UserPlatformModel.googlePlatformRemove(user.id)
    res.redirect('/profile')
  },

}
module.exports = UserPlatformController
