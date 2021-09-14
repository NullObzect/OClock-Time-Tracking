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
  // show all users list
  getAllUsersList: async () => {
    try {
      const getUsersListQuery = 'SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role  FROM users AS u';

      const [rows] = await dbConnect.promise().execute(getUsersListQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form get users list', err);
      return err;
    }
  },
  // show  users list
  getUsersList: async () => {
    try {
      const getUserListQuery = "SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role  FROM users AS u WHERE u.user_role = 'user' ";
      const [rows] = await dbConnect.promise().execute(getUserListQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form get user list', err);
      return err;
    }
  },
  // show  admin list
  getAdminList: async () => {
    try {
      const getAdminListQuery = "SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role  FROM users AS u WHERE u.user_role = 'admin'";
      const [rows] = await dbConnect.promise().execute(getAdminListQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form get user list', err);
      return err;
    }
  },
  // get a delete user
  getDeleteUser: async (id) => {
    try {
      const userDeleteQuery = 'DELETE FROM `users` WHERE id = ?';
      const value = [id]
      const [row] = await dbConnect.promise().execute(userDeleteQuery, value);
      return row.affectedRows;
    } catch (err) {
      console.log('====>Error form', err);
      return err;
    }
  },

}
module.exports = UserModel;
