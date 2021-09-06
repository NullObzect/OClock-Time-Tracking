const dbConnect = require('../config/database');

const RegisterModel = {
  registerModel: async (userName, userPhone, userRole, userMail, userPass) => {
    try {
      const registerQuery = 'INSERT INTO `users`( `user_name`, `user_phone`, `user_roll`, `user_mail`, `user_pass`) VALUES (?,?,?,?,?)';

      const values = [userName, userPhone, userRole, userMail, userPass];

      const [rows] = await dbConnect.promise().execute(registerQuery, values);
      return rows;
    } catch (err) {
      console.log('error fomr RegisterModel', err);
      return err;
    }
  },
};

module.exports = RegisterModel;
