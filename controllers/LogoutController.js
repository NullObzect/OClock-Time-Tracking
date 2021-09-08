const LogoutController = {
  logout: async (req, res) => {
    try {
      res.cookie('jwt', '', { maxAge: 1 })
      res.redirect('/')
    } catch (err) {
      console.log('=====> Error form LogoutController', err);
      return err;
    }
  },
}
module.exports = LogoutController
