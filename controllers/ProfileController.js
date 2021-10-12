const jwt = require('jsonwebtoken')
const ProfileModel = require('../models/ProfileModel')

const ProfileController = {

  userProfile: async (req, res) => {
    try {
      const token = req.signedCookies.Oclock;
      console.log({ token });
      const verifyPlatformUser = jwt.verify(token, process.env.JWT_SECRET)
      const { userObject } = verifyPlatformUser
      const { userMailFormDB } = userObject
      console.log({ userMailFormDB });

      const [platformUser] = await ProfileModel.userConnectionDetailsUniqueInfo(userMailFormDB)
      console.log({ platformUser });

      res.render('pages/userProfile', { platformUser })
    } catch (err) {
      console.log('====>Error form userProfile Controller', err);
    }
  },
}

module.exports = ProfileController;
