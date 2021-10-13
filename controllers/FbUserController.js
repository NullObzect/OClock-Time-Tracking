/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');

const maxAge = 5 * 24 * 60 * 60 * 1000;
const FbUserModel = require('../models/FbUserModel');
const UserModel = require('../models/UserModel');

const FbUserController = {

  profile: async (req, res) => {
    try {
      console.log('req.user', req.user);
      // res.redirect('/profile')

      const { id } = req.user
      const userName = req.user.displayName
      // let fbUserMail = req.user.emails[0].value
      // let fbUserMail = 'xyz@gmail.com';
      const picture = req.user.photos[0].value
      // if (fbUserMail === null) {
      //   fbUserMail = id;
      // }

      const token = req.signedCookies.Oclock;
      console.log({ token });

      if (token) {
        const isVerify = jwt.verify(token, process.env.JWT_SECRET)
        const { userObject } = isVerify;
        console.log({ userObject });

        //
        const email = userObject.userMailFormDB

        if (isVerify) {
          const platform = 'facebook';
          const [user] = await FbUserModel.facebookUserUniqueId(email)
          if (user) {
            await FbUserModel.addUserConnectionDetails(
              user.id, platform, id, userName, picture,
            )
          }
          res.redirect('/')
        }
      } else if (!token) {
        const [verify] = await FbUserModel.getFacebookUserUniqueInfoFromUserConnection(id);
        console.log('verify', verify);

        if (verify) {
          const { user_id } = verify;

          const [user] = await UserModel.findId(user_id)
          await FbUserModel.facebookUserUpdate(userName, picture, id)

          console.log({ user });

          if (user) {
            const userMailFormDB = user.user_mail;

            const userName = user.user_name;
            const userRole = user.user_role;
            const userObject = {
              userName, userMailFormDB, userRole,
            }
            console.log(userObject);

            const tokenTwo = jwt.sign({
              userObject,
            }, process.env.JWT_SECRET, { expiresIn: maxAge })
            res.cookie(process.env.COOKIE_NAME, tokenTwo, { maxAge, httpOnly: true, signed: true });
            res.redirect('/profile')
          } else {
            res.redirect('/')
          }
        } else {
          res.redirect('/')
        }
      } else {
        res.redirect('/')
      }
    } catch (err) {
      console.log('====>Error form Profile Controller', err);
    }
  },
  error: async (req, res) => {
    res.send('error')
  },
  // remove facebook user
  facebookUserDelete: async (req, res) => {
    try {
      const token = req.signedCookies.Oclock;
      console.log({ token });
      const verifyPlatformUser = jwt.verify(token, process.env.JWT_SECRET)
      const { userObject } = verifyPlatformUser
      const { userMailFormDB } = userObject
      console.log({ userMailFormDB });
      const [user] = await UserModel.findUserByEmail(userMailFormDB)
      await FbUserModel.facebookPlatformRemove(user.id)
      res.redirect('/profile')
    } catch (err) {
      console.log('====>Error form FbUserController/ facebbookUserDelete', err);
    }
  },

}
module.exports = FbUserController
