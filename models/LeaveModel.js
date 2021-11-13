const dbConnect = require('../config/database')

const LeaveModel = {
  addLeaveday: async (userId, start, end, reason) => {
    const addLeavedaySql = 'INSERT INTO employee_leaves (user_id, start, end, reason) VALUES(?,?,?,?)'
    const values = [userId, start, end, reason];
    const [rows] = await dbConnect.promise().execute(addLeavedaySql, values);
    return rows;
  },
  selectEmployee: async () => {
    const selectEmployeeSql = "SELECT u.id, u.user_name, u.avatar  FROM `users` AS u WHERE user_role = 'user'"
    const [rows] = await dbConnect.promise().execute(selectEmployeeSql)
    return rows;
  },

}

module.exports = LeaveModel;
