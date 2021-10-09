const dbConnect = require('../config/database');

const FbUserModels = {
  addFacebookUser: async (name, phone, role, email, pass, picture) => {
    try {
      const registerQuery = 'INSERT INTO `users`(`user_name`, `user_phone`, user_role, user_mail, user_pass, avatar) VALUES (?,?,?,?,?,?)';

      const values = [name, phone, role, email, pass, picture];

      const [rows] = await dbConnect.promise().execute(registerQuery, values);
      return rows;
    } catch (err) {
      console.log('Error form add Facebook User Controller', err);
      return err;
    }
  },
  facebookUserUniqueId: async (id) => {
    try {
      const getId = 'SELECT * FROM `users` WHERE user_mail = ?';
      const value = [id];
      const [row] = await dbConnect.promise().execute(getId, value);
      return row;
    } catch (err) {
      console.log('====>Error form fbId Model', err);
      return err;
    }
  },
  userId: async (id) => {
    try {
      const getId = 'SELECT * FROM `facebook_users` WHERE id = ?';
      const value = [id];
      const [row] = await dbConnect.promise().execute(getId, value);
      return row;
    } catch (err) {
      console.log('====>Error form UserId Model', err);
      return err;
    }
  },
  // add user details
  addUserConnectionDetails: async (primaryKey, platform, uniqueInfo, userName, picture) => {
    try {
      const inserSQL = 'INSERT INTO `users_connection_details`(`user_id`, `platform`, `unique_info`, `user_name`, `user_avatar`) VALUES (?,?,?,?,?)';
      const values = [primaryKey, platform, uniqueInfo, userName, picture]
      const [rows] = await dbConnect.promise().execute(inserSQL, values);
      return rows;
    } catch (err) {
      console.log('====>Error form addUserConnectionDetails Model', err);
      return err;
    }
  },
  //
  getFacebookUserUniqueInfoFromUserConnection: async (uniqueInfo) => {
    const sql = 'SELECT user_id FROM users_connection_details WHERE unique_info = ?'
    const value = [uniqueInfo]
    const [rows] = await dbConnect.promise().execute(sql, value)
    return rows;
  },
  // delete facebook user
  facebookPlatformRemove: async (id) => {
    const sql = 'DELETE FROM `users_connection_details` WHERE platform = "facebook" AND user_id = ?'
    const value = [id]
    const [rows] = await dbConnect.promise().execute(sql, value)
    return rows
  },

};

module.exports = FbUserModels;
