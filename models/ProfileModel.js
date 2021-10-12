const dbConnect = require('../config/database');

const ProfileModel = {

  userConnectionDetailsUniqueInfo: async (uniqueInfo) => {
    const sql = 'SELECT ucd.id, ucd.user_id, ucd.platform, ucd.unique_info, ucd.user_name, ucd.user_avatar, u.status FROM users_connection_details AS ucd JOIN users AS u ON u.id = ucd.user_id WHERE user_id = ?'
    const value = [uniqueInfo]
    const [rows] = await dbConnect.promise().execute(sql, value)
    return rows;
  },
}

module.exports = ProfileModel;
