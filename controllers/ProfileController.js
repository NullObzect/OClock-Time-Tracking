const jwt = require('jsonwebtoken')
const path = require('path');
const { unlink } = require('fs');
const bcrypt = require('bcrypt')
const ProfileModel = require('../models/ProfileModel')
const UserModel = require('../models/UserModel');
// cookie verifier function
function cookieVerifier(token) {
  const isVerify = jwt.verify(token, process.env.JWT_SECRET)
  const { userObject } = isVerify;
  return userObject;
}
const ProfileController = {

  userProfile: async (req, res) => {
    try {
      const token = req.signedCookies.Oclock;
      // console.log({ token });
      // const verifyPlatformUser = jwt.verify(token, process.env.JWT_SECRET)
      // const { userObject } = verifyPlatformUser
      const { userMailFormDB } = cookieVerifier(token)
      // console.log({ userMailFormDB });
      const [findIdFormUser] = await UserModel.findUserByEmail(userMailFormDB)

      const {
        id, user_name, user_phone, user_mail, status, avatar,
      } = findIdFormUser
      // console.log({ status, avatar })

      const platformUser = await ProfileModel.userConnectionDetailsUniqueInfo(id)
      console.log('req flash', req.flash('fail'))
      res.render('pages/profile', {
        platformUser, user_name, user_phone, user_mail, status, avatar,
      })
    } catch (err) {
      console.log('====>Error form userProfile Controller', err);
    }
  },

  // change facebook profile
  changeProfile: async (req, res) => {
    const { user } = req
    try {
      const token = req.signedCookies.Oclock;
      const { userMailFormDB } = cookieVerifier(token)

      const { id } = req.params;
      console.log(id);
      const [platformUser] = await ProfileModel.userId(id)
      const { user_avatar } = platformUser
      const userAvatar = user.avatar
      if (userAvatar !== 'demo_profile.png') {
        unlink(
          path.join(__dirname, `../public/uploads/avatars/${userAvatar}`), (err) => {
            console.log(err)
            console.log(`${userAvatar} delete`)
          },
        )
      }
      const updateProfile = await ProfileModel.setProfile(user_avatar, userMailFormDB)
      if (updateProfile.errno) {
        res.send('error')
      } else {
        res.redirect('/profile')
      }

      console.log(user_avatar);
    } catch (err) {
      console.log('====>Error form ProfileController / changeProfile', err);
    }
  },
  updateProfile: async (req, res) => {
    const { id, avatar } = req.user
    const {
      socialImage, name, phone, password,
    } = req.body
    let profileImage;
    let hashPass;
    if (req.files && req.files.length > 0) {
      console.log(req.files)
      profileImage = req.files[0].filename
    } else {
      profileImage = socialImage
    }
    console.log(profileImage)
    if (profileImage) {
      console.log('pp')
      if (avatar !== null && avatar.match(/\.(?:jpg|jpeg|png)/g)) {
        unlink(
          path.join(__dirname, `../public/uploads/avatars/${avatar}`), (err) => {
            console.log(err)
          },
          console.log(`${avatar} delete`)
        )
      }
    }

    if (password) {
      hashPass = await bcrypt.hash(password, 10)
    }
    const pp = await ProfileModel.updateProfile(profileImage, name, phone, hashPass, id)
    res.status(200).json(pp)
  },

}

module.exports = ProfileController;
