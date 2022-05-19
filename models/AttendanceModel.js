/* eslint-disable no-tabs */
const dbConnect = require('../config/database');

const AttendanceModel = {
  todayStartTime: async (id) => {
    const getStartSql = 'SELECT  Time_format(MIN(Time(start)),"%h:%i% %p") as start FROM attendance  WHERE user_id = ? and Date(create_at) = Date(CURRENT_DATE);'
    const [rows] = await dbConnect.promise().execute(getStartSql, [id]);
    console.log('start modal', rows)
    return rows;
  },
  /*  todayEndTime: async (id) => {
    const getEndSql = 'SELECT Time_format(MAX(Time(end)),"%h:%i% %p") as end FROM attendance ,projects WHERE user_id = ? and Date(create_at)= Date(CURRENT_DATE)';
    const [rows] = await dbConnect.promise().execute(getEndSql, [id]);
    return rows;
  }, */
  todayEndTime: async (id) => {
    const getEndSql = 'SELECT Time_format(MAX(Time(end)),"%h:%i% %p") as end FROM attendance WHERE user_id = ? and Date(create_at)= Date(CURRENT_DATE)';
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

  // for log

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

  getCurrentDateUserId: async (id) => {
    const query = `SELECT user_id as isUserId FROM log WHERE DATE(create_at) = DATE(CURRENT_DATE) AND user_id = ${id}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows[0];
  },
  // start
  setAttendanceStart: async (id, inTime, outTime, projectId, workDetails) => {
    try {
      // eslint-disable-next-line no-tabs
      return await dbConnect
        .promise()
        .getConnection()
        .then((conn) => {
          conn
            .execute(
              'INSERT INTO attendance(user_id, in_time, out_time,project_id, work_details) VALUES (?,?,?,?,?)',
              [id, inTime, outTime, projectId, workDetails],
            )

          // .then((rows) => {
          //   console.log(rows)
          //   conn.execute(`INSERT INTO log(user_id, in_time, out_time, work_hour, start, end, work_time, day_type) SELECT   user_id AS uId, in_time AS inTime, out_time AS outTime, O.option_value AS workHour, CURRENT_TIMESTAMP, NULL, NULL,CASE WHEN DAY(CURRENT_DATE) IN  (OP.option_value)  THEN 'offday' WHEN  (SELECT COUNT(H.title) FROM holidays AS H WHERE DATE(CURRENT_DATE) BETWEEN H.start AND  H.end) > 0 THEN 'holiday' WHEN (SELECT COUNT(EL.reason) FROM employee_leaves AS EL WHERE DATE(CURRENT_DATE) BETWEEN EL.start AND EL.end AND A.user_id = EL.user_id) > 0 THEN 'leave' ELSE 'regular' END	dayType FROM attendance AS A JOIN options AS O ON o.option_title = 'fixed time' JOIN options AS OP ON OP.option_title = 'off-day' WHERE DATE(A.create_at) = DATE(CURRENT_DATE) AND user_id = ${id}`)
          // })
        })
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },

  setAttendanceEnd: async (id) => {
    try {
      return await dbConnect
        .promise()
        .getConnection()
        .then((conn) => {
          conn
            .execute('UPDATE  attendance SET  end = CURRENT_TIMESTAMP WHERE user_id = ?  AND end IS NULL', [id])
        })
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  // insertLog: async (userId) => {
  //   const getRunStartSql = `INSERT INTO log(user_id, in_time, out_time, work_hour, start, end, work_time, day_type) SELECT   user_id AS uId, in_time AS inTime, out_time AS outTime, O.option_value AS workHour,  TIME(MIN(A.start)) AS startTime, CURRENT_TIMESTAMP,  TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime,CASE WHEN WEEKDAY(CURRENT_DATE) IN  (OP.option_value)  THEN 'offday' WHEN  (SELECT COUNT(H.title) FROM holidays AS H WHERE DATE(CURRENT_DATE) BETWEEN H.start AND  H.end) > 0 THEN 'holiday' WHEN (SELECT COUNT(EL.reason) FROM employee_leaves AS EL WHERE DATE(CURRENT_DATE) BETWEEN EL.start AND EL.end AND A.user_id = EL.user_id) > 0 THEN 'leave' ELSE 'regular' END	dayType FROM attendance AS A JOIN options AS O ON o.option_title = 'fixed time' JOIN options AS OP ON OP.option_title = 'off-day' WHERE DATE(A.create_at) = DATE(CURRENT_DATE) AND user_id = ${userId}`
  //   const value = [userId]
  //   const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
  //   return rows;
  // },

  insertLog: async (userId) => {
    const getRunStartSql = `INSERT INTO log(user_id, in_time, out_time, work_hour, start, end, work_time, day_type) SELECT   user_id AS uId, in_time AS inTime, out_time AS outTime, O.option_value AS workHour,  TIME(MIN(A.start)) AS startTime, NULL,  TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime,CASE WHEN WEEKDAY(CURRENT_DATE) IN  (OP.option_value)  THEN 'offday' WHEN  (SELECT COUNT(H.title) FROM holidays AS H WHERE DATE(CURRENT_DATE) BETWEEN H.start AND  H.end) > 0 THEN 'holiday' WHEN (SELECT COUNT(EL.reason) FROM employee_leaves AS EL WHERE DATE(CURRENT_DATE) BETWEEN EL.start AND EL.end AND A.user_id = EL.user_id) > 0 THEN 'leave' ELSE 'regular' END	dayType FROM attendance AS A JOIN options AS O ON o.option_title = 'fixed time' JOIN options AS OP ON OP.option_title = 'off-day' WHERE DATE(A.create_at) = DATE(CURRENT_DATE) AND user_id = ${userId}`

    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },
  updateLog: async (userId) => {
    const getRunStartSql = `UPDATE log AS L SET L.end = CURRENT_TIMESTAMP WHERE DATE(L.create_at) = DATE(CURRENT_DATE)  AND  user_id = ${userId}`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  updateEndTime: async (userId, endTime) => {
    const getRunStartSql = `UPDATE  attendance SET  end = '${endTime}' WHERE user_id = ${userId}  AND end IS NULL`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },
  updateEndTimeForLog: async (userId, endTime) => {
    const getRunStartSql = `UPDATE  log SET  end = '${endTime}' WHERE user_id = ${userId}  AND DATE(create_at) = DATE(start)`
    const [rows] = await dbConnect.promise().execute(getRunStartSql);
    return rows;
  },
  getCurrentDateWorkTime: async (userId) => {
    const query = `SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime FROM attendance WHERE  user_id = ${userId} AND DATE(create_at) = DATE(CURRENT_DATE)`
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows[0];
  },
  getUpdateEndTimeWorkTime: async (userId, endDate) => {
    const query = `SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS totalWorkTime FROM attendance WHERE  user_id = ${userId} AND DATE(create_at) = '${endDate}'`
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
    console.log('form model', { totalWorkTime })
    const query = `UPDATE log AS L SET L.work_time = '${totalWorkTime}'  WHERE DATE(L.create_at) = '${endDate}'  AND  user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  getRunStartData: async (userId) => {
    const getRunStartSql = 'SELECT start FROM `attendance` WHERE user_id = ? and end IS NULL'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  getWeekHistory: async (userId) => {
    const getWeekHistory = 'SELECT date_format((create_at),"%d %b %y") as date, TIME_FORMAT(SEC_TO_TIME(min(TIME_TO_SEC(start))),"%h:%i% %p") as start ,TIME_FORMAT(SEC_TO_TIME(max(TIME_TO_SEC(end))),"%h:%i% %p") as end ,TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as total FROM attendance WHERE user_id = ? AND  date(create_at) = DATE(CURRENT_DATE) '
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getWeekHistory, value);
    return rows;
  },

  // report for today
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
    const query = 'SELECT   DATE_FORMAT(NOW() - interval (DAYOFYEAR(NOW()) -1) DAY, "%Y-%m-%d") AS yearStartDate,  DATEDIFF(CURRENT_DATE,  NOW() - INTERVAL (DAYOFYEAR(now())-1) DAY) AS countThisYearWorkday'
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
    const todayTotalSql = 'SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as todayTotal, TIME_FORMAT(SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(create_at)) * 60) *60)),"%H:%i")   AS totalExtrOrLess FROM  attendance  JOIN options AS o ON o.option_title = "fixed time" WHERE user_id = ? and end IS NOT NULL and Date(create_at)= Date(CURRENT_DATE)'
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
    const getInfo = 'SELECT id,user_name,user_role,user_phone,user_mail, avatar FROM `users` WHERE id = ?'
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
    const query = "SELECT TIME_FORMAT(L.start, '%h:%i %p') AS minStartTime, A.user_id AS userId ,A.work_details,  DATE_FORMAT(A.create_at, '%Y-%m-%d') AS curDate,U.user_name AS name, U.avatar AS avatar, TIME_FORMAT(SEC_TO_TIME(SUM(TIME_TO_SEC(A.start))),'%h:%i %p') AS startTime,  A.end AS endTime,U.user_role AS userRole  FROM attendance AS A JOIN users AS U ON U.id IN( A.user_id )   JOIN log AS L ON A.user_id = L.user_id AND DATE(L.create_at) = DATE(A.create_at)  WHERE A.end IS NULL GROUP BY A.user_id"
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  getMinStartTime: async (userId) => {
    const query = `SELECT MAX(id) as aId FROM attendance WHERE  DATE(start) = DATE(create_at) AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows[0]
  },
  setStartTime: async (id, startTime) => {
    const query = `UPDATE attendance SET start = '${startTime}' WHERE id = ${id}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  setStartTimeForLog: async (id, startTime) => {
    const query = `UPDATE log SET start = '${startTime}' WHERE id = ${id}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  getUpdateLogStartTimeId: async (userId) => {
    const query = `SELECT MAX(id) AS logUpdateId FROM log WHERE  DATE(create_at) = DATE(start) AND user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows[0]
  },

}
module.exports = AttendanceModel;
