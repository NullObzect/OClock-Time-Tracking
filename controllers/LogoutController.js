const LogoutController = {
  // Clear cookies & session when user logout
  logout: async (req, res) => {
    try {
      req.session.destroy();
      res.clearCookie(process.env.COOKIE_NAME)
      // res.clearCookie('connect.sid', { path: '/' }.)
      // res.clearCookie('connect.sid')
      // req.flash('success','Logout Success')
      res.redirect('/')
    } catch (err) {
      console.log('=====> Error form LogoutController', err);
    }
  },
}
module.exports = LogoutController
