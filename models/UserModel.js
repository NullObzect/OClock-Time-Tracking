const dbConnect = require('../config/database');

const UserModel = {
  addUser: async (userName, gender, userPhone, userMail, avatar) => {
    try {
      const addUserQuery = 'INSERT INTO `users`( `user_name`,`gender`, `user_phone`, `user_mail`,`avatar`) VALUES (?,?,?,?,?)';

      const values = [userName, gender, userPhone, userMail, avatar];

      const [rows] = await dbConnect.promise().execute(addUserQuery, values);
      return rows;
    } catch (err) {
      return err;
    }
  },
  // show all users list
  getAllUsersList: async () => {
    try {
      const getUsersListQuery = 'SELECT u.id,u.user_name,u.gender,u.user_mail,u.user_phone,u.user_role, u.avatar, u.status  FROM users AS u';

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
  userVerify: async (id) => {
    const setStatusQuery = ' UPDATE `users` SET status = 1 WHERE id= ? '
    const value = [id]
    const [row] = await dbConnect.promise().execute(setStatusQuery, value)
    return row;
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
      const findUserQuery = 'SELECT id,finger_id,user_name,gender,user_phone,user_mail,user_role,user_pass,avatar,status,DATE_FORMAT(create_at,\'%d-%M-%Y\') AS create_at FROM `users` WHERE user_mail = ?'
      const value = [email]
      const [rows] = await dbConnect.promise().execute(findUserQuery, value)
      return rows;
    } catch (err) {
      console.log(err)
      return err;
    }
  },
  searchUser: async (email) => {
    const searchForgotUserSql = 'SELECT id,user_mail, status FROM `users` WHERE user_mail = ? and status = 1'
    const value = [email]
    const [rows] = await dbConnect.promise().execute(searchForgotUserSql, value)
    return rows;
  },
  searchInactiveUser: async (email) => {
    const searchForgotUserSql = 'SELECT id,user_mail, status FROM `users` WHERE user_mail = ? and status = 2'
    const value = [email]
    const [rows] = await dbConnect.promise().execute(searchForgotUserSql, value)
    return rows;
  },
  findId: async (id) => {
    const insertSQL = 'SELECT * FROM `users` WHERE id = ?'
    const value = [id]
    const [row] = await dbConnect.promise().execute(insertSQL, value)
    return row
  },
  UpdatePassword: async (email, password) => {
    const UpdatePasswordQuery = 'UPDATE `users` SET user_pass = ? WHERE user_mail = ?'
    const value = [password, email]
    const [row] = await dbConnect.promise().execute(UpdatePasswordQuery, value)
    return row
  },

  // update user info
  getUpdateUserInfo: async (id) => {
    const getUser = 'SELECT `id`,finger_id, `user_name`,gender, `user_phone`, `user_role`, `user_mail`, `user_pass`, `avatar`, `status`, DATE_FORMAT(create_at, \'%Y-%m-%d\') as create_at FROM `users` WHERE id = ?'
    const value = [id]
    const [rows] = await dbConnect.promise().execute(getUser, value)
    return rows;
  },
  updateAvatar: async (avatar, id) => {
    const updateAvatarSql = 'UPDATE `users` SET avatar = ? WHERE id = ?'
    const values = [avatar, id]
    const [rows] = await dbConnect.promise().execute(updateAvatarSql, values)
    return rows;
  },
  getUserEditInfo: async (uId, name, number, email, id) => {
    const getEdit = 'UPDATE `users` SET `id`= ?,`user_name`= ?, `user_phone`= ?  user_mail = ? WHERE id =?'
    const values = [uId, name, number, email, id]
    const [rows] = await dbConnect.promise().execute(getEdit, values)
    return rows.affectedRows;
  },
  adminCanUpdateUser: async (id, userMail) => {
    const updateSql = 'UPDATE `users` SET `user_mail`= ?,`status`= 2  WHERE id = ?'
    const values = [userMail, id]
    const [rows] = await dbConnect.promise().execute(updateSql, values)
    console.log(rows)
    return rows
  },
  userJoinDateChange: async (id, fingerId, joinDate) => {
    const updateSql = 'UPDATE `users` SET create_at= ? , finger_id =? WHERE id = ?'
    const values = [joinDate, fingerId, id]
    const [rows] = await dbConnect.promise().execute(updateSql, values)
    console.log(rows)
    return rows
  },
  userSearch: async (name) => {
    const userSearchQuery = `SELECT id, user_name,gender, user_mail, avatar FROM users WHERE  user_name LIKE '${name}%' or user_mail LIKE '${name}'`
    console.log('query', userSearchQuery)
    const [rows] = await dbConnect.promise().execute(userSearchQuery)
    return rows
  },
  userFindByFingerId: async (id) => {
    const findFingerId = `SELECT id,finger_id, user_name,gender user_mail, avatar FROM users WHERE  finger_id LIKE '%${id}%'`
    console.log(findFingerId)
    const [rows] = await dbConnect.promise().execute(findFingerId)
    return rows
  },

}
module.exports = UserModel;
