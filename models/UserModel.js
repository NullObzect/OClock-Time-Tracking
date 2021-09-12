const dbConnect = require('../config/database');

const UserModel = {
  registerModel: async (userName, userPhone, userRole, userMail, userPass) => {
    try {
      const registerQuery = 'INSERT INTO `users`( `user_name`, `user_phone`, `user_role`, `user_mail`, `user_pass`) VALUES (?,?,?,?,?)';

      const values = [userName, userPhone, userRole, userMail, userPass];

      const [rows] = await dbConnect.promise().execute(registerQuery, values);
      return rows;
    } catch (err) {
      return err;
    }
  },
};

module.exports = UserModel;
