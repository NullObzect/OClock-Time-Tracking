const { validationResult } = require('express-validator');

const LoginController = {
  getLogin: (req, res) => {
    res.render('pages/login')
  },
  loginController: async (req, res) => {
    console.log('====> login data', req.body);
    const { userMail, userPass } = req.body;

    const errors = validationResult(req).formatWith((error) => error.msg)
    if (!errors.isEmpty()) {
      return res.render('pages/login', { error: errors.mapped(), value: { userMail, userPass } })
    }
    try {

    } catch (err) {
      console.log('====> Error form loginController', err);
      return err;
    }
  },

}

module.exports = LoginController
