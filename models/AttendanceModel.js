/* eslint-disable no-tabs */
const dbConnect = require('../config/database');

const AttendanceModel = {
  todayStartTime: async (id) => {
    const getStartSql = 'SELECT  Time_format(MIN(Time(start)),"%h:%i% %p") as start FROM attendance  WHERE user_id = ? and Date(start) = Date(CURRENT_DATE);'
    const [rows] = await dbConnect.promise().execute(getStartSql, [id]);
    console.log('start modal', rows)
    return rows;
  },

  todayEndTime: async (id) => {
    const getEndSql = 'SELECT Time_format(MAX(Time(end)),"%h:%i% %p") as end FROM attendance WHERE user_id = ? and Date(start)= Date(CURRENT_DATE)';
    const [rows] = await dbConnect.promise().execute(getEndSql, [id]);
    return rows;
  },
  currentStartTime: async () => {
    const getEndSql = 'SELECT Time_format(CURRENT_TIME,"%h:%i% %p") as end;';
    const [rows] = await dbConnect.promise().execute(getEndSql);
    return rows;
  },
  currentEndTime: async () => {
    const getEndSql = 'SELECT Time_format(CURRENT_TIME,"%h:%i% %p") as end;';
    const [rows] = await dbConnect.promise().execute(getEndSql);
    return rows;
  },
  workDetails: async () => {
    const getWorkDetailsSql = ''
    const [rows] = await dbConnect.promise().execute(getWorkDetailsSql);
    return rows;
  },

  getInTime: async () => {
    const query = "SELECT option_value AS inTime FROM `options`  WHERE  option_title = 'in-time'"
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  getOutTime: async () => {
    const query = "SELECT option_value AS outTime FROM `options`  WHERE  option_title = 'out-time'"
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

  getCurrentDateUserIdInAttendance: async (id) => {
    const query = `SELECT user_id as isUserId FROM attendance WHERE DATE(create_at) = DATE(CURRENT_DATE) AND user_id = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },

  getCurrentDateUserId: async (id) => {
    const query = `SELECT user_id as isUserId FROM log WHERE DATE(start) = DATE(CURRENT_DATE) AND user_id = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },
  isExistCurrentDateUserId: async (date, id) => {
    const query = `SELECT user_id AS isExist FROM log WHERE DATE(start) = DATE('${date}') AND user_id  = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  isExistCurrentDateUserIdForManualInput: async (date, id) => {
    const query = `SELECT user_id AS isExist FROM log WHERE DATE(start) = DATE('${date}') AND user_id  = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },

  setAttendanceStart: async (id, inTime, outTime, projectId, workDetails) => {
    try {
      const query = 'INSERT INTO attendance(user_id, in_time, out_time,project_id, work_details) VALUES (?,?,?,?,?)'
      const values = [id, inTime, outTime, projectId, workDetails]
      const [rows] = await dbConnect.promise().execute(query, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  setAttendanceStartForAPI: async (id, inTime, outTime, projectId, workDetails, start) => {
    try {
      const query = 'INSERT INTO attendance(user_id, in_time, out_time,project_id, work_details, start) VALUES (?,?,?,?,?,?)'

      const values = [id, inTime, outTime, projectId, workDetails, start]
      const [rows] = await dbConnect.promise().execute(query, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  setAttendanceForManualInput: async (id, inTime, outTime, projectId, workDetails, start, end) => {
    try {
      const query = 'INSERT INTO attendance(user_id, in_time, out_time,project_id, work_details, start, end) VALUES (?,?,?,?,?,?,?)'

      const values = [id, inTime, outTime, projectId, workDetails, start, end]
      const [rows] = await dbConnect.promise().execute(query, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },

  setAttendanceEnd: async (id) => {
    try {
      const query = `UPDATE  attendance SET  end = CURRENT_TIMESTAMP WHERE user_id = ${id}  AND end IS NULL`
      const [rows] = await dbConnect.promise().execute(query);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  setLogEndForAPI: async (id) => {
    try {
      const query = `UPDATE  log SET  end = CURRENT_TIMESTAMP WHERE user_id = ${id}  AND end IS NULL`
      const [rows] = await dbConnect.promise().execute(query);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },

  setManualAttendanceStartForLog: async (id, start) => {
    try {
      const query = `UPDATE log AS L  SET L.start = '${start}' WHERE DATE(L.create_at) = CURRENT_DATE AND L.user_id = ${id}`

      const [rows] = await dbConnect.promise().execute(query);
      return rows.affectedRows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  setAttendanceEndTimeForAPI: async (id, end) => {
    try {
      const query = `UPDATE attendance SET end = '${end}' WHERE   end IS NULL AND user_id = ${id}`

      const [rows] = await dbConnect.promise().execute(query);
      return rows.affectedRows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  /*
  insertLog: async (offDayValues, userId) => {
    const getRunStartSql = `INSERT INTO log(user_id, in_time, out_time, work_hour, start, end, work_time, day_type) SELECT   user_id AS uId, in_time AS inTime, out_time AS outTime, O.option_value AS workHour,  TIME(MIN(A.start)) AS startTime, NULL,  TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime,CASE WHEN WEEKDAY(CURRENT_DATE) IN (${offDayValues})   THEN 'offday' WHEN  (SELECT COUNT(H.title) FROM holidays AS H WHERE DATE(CURRENT_DATE) BETWEEN H.start AND  H.end) > 0 THEN 'holiday' WHEN (SELECT COUNT(EL.type_id) FROM employee_leaves AS EL WHERE DATE(CURRENT_DATE) BETWEEN EL.start AND EL.end AND A.user_id = EL.user_id) > 0 THEN 'leave' ELSE 'regular' END	dayType FROM attendance AS A JOIN options AS O ON o.option_title = 'fixed time' JOIN options AS OP ON OP.option_title = 'off-day' WHERE DATE(A.create_at) = DATE(CURRENT_DATE) AND user_id = ${userId}`

    // console.log({ getRunStartSql });

    const [rows] = await dbConnect.promise().execute(getRunStartSql);

    return rows;
  }, */
  insertLog: async (offDayValues, userId) => {
    const getRunStartSql = `INSERT INTO log(user_id, in_time, out_time, work_hour, start, end, work_time, day_type) SELECT   user_id AS uId, in_time AS inTime, out_time AS outTime, O.option_value AS workHour, MIN(A.start) AS startTime, NULL,  TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime,CASE WHEN WEEKDAY(A.start) IN (${offDayValues})   THEN 'offday' WHEN  (SELECT COUNT(H.title) FROM holidays AS H WHERE DATE(A.start) BETWEEN H.start AND  H.end) > 0 THEN 'holiday' WHEN (SELECT COUNT(EL.type_id) FROM employee_leaves AS EL WHERE DATE(A.start) BETWEEN EL.start AND EL.end AND A.user_id = EL.user_id) > 0 THEN 'leave' ELSE 'regular' END	dayType FROM attendance AS A JOIN options AS O ON o.option_title = 'fixed time' JOIN options AS OP ON OP.option_title = 'off-day' WHERE DATE(A.create_at) = DATE(CURRENT_DATE) AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },
  insertLogForManual: async (offDayValues, date, userId) => {
    const getRunStartSql = `INSERT INTO log(user_id, in_time, out_time, work_hour, start, end, work_time, day_type) SELECT  user_id AS uId, in_time AS inTime, out_time AS outTime, O.option_value AS workHour, A.start AS startTime, NULL,  TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime,CASE WHEN WEEKDAY(A.start) IN (${offDayValues})   THEN 'offday' WHEN  (SELECT COUNT(H.title) FROM holidays AS H WHERE DATE(A.start) BETWEEN H.start AND  H.end) > 0 THEN 'holiday' WHEN (SELECT COUNT(EL.type_id) FROM employee_leaves AS EL WHERE DATE(A.start) BETWEEN EL.start AND EL.end AND A.user_id = EL.user_id) > 0 THEN 'leave' ELSE 'regular' END	dayType FROM attendance AS A JOIN options AS O ON o.option_title = 'fixed time' JOIN options AS OP ON OP.option_title = 'off-day' WHERE DATE(A.start) = DATE('${date}') AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },

  updateLog: async (userId) => {
    const getRunStartSql = `UPDATE log AS L SET L.end = CURRENT_TIMESTAMP WHERE DATE(L.create_at) = DATE(CURRENT_DATE)  AND  user_id = ${userId}`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  updateLogEndTimeOrCurTime: async (end, userId) => {
    const getRunStartSql = `UPDATE log AS L SET L.end = '${end}'  WHERE DATE(L.create_at) = DATE(CURRENT_DATE)  AND  user_id = ${userId}`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  updateLogForManualInput: async (userId, end, totalTime) => {
    const getRunStartSql = `UPDATE log AS L SET L.end = '${end}', L.work_time = '${totalTime}' WHERE DATE(L.start) = DATE('${end}')   AND  L.user_id = ${userId}`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  updateEndTime: async (userId, date, endTime) => {
    const getRunStartSql = `UPDATE  attendance SET  end = '${endTime}' WHERE DATE(start) = DATE('${date}') AND user_id = ${userId}  AND end IS NULL`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },
  updateEndTimeForLog: async (userId, endTime) => {
    const getRunStartSql = `UPDATE  log SET  end = '${endTime}' WHERE user_id = ${userId}  AND DATE('${endTime}') = DATE(start)`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },
  getCurrentDateWorkTime: async (userId) => {
    const query = `SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime FROM attendance WHERE  user_id = ${userId} AND DATE(start) = DATE(CURRENT_DATE)`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows[0];
  },
  getUpdateEndTimeWorkTime: async (userId, endDate) => {
    const query = `SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime FROM attendance WHERE  DATE(start) = DATE('${endDate}')  AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },

  updateLogTotalWorkTime: async (userId, totalWorkTime) => {
    console.log('form model', { totalWorkTime })
    const query = `UPDATE log AS L SET L.work_time = '${totalWorkTime}'  WHERE DATE(L.create_at) = DATE(CURRENT_DATE)  AND  user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  setLogTotalWorkTimeAdmin: async (userId, totalWorkTime, endDate) => {
    const query = `UPDATE log AS L SET L.work_time = '${totalWorkTime}'  WHERE DATE(L.start) = '${endDate}'  AND  user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  getRunStartData: async (userId) => {
    const getRunStartSql = 'SELECT start FROM `attendance` WHERE user_id = ? and end IS NULL'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  isAttendanceEndTimeNull: async (userId) => {
    const getRunStartSql = 'SELECT  CASE WHEN MAX(end IS  NULL) THEN 1 ELSE 0 END endTimeIsNull  FROM attendance WHERE  DATE(create_at) = DATE(NOW()) AND user_id = ?'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows[0];
  },
  getWeekHistory: async (userId) => {
    const getWeekHistory = 'SELECT date_format((create_at),"%d %b %y") as date, TIME_FORMAT(SEC_TO_TIME(min(TIME_TO_SEC(start))),"%h:%i% %p") as start ,TIME_FORMAT(SEC_TO_TIME(max(TIME_TO_SEC(end))),"%h:%i% %p") as end ,TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as total FROM attendance WHERE user_id = ? AND  date(create_at) = DATE(CURRENT_DATE) '
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getWeekHistory, value);
    return rows;
  },

  /* ======= report model  for this week ========= */

  // get current week date and name
  weekCurrentNameAndDate: async () => {
    const query = 'SELECT  DAYNAME(DATE_SUB(NOW(), INTERVAL 1 DAY)) AS weekCurrentName, DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY),"%Y-%m-%d") AS weekCurrentDate'
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  // get week start date
  getWeekStartDate: async (val) => {
    const query = `SELECT DATE_FORMAT(DATE_SUB(NOW(), INTERVAL ${val} DAY),'%Y-%m-%d') AS weekStartDate`
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  /* ======= report for this month ======= */

  // this month count  day and start date
  thisMonthDates: async () => {
    const query = 'SELECT   DATE_FORMAT(NOW() - interval (DAYOFMONTH(NOW()) -1) DAY, "%Y-%m-%d") AS monthStartDate,  DATEDIFF(CURRENT_DATE,  NOW() - INTERVAL (DAYOFMONTH(now())-1) DAY) AS countWorkday'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

  /* ===== report query for  this year ===== */
  // this year off days (friday)
  thisYearOffdays: async () => {
    const query = 'SELECT WEEKOFYEAR(CURDATE()) AS thisYearOffdays'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

  // count day & start date
  thisYearDates: async () => {
    const query = 'SELECT   DATE_FORMAT(NOW() - interval (DAYOFYEAR(NOW()) -1) DAY, "%Y-%m-%d") AS yearStartDate, DATE_FORMAT(NOW(),\'%Y-12-31\') AS yearEndDate,  DATEDIFF(CURRENT_DATE,  NOW() - INTERVAL (DAYOFYEAR(now())-1) DAY) AS countThisYearWorkday'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

  getToday: async (userId) => {
    const getTodaySql = 'SELECT  project_name,work_details, Time_format(Time(start),"%h:%i% %p") as start , Time_format(Time(end),"%h:%i% %p") as end, timediff(end,start ) as total FROM attendance AS A ,projects WHERE project_id=projects.id AND user_id = ? and end IS NOT NULL and Date(A.create_at)= Date(CURRENT_DATE)'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getTodaySql, value);
    return rows;
  },
  todayTotal: async (userId) => {
    const todayTotalSql = 'SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as todayTotal, TIME_FORMAT(SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(A.create_at)) * 60) *60)),"%H:%i")   AS totalExtrOrLess FROM  attendance AS A JOIN options AS O ON O.option_title = "fixed time" WHERE user_id = ? and end IS NOT NULL and Date(A.start)= Date(CURRENT_DATE)'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(todayTotalSql, value);
    return rows;
  },
  weekTotal: async (userId) => {
    const weekTotalSql = 'SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as weekTotal FROM attendance WHERE user_id = ? and end IS NOT NULL and Date(create_at) BETWEEN date( CURRENT_DATE - INTERVAL 7 day) and date(CURRENT_DATE )'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(weekTotalSql, value);
    return rows;
  },
  thisMonthTotal: async (userId) => {
    const monthTotalSql = 'SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as monthTotal FROM attendance WHERE user_id = ? and end IS NOT NULL and Date(create_at) BETWEEN date( CURRENT_DATE - INTERVAL  day(CURRENT_DATE) day) and date(CURRENT_DATE - INTERVAL 1 day )'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(monthTotalSql, value);
    return rows;
  },

  avgStartTime: async (id) => {
    try {
      const avgStartTimeSQL = 'SELECT TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(StartTime))),"%h:%i %p") AS avgStartTime FROM (SELECT min(time(start)) as StartTime FROM attendance WHERE user_id = ? GROUP BY date(create_at)) attendance'
      const value = [id]
      const [rows] = await dbConnect.promise().execute(avgStartTimeSQL, value);
      return rows;
    } catch (error) {
      console.log(error)
      return error;
    }
  },
  avgEndTime: async (id) => {
    try {
      const avgEndTimeSQL = 'SELECT TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(EndTime))),"%h:%i %p") AS avgEndTime FROM (SELECT MAX(time(end)) as EndTime FROM attendance WHERE user_id = ? GROUP BY date(create_at)) attendance'
      const value = [id]
      const [rows] = await dbConnect.promise().execute(avgEndTimeSQL, value);
      return rows;
    } catch (err) {
      console.log(err)
      return err;
    }
  },

  // get fixed working hours
  getFixedTime: async () => {
    const getHours = "SELECT o.option_value AS fixed_time  FROM `options` AS o WHERE o.option_title = 'fixed time'"
    const [row] = await dbConnect.promise().execute(getHours)
    return row;
  },

  // admin see employee reports
  getEmployeeInfo: async (id) => {
    const getInfo = 'SELECT id,user_name,gender,user_role,user_phone,user_mail, avatar,DATE_FORMAT(create_at,\'%d-%M-%Y\') AS create_at FROM `users` WHERE id = ?'
    const value = [id]
    const [row] = await dbConnect.promise().execute(getInfo, value)
    return row[0]
  },
  // log
  currentDateUserId: async () => {
    const query = 'SELECT DISTINCT user_id AS uId FROM `attendance` AS A WHERE DATE(A.create_at) = DATE(CURRENT_DATE)'
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  // if end time is null

  getEndTimeIsNull: async () => {
    const query = "SELECT TIME_FORMAT(L.start, '%h:%i %p') AS minStartTime, A.user_id AS userId ,A.work_details, DATE_FORMAT(A.start, '%Y-%m-%d') AS curDate,U.user_name AS name, U.avatar AS avatar, A.end AS endTime,U.user_role AS userRole,u.gender  FROM attendance AS A JOIN users AS U ON U.id IN( A.user_id )   JOIN log AS L ON A.user_id = L.user_id AND DATE(L.start) = DATE(A.start)  WHERE A.end IS NULL "
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  getMinStartTime: async (userId, date) => {
    const query = `SELECT MAX(id) as aId FROM attendance WHERE  DATE(start) = DATE('${date}') AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows[0]
  },
  setStartTime: async (id, date, startTime) => {
    const query = `UPDATE attendance SET start = '${startTime}' WHERE DATE(start) = DATE('${date}') AND id = ${id}`
    console.log(query);
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  setStartTimeForLog: async (id, date, startTime) => {
    const query = `UPDATE log SET start = '${startTime}' WHERE Date(start) = DATE('${date}') AND id = ${id}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  getUpdateLogStartTimeId: async (userId, date) => {
    const query = `SELECT MAX(id) AS logUpdateId FROM log WHERE DATE(start) = DATE('${date}') AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows[0]
  },

  // below all model for API

  getCurrentDateUserIdInAttendanceForAPI: async (id, date) => {
    const query = `SELECT user_id as isUserId FROM attendance WHERE DATE(start) = DATE('${date}') AND user_id = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },

  getCurrentDateUserIdInAttendanceWithOutTimeForAPI: async (id) => {
    const query = `SELECT user_id AS attdanceUserIdInCurDateWithOutTime FROM attendance WHERE user_id = ${id} AND DATE(start) = CURRENT_DATE`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },

  getCurrentDateUserIdForAPI: async (id, date) => {
    const query = `SELECT user_id as isUserId FROM log WHERE DATE(start) = DATE('${date}') AND user_id = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },
  getCurrentDateUserIdInLogWithOutTimeForAPI: async (id) => {
    const query = `SELECT user_id as isUserId FROM log WHERE user_id = ${id} AND DATE(start) = CURRENT_DATE`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },

  isAttendanceEndTimeNullAPI: async (userId, date) => {
    const getRunStartSql = `SELECT  CASE WHEN MAX(end IS  NULL) THEN 1 ELSE 0 END endTimeIsNull  FROM attendance WHERE  DATE(start) = DATE('${date}') AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows[0];
  },
  isAttendanceEndTimeNullAPIWithOutTime: async (userId) => {
    const getRunStartSql = `SELECT  CASE WHEN MAX(end IS  NULL) THEN 1 ELSE 0 END endTimeIsNullWithOutTime  FROM attendance WHERE  DATE(start) = CURRENT_DATE AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows[0];
  },

  setAttendanceEndForAPI: async (userId, date) => {
    const getRunStartSql = `UPDATE  attendance SET  end = '${date}' WHERE user_id = ${userId}  AND end IS NULL`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows.affectedRows;
  },
  setLogEndTimeForAPI: async (userId, date) => {
    const getRunStartSql = `UPDATE  log SET  end = '${date}' WHERE user_id =  ${userId}`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows.affectedRows;
  },
  setLogStartTimeForAPI: async (userId, date) => {
    const getRunStartSql = `UPDATE  log SET  start = '${date}' WHERE end IS NULL  AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows.affectedRows;
  },

  updateLogEndTimeForAPI: async (end, userId) => {
    const getRunStartSql = `UPDATE log AS L SET L.end = '${end}'  WHERE DATE(L.start) = DATE('${end}')  AND  user_id = ${userId}`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  calculateTotalWorkTimeAPI: async (userId, date) => {
    const query = `SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime FROM attendance WHERE    DATE(start) = DATE('${date}') AND user_id = ${userId}`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);

    return rows[0];
  },

  updateLogTotalWorkTimeAPI: async (userId, totalWorkTime, date) => {
    console.log('form model', { totalWorkTime })
    const query = `UPDATE log AS L SET L.work_time = '${totalWorkTime}'  WHERE DATE(L.start) = DATE('${date}')  AND  user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

}
module.exports = AttendanceModel;
