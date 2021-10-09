/* eslint-disable no-redeclare */
/* eslint-disable no-else-return */
/* eslint-disable no-shadow */
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_PASSPORT_CLIENT_ID,
    clientSecret: process.env.GOOGLE_PASSPORT_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_PASSPORT_CALLBACK_URL,

  },
  (async (accessToken, refreshToken, profile, cb) => {
  // const people = userModel.findUser()
  // console.log("***Name***",profile.displayName)
  // console.log("***Email***",profile.emails[0].value)
  // console.log("***photo***",profile.photos[0].value)

    const userName = profile.displayName
    const userMail = profile.emails[0].value
    const userPic = profile.photos[0].value
    const userPass = ''
    const googleId = profile.id
    const people = {
      userName, userMail, userPass, userPic, googleId,
    }
    cb(null, people);
  }
  )));

  passport.serializeUser((user, done) => {
    done(null, user);
  })

  passport.deserializeUser(async (user, done) => {
    done(null, user);
  })
}
