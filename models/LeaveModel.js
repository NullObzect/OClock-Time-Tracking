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

  setLeaveEditData: async (start, end, id) => {
    const query = `UPDATE employee_leaves SET  start = '${start}', end = '${end}' WHERE id =${id}`
    console.log(query)
    const [row] = await dbConnect.promise().execute(query)
    console.log({ row })
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
    console.log(getList)
    const [rows] = await dbConnect.promise().execute(getList)
    return rows;
  },
  leavedaysListBetweenTowDateWithId: async (id, startDate, endDate) => {
    const getList = `SELECT U.id as userID ,U.user_name AS name, U.avatar, EL.id AS id, EL.type_id AS typeId, LT.name as type ,DATE_FORMAT(start,'%Y/%m/%d') AS start, DATE_FORMAT(end, '%Y/%m/%d') AS end, DATEDIFF(end,start) + 1 AS duration FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id JOIN users AS U ON U.id = EL.user_id WHERE EL.user_id = ${id} AND DATE(start) BETWEEN  '${startDate}' AND '${endDate}'`;
    console.log(getList)
    const [rows] = await dbConnect.promise().execute(getList)
    return rows;
  },
  anEmployeeLeaveList: async (id) => {
    const query = `SELECT U.user_name,U.gender,  U.user_role, U.avatar, EL.user_id AS id,EL.id AS elId, EL.type_id AS typeId, LT.name as type , DATE_FORMAT(start,'%Y/%m/%d') AS start, DATE_FORMAT(end, '%Y/%m/%d') AS end, DATEDIFF(end,start) + 1 AS duration  FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id JOIN users AS U ON U.id = EL.user_id WHERE EL.user_id = ${id}`;
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
  leaveTypeFind: async (id) => {
    const leaveTypeFind = 'SELECT `name` FROM `leave_type` where id = ?'
    const value = [id]
    const [rows] = await dbConnect.promise().execute(leaveTypeFind, value)
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
  requestLeaveList: async () => {
    const requestLeaveList = 'SELECT r.id, r.user_id,u.gender ,u.user_name,u.avatar, r.type_id, l.name as typeName ,DATE_FORMAT(r.start, \'%Y/%m/%d\') AS start, DATE_FORMAT(r.end, \'%Y/%m/%d\') AS end, DATEDIFF(r.end, r.start) + 1 AS duration, r.status , r.create_at FROM request_leave as r,leave_type as l,users as u WHERE u.id = r.user_id and l.id = r.type_id'
    const [row] = await dbConnect.promise().execute(requestLeaveList)
    return row
  },
  requestLeaveFind: async (id) => {
    const requestLeaveFind = 'SELECT R.user_id as userId, U.user_name AS userName, U.user_mail AS userMail, R.type_id AS typeId,T.name AS typeName, R.start,R.end, DATE_FORMAT(R.start, \'%Y-%m-%d\') AS start, DATE_FORMAT(R.end, \'%Y-%m-%d\') AS end, DATEDIFF(R.end, R.start) + 1 AS duration FROM request_leave as R JOIN users as U ON R.user_id = U.id JOIN leave_type as T ON R.type_id = T.id WHERE R.id = ?'
    const value = [id]
    const [row] = await dbConnect.promise().execute(requestLeaveFind, value)
    return row
  },
  editLeaveType: async (name, id) => {
    const editLeaveTypeQuery = 'UPDATE leave_type SET name= ? WHERE id = ?'
    const values = [name, id]
    const [rows] = await dbConnect.promise().execute(editLeaveTypeQuery, values)
    return rows
  },
  requestLeaveDelete: async (id) => {
    const requestLeaveDeleteQuery = `DELETE FROM request_leave WHERE id =${id}`
    const [rows] = await dbConnect.promise().execute(requestLeaveDeleteQuery)
    return rows
  },
  checkUserJoinThisYearOrNot: async (userId) => {
    const query = `SELECT  CASE  WHEN DATE_FORMAT(NOW(), '%Y') = DATE_FORMAT(U.create_at, '%Y')  THEN WEEK(U.create_at) ELSE  0  END joinThisYearOrNot FROM users AS U WHERE U.id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  leaveLimitReportJointCurrentYearUser: async (userId) => {
    const query = `SELECT
    LT.name AS leaveName, SUM(DATEDIFF(end, start) + 1) as duration  FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id JOIN users AS U ON U.id = EL.user_id WHERE EL.user_id = ${userId} AND  EL.create_at  BETWEEN  DATE(U.create_at) AND DATE_FORMAT(NOW(),'%Y-12-31') GROUP BY LT.name`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  leaveLimitCountJointCurrentYearUser: async (userId) => {
    const query = `SELECT
     SUM(DATEDIFF(end, start) + 1) as countLeave  FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id JOIN users AS U ON U.id = EL.user_id WHERE EL.user_id = ${userId} AND  EL.create_at  BETWEEN  DATE(U.create_at) AND DATE_FORMAT(NOW(),'%Y-12-31')`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  leaveLimitReport: async (userId) => {
    const query = `SELECT
    LT.name AS leaveName, SUM(DATEDIFF(end, start) + 1) as duration  FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id  JOIN users AS U ON U.id = EL.user_id  WHERE EL.user_id = ${userId} AND  EL.create_at  BETWEEN  DATE_FORMAT(NOW() - interval (DAYOFYEAR(NOW()) -1) DAY, "%Y-%m-%d") AND DATE_FORMAT(NOW(),'%Y-12-31') GROUP BY LT.name`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  leaveLimitCount: async (userId) => {
    const query = `SELECT
    SUM(DATEDIFF(end, start) + 1) as countLeave FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id  JOIN users AS U ON U.id = EL.user_id  WHERE EL.user_id = ${userId} AND  EL.create_at  BETWEEN  DATE_FORMAT(NOW() - interval (DAYOFYEAR(NOW()) -1) DAY, "%Y-%m-%d") AND DATE_FORMAT(NOW(),'%Y-12-31') `
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  countUnpaidLeave: async (userId) => {
    const query = `SELECT
    SUM(DATEDIFF(end, start) + 1) as countUnpaidLeave FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id  JOIN users AS U ON U.id = EL.user_id  WHERE EL.user_id = ${userId} AND  EL.create_at  BETWEEN  DATE_FORMAT(NOW() - interval (DAYOFYEAR(NOW()) -1) DAY, "%Y-%m-%d") AND DATE_FORMAT(NOW(),'%Y-12-31') AND LT.name = 'Unpaid'`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  leaveLimitCountUnpaidLeaveCurrentYearUser: async (userId) => {
    const query = `SELECT
    SUM(DATEDIFF(end, start) + 1) as countUnpaidLeave FROM employee_leaves AS EL JOIN leave_type AS LT ON LT.id = El.type_id  JOIN users AS U ON U.id = EL.user_id  WHERE EL.user_id = ${userId} AND  EL.create_at  BETWEEN DATE(U.create_at) AND DATE_FORMAT(NOW(),'%Y-12-31') AND LT.name = 'Unpaid'`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  sendRequestLeave: async (userId, type, start, end) => {
    const requestLeaveQuery = 'INSERT INTO `request_leave`(`user_id`, `type_id`, `start`, `end`) VALUES (?,?,?,?)'
    const values = [userId, type, start, end]
    const [rows] = await dbConnect.promise().execute(requestLeaveQuery, values)
    return rows
  },
  todayLeaveUser: async () => {
    const totayTotalLeaveUser = 'SELECT COUNT(user_id) AS totalLeaveToDay FROM employee_leaves WHERE DATE(NOW()) = DATE(start)'
    const [rows] = await dbConnect.promise().execute(totayTotalLeaveUser)
    return rows
  },
}

module.exports = LeaveModel;
