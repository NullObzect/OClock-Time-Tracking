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
  //  this month employee leave days
  thisMonthOffdaysInLeavedays: async (userId) => {
    const query = 'SELECT DAYNAME(EL.start) AS stratDayName, DATEDIFF(end,start) + 1 countDays FROM employee_leaves AS EL   WHERE   DATE(EL.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE) AND  EL.user_id = ?'

    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  // this year employee leave days
  thisYearLeaveDays: async (userId) => {
    const query = "SELECT DATE_FORMAT(start, '%Y-%m-%d') AS leaveStartDate, DATEDIFF(end,start) + 1 AS countLeaveDays  FROM `employee_leaves` AS el WHERE DATE(el.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFYEAR(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE) AND user_id  = ?"

    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  // this week leave day
  thisWeekLeavedays: async (saturdayDate, userId) => {
    const query = `SELECT DATE(EL.start) AS stratDate, DATEDIFF(end,start) + 1 countDays FROM employee_leaves AS EL   WHERE   DATE(EL.start) BETWEEN  '${saturdayDate}' AND DATE(NOW()-1) AND  EL.user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  //  this month employee leave days
  thisYearOffdaysInLeavedays: async (userId) => {
    const query = 'SELECT DAYNAME(EL.start) AS stratDayName, DATEDIFF(end,start) + 1 countDays FROM employee_leaves AS EL   WHERE   DATE(EL.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFYEAR(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE) AND  EL.user_id = ?'

    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  // between two dates leave days
  // eslint-disable-next-line no-shadow
  betweenTwoDatesLeavedays: async (startDate, endDate, userId) => {
    const query = 'SELECT DAYNAME(EL.start) AS stratDayName, DATEDIFF(end,start) + 1 countDays FROM employee_leaves AS EL   WHERE   DATE(EL.start) BETWEEN ? AND ? AND  EL.user_id = ?'
    const values = [startDate, endDate, userId]
    const [rows] = await dbConnect.promise().execute(query, values);
    return rows;
  },

}

module.exports = LeaveModel;
