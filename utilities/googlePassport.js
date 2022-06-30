/* eslint-disable max-len */
/* eslint-disable no-redeclare */
/* eslint-disable no-else-return */
/* eslint-disable no-shadow */
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

const clientId = process.env.GOOGLE_PASSPORT_CLIENT_ID
const clientSecret = process.env.GOOGLE_PASSPORT_CLIENT_SECRET
const callbackURL = process.env.GOOGLE_PASSPORT_CALLBACK_URL

console.log('click', clientId);
module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: clientId === '' ? true : clientId,
    clientSecret: clientSecret === '' ? null : clientSecret,
    callbackURL: callbackURL === '' ? null : callbackURL,

  },
  (async (accessToken, refreshToken, profile, cb) => {
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
