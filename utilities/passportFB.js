const FacebookStrategy = require('passport-facebook').Strategy

const clientId = process.env.FACEBOOK_CLIENT_ID
const clientSecrets = process.env.FACEBOOK_CLIENT_SECRET
const callbackUrl = `${process.env.BASE_URL}${process.env.FACEBOOK_REDIRECT_LINK}`

module.exports = function (passport) {
  passport.use(new FacebookStrategy({
    clientID: clientId === '' ? true : clientId,
    clientSecret: clientSecrets === '' ? null : clientSecrets,
    callbackURL: callbackUrl === '' ? null : callbackUrl,
    enableProof: true,
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
  },
  // facebook will send back the token and profile
  (async (req, token, refreshToken, profile, cb) => {
    cb(null, profile)
  }
  )));

  // used to serialze user
  passport.serializeUser((user, cb) => cb(null, user));

  // used to deserialize the user
  passport.deserializeUser((user, cb) => cb(null, user));
}
