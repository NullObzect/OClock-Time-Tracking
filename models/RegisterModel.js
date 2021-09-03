const RegisterModel = require('./RegisterModel');

const RegisterController = {
  // render page
  register: (req, res) => {
    res.render('pages/register');
  },
  // insert user
  registerController: async (req, res) => {
    console.log('user', req.body);
    const {
      userName, userPhone, userRole, userMail, userPass,
    } = req.body;

    try {
      const insertedData = await RegisterModel.registerModel(
        userName,
        userPhone,
        userRole,
        userMail,
        userPass,
      );
      if (insertedData.errno) {
        res.send('ERROR');
      } else {
        res.send('SUCCESS');
      }
    } catch (err) {
      console.log('Error form RegisterController', err);
      return err;
    }
  },
};

module.exports = RegisterController;
