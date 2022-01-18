const dbConnect = require('../config/database')

const OptionsModel = {
  options: async () => {
    const optionsSql = 'SELECT * FROM `options`'
    const [rows] = await dbConnect.promise().execute(optionsSql)
    return rows
  },
  getProjects: async () => {
    const getProjectSql = 'SELECT * FROM `projects`'
    const [rows] = await dbConnect.promise().execute(getProjectSql)
    return rows
  },
  createProject: async (projectName, projectDetails) => {
    const insertProjectSql = 'INSERT INTO `projects`(`project_name`, `project_details`) VALUES (?,?)'
    const values = [projectName, projectDetails]
    const [rows] = await dbConnect.promise().execute(insertProjectSql, values)
    return rows
  },
  sendNotice: async (userId, noticeDetails) => {
    const sendNoticeSql = 'INSERT INTO `notice`(`user_id`, `notice_details`) VALUES (?,?)'
    const values = [userId, noticeDetails]
    const [rows] = await dbConnect.promise().execute(sendNoticeSql, values)
    return rows
  },
  getAllNotice: async () => {
    const getAllNoticeSql = 'SELECT user_id as user , date_format(create_at,"%d %b %y") as date,time_format(create_at,"%h:%i% %p")as time, notice_details as details FROM `notice`;'
    const [rows] = await dbConnect.promise().execute(getAllNoticeSql)
    return rows
  },
  userNotice: async (id) => {
    const userNoticeSql = 'SELECT sender_id, date_format(create_at,"%d %b %y") as date,time_format(create_at,"%h:%i% %p")as time, notice_details as details FROM `notice` WHERE notice_type = "all" or user_id = ? or sender_id = ?'
    const [rows] = await dbConnect.promise().execute(userNoticeSql, [id, id])
    return rows
  },
  contactAdmin: async (userId, senderId, noticeDetails) => {
    const contactAdminSql = 'INSERT INTO `notice`(`notice_type`,`sender_id`, `notice_details`) VALUES (?,?,?)'
    const values = [userId, senderId, noticeDetails]
    const [rows] = await dbConnect.promise().execute(contactAdminSql, values)
    return rows
  },

}

module.exports = OptionsModel
