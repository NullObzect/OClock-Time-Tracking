const dbConnect = require('../config/database');

const LoginModel = {
  getUserMail: async (userMail) => {
    try {
      const getUserByMailQuery = 'SELECT * FROM users WHERE user_mail = ?'

      const value = [userMail]
      const [row] = await dbConnect.promise().execute(getUserByMailQuery, value)
      console.log(row)
      return row;
    } catch (err) {
      return err;
    }
  },
};

module.exports = LoginModel;
