const dbConnect = require('../config/database');
const { userId } = require('./ProfileModel');

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
    const leaveListSql = "SELECT L.id AS id, U.user_name AS name, L.reason AS reason, U.user_role, U.avatar, DATE_FORMAT(L.start, '%d %b %Y') AS start, DATE_FORMAT(L.end, '%d %b %Y') AS end, DATEDIFF(L.end, L.start) + 1 AS duration FROM `employee_leaves` AS  L JOIN users AS U ON U.id = L.user_id WHERE DATE(start) BETWEEN DATE(CURRENT_DATE - INTERVAL DAYOFYEAR(CURRENT_DATE)  DAY) AND start"
    const [rows] = await dbConnect.promise().execute(leaveListSql)
    return rows;
  },
  // getLeaveEditData: async (id) => {
  //   const getData = "SELECT L.user_id AS id, U.user_name AS name, L.reason AS reason, DATE_FORMAT(start, '%m/%d/%Y') AS start, DATE_FORMAT(end,'%m/%d/%Y') AS end FROM `employee_leaves` AS L JOIN users AS U ON U.id = L.user_id WHERE L.id = ?"
  //   const value = [id]
  //   const [row] = await dbConnect.promise().execute(getData, value)
  //   return row[0]
  // },
  setLeaveEditData: async (start, end, reason, id) => {
    const query = `UPDATE employee_leaves SET  start = '${start}', end = '${end}', reason = '${reason}' WHERE id =${id}`
    const [row] = await dbConnect.promise().execute(query)
    return row;
  },
  deleteLeaveday: async (id) => {
    const query = `DELETE FROM employee_leaves WHERE id = ${id}`
    const [row] = await dbConnect.promise().execute(query)
    return row.affectedRows;
  },
  leavedaysListBetweenTowDate: async (startDate, endDate) => {
    const getList = `SELECT U.user_name AS name, U.avatar, EL.id AS id, EL.reason AS reason, DATE_FORMAT(start,'%Y/%m/%d') AS start, DATE_FORMAT(end, '%Y/%m/%d') AS end, DATEDIFF(end,start) + 1 AS duration  FROM employee_leaves AS EL JOIN users AS U ON U.id  = EL.user_id  WHERE DATE(start) BETWEEN  '${startDate}' AND '${endDate}'`;
    const [rows] = await dbConnect.promise().execute(getList)
    return rows;
  },
  anEmployeeLeaveList: async (id) => {
    const query = `SELECT U.user_name,  U.user_role, U.avatar, EL.user_id AS id, EL.reason AS reason, DATE_FORMAT(start,'%Y/%m/%d') AS start, DATE_FORMAT(end, '%Y/%m/%d') AS end, DATEDIFF(end,start) + 1 AS duration  FROM employee_leaves AS EL JOIN users AS U ON U.id = EL.user_id WHERE EL.user_id = ${id}`;
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
}

module.exports = LeaveModel;
