
const dbConnect = require('../config/database');

const ProfileModel = {

  userConnectionDetailsUniqueInfo: async (uniqueInfo) => {
    const sql = 'SELECT * FROM users_connection_details WHERE unique_info = ?'
    const value = [uniqueInfo]
    const [rows] = await dbConnect.promise().execute(sql, value)
    return rows;
  },
}

module.exports = ProfileModel;
