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
  getEmployeeLeaveList: async () => {
    const leaveListSql = "SELECT L.id AS id, U.user_name AS name, L.reason AS reason, DATE_FORMAT(L.start, '%d %b %y') AS start, DATE_FORMAT(L.end, '%d %b %y') AS end, DATEDIFF(L.end, L.start) + 1 AS duration FROM `employee_leaves` AS  L JOIN users AS U ON U.id = L.user_id"
    const [rows] = await dbConnect.promise().execute(leaveListSql)
    return rows;
  },
  getLeaveEditData: async (id) => {
    const getData = "SELECT L.user_id AS id, U.user_name AS name, L.reason AS reason, DATE_FORMAT(start, '%m/%d/%Y') AS start, DATE_FORMAT(end,'%m/%d/%Y') AS end FROM `employee_leaves` AS L JOIN users AS U ON U.id = L.user_id WHERE L.id = ?"
    const value = [id]
    const [row] = await dbConnect.promise().execute(getData, value)
    return row[0]
  },
  setLeaveEditData: async (id, userId, start, end, reason, lId) => {
    const setData = 'UPDATE `employee_leaves` SET `id`=?,`user_id`=?,`start`=?,`end`=?,`reason`= ? WHERE id =?'
    const values = [id, userId, start, end, reason, lId];
    const [row] = await dbConnect.promise().execute(setData, values)
    return row.affectedRows;
  },

}

module.exports = LeaveModel;
