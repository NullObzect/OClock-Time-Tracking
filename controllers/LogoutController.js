const LogoutController = {
  // Clear cookies & session when user logout
  logout: async (req, res) => {
    try {
      req.session.message = {
        message: 'logout successfully',
      }
      res.clearCookie(process.env.COOKIE_NAME)
      res.clearCookie('connect.sid')
      // req.session.destroy();

      res.redirect('/')
    } catch (err) {
      console.log('=====> Error form LogoutController', err);
    }
  },
}
module.exports = LogoutController
