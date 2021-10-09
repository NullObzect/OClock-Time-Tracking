const FacebookStrategy = require('passport-facebook').Strategy

module.exports = function (passport) {
  passport.use(new FacebookStrategy({
    clientID: '282891463362753',
    clientSecret: '77fb02c0316024aac8c4a66fff569cd0',
    callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
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
