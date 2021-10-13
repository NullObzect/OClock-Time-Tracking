const jwt = require('jsonwebtoken')
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
        id, user_name, user_phone, status, avatar,
      } = findIdFormUser
      // console.log({ status, avatar })

      const platformUser = await ProfileModel.userConnectionDetailsUniqueInfo(id)
      // console.log({ platformUser });

      res.render('pages/userProfile', {
        platformUser, user_name, user_phone, status, avatar,
      })
    } catch (err) {
      console.log('====>Error form userProfile Controller', err);
    }
  },

  // change facebook profile
  changeProfile: async (req, res) => {
    try {
      console.log(req.url);
      const token = req.signedCookies.Oclock;
      const { userMailFormDB } = cookieVerifier(token)

      const { id } = req.params;
      console.log(id);
      const [platformUser] = await ProfileModel.userId(id)
      const { user_avatar } = platformUser

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

}

module.exports = ProfileController;
