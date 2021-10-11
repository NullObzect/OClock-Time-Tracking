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

  googleUserSet: async (req, res) => {
    const { userMail, userName, userPic } = req.user
    const token = req.signedCookies.Oclock;
    if (token) {
      const verify = jwt.verify(token, process.env.JWT_SECRET)
      const { userObject } = verify

      if (verify) {
        const email = userObject.userMailFormDB
        const platform = 'google'
        const [user] = await UserModel.findUserByEmail(email)
        if (user) {
          await UserPlatformModel.googlePlatformSet(user.id, platform, userMail, userName, userPic)
        }
        res.redirect('/profile')
      }
    } else if (!token) {
      const [isVerify] = await UserPlatformModel.getGoogleUserByMail(userMail)
      if (isVerify) {
        const { user_id } = isVerify
        const [user] = await UserModel.findId(user_id)
        await userPlatformModel.googleUserUpdate(userName, userPic, userMail)
        if (user) {
          const userMailFormDB = user.user_mail;
          const userName = user.user_name;
          const userRole = user.user_role;
          const userObject = {
            userName, userMailFormDB, userRole,
          }
          const token = jwt.sign({
            userObject,
          }, process.env.JWT_SECRET, { expiresIn: maxAge })
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
  googleUserDelete: async (req, res) => {
    const token = req.signedCookies.Oclock;
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    const { userObject } = verify
    console.log(userObject)
    const email = userObject.userMailFormDB
    console.log(email)
    const [user] = await UserModel.findUserByEmail(email)
    await UserPlatformModel.googlePlatformRemove(user.id)
    res.redirect('/user/profile')
  },

}
module.exports = UserPlatformController
