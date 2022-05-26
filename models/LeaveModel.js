const dbConnect = require('../config/database');

const LeaveModel = {
  addLeaveday: async (userId, typeId, start, end) => {
    const addLeavedaySql = 'INSERT INTO employee_leaves (user_id,type_id, start, end) VALUES(?,?,?,?)'
    const values = [userId, typeId, start, end];
    console.log(addLeavedaySql, values)
    const [rows] = await dbConnect.promise().execute(addLeavedaySql, values);
    return rows;
  },
  selectEmployee: async () => {
    const selectEmployeeSql = "SELECT u.id, u.user_name, u.avatar  FROM `users` AS u WHERE user_role = 'user'"
    const [rows] = await dbConnect.promise().execute(selectEmployeeSql)
    return rows;
  },
  getEmployeeLeaveList: async () => {
    const leaveListSql = "SELECT L.id AS id, U.user_name AS name, L.type_id AS typeId, LT.name as type, U.user_role, U.avatar, DATE_FORMAT(L.start, '%Y/%m/%d') AS start, DATE_FORMAT(L.end, '%Y/%m/%d') AS end, DATEDIFF(L.end, L.start) + 1 AS duration FROM `employee_leaves` AS L JOIN leave_type AS LT ON LT.id = L.type_id JOIN users AS U ON U.id = L.user_id WHERE DATE(start) BETWEEN DATE(CURRENT_DATE - INTERVAL DAYOFYEAR(CURRENT_DATE) DAY) AND start"
    const [rows] = await dbConnect.promise().execute(leaveListSql)
    return rows;
  },

  setLeaveEditData: async (start, end, typeId, id) => {
    const query = `UPDATE employee_leaves SET  start = '${start}', end = '${end}', type_id = '${typeId}' WHERE id =${id}`
    const [row] = await dbConnect.promise().execute(query)
    return row;
  },
  deleteLeaveday: async (id) => {
    const query = `DELETE FROM employee_leaves WHERE id = ${id}`
    const [row] = await dbConnect.promise().execute(query)
    return row.affectedRows;
  },
  leavedaysListBetweenTowDate: async (startDate, endDate) => {
    const getList = `SELECT U.user_name AS name, U.avatar, EL.id AS id, EL.type_id AS typeId, LT.name as type ,DATE_FORMAT(start,'%Y/%m/%d') AS start, DATE_FORMAT(end, '%Y/%m/%d') AS end, DATEDIFF(end,start) + 1 AS duration  FROM employee_leaves AS EL
    JOIN leave_type AS LT ON LT.id = El.type_id
    JOIN users AS U ON U.id  = EL.user_id  WHERE DATE(start) BETWEEN  '${startDate}' AND '${endDate}'`;
    const [rows] = await dbConnect.promise().execute(getList)
    return rows;
  },
  anEmployeeLeaveList: async (id) => {
    const query = `SELECT U.user_name,  U.user_role, U.avatar, EL.user_id AS id, EL.type_id AS typeId, LT.name as type , DATE_FORMAT(start,'%Y/%m/%d') AS start, DATE_FORMAT(end, '%Y/%m/%d') AS end, DATEDIFF(end,start) + 1 AS duration  FROM employee_leaves AS EL
    JOIN leave_type AS LT ON LT.id = El.type_id JOIN users AS U ON U.id = EL.user_id WHERE EL.user_id = ${id}`;
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  addLeaveType: async (name, duration) => {
    const addLeaveTypeQuery = 'INSERT INTO `leave_type`(`name`, `duration`) VALUES (?,?)'
    const values = [name, duration]
    const [rows] = await dbConnect.promise().execute(addLeaveTypeQuery, values)
    return rows;
  },
  leaveTypeList: async () => {
    const leaveTypeList = 'SELECT `id`, `name` FROM `leave_type`'
    const [rows] = await dbConnect.promise().execute(leaveTypeList)
    return rows;
  },
  // Query below for leave report
  getLeaveLimit: async () => {
    const query = "SELECT option_value AS leaveLimit FROM `options` WHERE option_title = 'leave-limit'"
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  getLeaveTypeNameAndDuration: async (userId) => {
    const query = `SELECT LT.name AS leaveName, DATEDIFF(end, start) + 1 as duration
    FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id 
   JOIN users AS U ON U.id = EL.user_id 
   WHERE EL.user_id = ${userId} AND U.create_at > now() - INTERVAL 365 DAY`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  countTotalLeave: async (userId) => {
    const query = `SELECT SUM(DATEDIFF(end, start) + 1) as totalLeave
    FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id 
    JOIN users AS U ON U.id = EL.user_id 
    WHERE EL.user_id = ${userId} AND U.create_at > now() - INTERVAL 365 DAY`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
}

module.exports = LeaveModel;
