const dbConnect = require('../config/database')

const userPlatformModel = {
  googlePlatformSet: async (id, platform, uniqueId, name, avatar) => {
    const userConnectionQuery = 'INSERT INTO users_connection_details ( user_id, user_platform, user_unique_id,user_username,user_avatar) VALUES (?,?,?,?,?)'
    const value = [id, platform, uniqueId, name, avatar]
    const [rows] = await dbConnect.promise().execute(userConnectionQuery, value)
    return rows
  },
  googlePlatformRemove: async (id) => {
    const userConDeleteQuery = 'DELETE FROM `users_connection_details` WHERE user_platform = "google" AND user_id = ?'
    const value = [id]
    const [rows] = await dbConnect.promise().execute(userConDeleteQuery, value)
    return rows
  },
  getUserPlatformDetails: async (userId) => {
    const userPlatformDetailsQuery = 'SELECT * FROM `users_connection_details` WHERE user_id = ?'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(userPlatformDetailsQuery, value)
    return rows
  },
  getGoogleUserByMail: async (mail) => {
    const sql = 'SELECT user_id FROM `users_connection_details` WHERE user_unique_id = ?'
    const value = [mail]
    const [rows] = await dbConnect.promise().execute(sql, value)
    return rows
  },
  googleUserUpdate: async (userName, pic, id) => {
    const updateUserSql = 'UPDATE `users_connection_details` SET user_username=?,user_avatar = ? WHERE   user_unique_id =? AND user_platform = "google"'
    const value = [userName, pic, id]
    const [rows] = await dbConnect.promise().execute(updateUserSql, value)
    return rows
  },

}

module.exports = userPlatformModel