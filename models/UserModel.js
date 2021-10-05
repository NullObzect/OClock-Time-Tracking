const dbConnect = require('../config/database');

const UserModel = {
  registerModel: async (userName, userPhone, userRole, userMail, userPass, avatar) => {
    try {
      const registerQuery = 'INSERT INTO `users`( `user_name`, `user_phone`, `user_role`, `user_mail`, `user_pass`,`avatar`) VALUES (?,?,?,?,?,?)';

      const values = [userName, userPhone, userRole, userMail, userPass, avatar];

      const [rows] = await dbConnect.promise().execute(registerQuery, values);
      return rows;
    } catch (err) {
      return err;
    }
  },
  // show all users list
  getAllUsersList: async () => {
    try {
      const getUsersListQuery = 'SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role, u.avatar  FROM users AS u';

      const [rows] = await dbConnect.promise().execute(getUsersListQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form get users list', err);
      return err;
    }
  },
  // show  users list
  getUsersList: async (user) => {
    try {
      const getUserListQuery = `SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role, u.avatar   FROM users AS u WHERE u.user_role = '${user}'`;
      const [rows] = await dbConnect.promise().execute(getUserListQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form get user list', err);
      return err;
    }
  },
  // show  admin list
  getAdminList: async (admin) => {
    try {
      const getAdminListQuery = `SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role, u.avatar   FROM users AS u WHERE u.user_role = '${admin}'`;
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
      console.log('====>Error form Delete Model', err);
      return err;
    }
  },
  // get a view user
  getViewUser: async (id) => {
    try {
      const userViewQuery = "SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role, u.avatar,  DATE_FORMAT(create_at, '%D %M %Y') AS date FROM users AS u WHERE u.id = ?";
      const value = [id]
      const [row] = await dbConnect.promise().execute(userViewQuery, value)
      return row;
    } catch (err) {
      console.log('====>Error form get view user Model', err);
      return err;
    }
  },
  getSearchUser: async (userName) => {
    try {
      const searchUser = `SELECT u.id,u.user_name,u.user_mail,u.user_phone,u.user_role, u.avatar  FROM users AS u WHERE u.user_name LIKE '%${userName}%'`
      const [rows] = await dbConnect.promise().execute(searchUser)
      return rows
    } catch (err) {
      console.log('====>Error form get search user model', err);
      return err;
    }
  },
  // sort by asecending order
  getUserSortByAscendingOrder: async (userName) => {
    try {
      const ascendingOrderQuery = `SELECT u.id,u.user_name,u.user_phone, u.user_role, u.user_mail, u.avatar  FROM users  AS u ORDER BY ${userName} ASC`;
      const [rows] = await dbConnect.promise().execute(ascendingOrderQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form getUserSortByAscendingOrder Model', err);
      return err;
    }
  },

  // sort by asecending order
  getUserSortByDescendingOrder: async (userName) => {
    try {
      const descendingOrderQuery = `SELECT u.id,u.user_name,u.user_phone, u.user_role, u.user_mail, u.avatar  FROM users  AS u ORDER BY ${userName} DESC`;
      const [rows] = await dbConnect.promise().execute(descendingOrderQuery)
      return rows;
    } catch (err) {
      console.log('====>Error form getUserSortByDescendingOrder Model', err);
      return err;
    }
  },
  findUserByEmail: async (email) => {
    try {
      const findUserQuery = 'SELECT * FROM `users` WHERE user_mail = ?'
      const value = [email]
      const [rows] = await dbConnect.promise().execute(findUserQuery, value)
      return rows;
    } catch (err) {
      console.log(err)
      return err;
    }
  },
  UpdatePassword: async (email, password) => {
    const UpdatePasswordQuery = 'UPDATE `users` SET user_pass = ? WHERE user_mail = ?'
    const value = [password, email]
    const [row] = await dbConnect.promise().execute(UpdatePasswordQuery, value)
    return row
  },
}
module.exports = UserModel;
