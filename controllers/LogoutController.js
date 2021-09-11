const LogoutController = {
  logout: async (req, res) => {
    try {
      res.clearCookie(process.env.COOKIE_NAME)
      res.redirect('/')
    } catch (err) {
      console.log('=====> Error form LogoutController', err);
    }
  },
}
module.exports = LogoutController
