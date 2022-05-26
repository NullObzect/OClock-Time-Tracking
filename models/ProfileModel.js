const dbConnect = require('../config/database');

const ProfileModel = {

  userConnectionDetailsUniqueInfo: async (uniqueInfo) => {
    const sql = 'SELECT ucd.id, ucd.user_id, ucd.platform, ucd.unique_info, ucd.user_name, ucd.user_avatar FROM users_connection_details AS ucd  WHERE user_id = ?'
    const value = [uniqueInfo]
    const [rows] = await dbConnect.promise().execute(sql, value)
    return rows;
  },
  userId: async (id) => {
    try {
      const getId = 'SELECT * FROM `users_connection_details` WHERE id = ?';
      const value = [id];
      const [row] = await dbConnect.promise().execute(getId, value);
      return row;
    } catch (err) {
      console.log('====>Error form UserId Model', err);
      return err;
    }
  },
  setProfile: async (avatarUrl, mail) => {
    try {
      const sql = 'UPDATE users SET avatar = ?  WHERE user_mail = ?';
      const values = [avatarUrl, mail]
      const [rows] = await dbConnect.promise().execute(sql, values)
      return rows;
    } catch (err) {
      console.log('====>Error form ProfileController/setProfile', err);
      return err;
    }
  },
  updateProfile: async (avatar, fingerId, name, gender, phone, password, id) => {
    try {
      const updateProfileSql = `UPDATE users SET ${name ? ` user_name = '${name}'` : ''}  ${gender ? `, gender = '${gender}'` : ''} ${fingerId ? `, finger_id = '${fingerId}'` : ''} ${avatar ? `, avatar = '${avatar}'` : ''} ${password ? `, user_pass = '${password}'` : ''} ${phone ? `, user_phone = '${phone}'` : ''}  WHERE id = ${id}`
      const [row] = await dbConnect.promise().execute(updateProfileSql);
      return row;
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = ProfileModel;
