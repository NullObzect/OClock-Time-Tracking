const dbConnect = require('../config/database');

const LogModel = {

  countWorkdaysForWeek: async (userId, weekStartDate) => {
    const query = `SELECT CASE WHEN day_type = 'regular' THEN 1  ELSE 0 END  workdays FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN   '${weekStartDate}' AND  DATE(CURRENT_DATE -1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  thisWeekReports: async (userId, weekStartDate, workdays) => {
    const query = `SELECT COUNT(create_at) AS weekNumberOfWorkingDays, REPLACE(TIME_FORMAT( work_hour, '%h'),'0', '') * ${workdays} AS weekFixedHr,  SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))) AS weekTotalWorkHr, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))), SEC_TO_TIME(work_hour * ${workdays} * 60 * 60) ) weekTotalExtraOrLess, SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}) AS weekAvgWorkTime, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}), work_hour) AS weekAvgExtraOrLess, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),'%h:%i %p') AS weekAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),'%h:%i %p') AS weekAvgEndTime  FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN  '${weekStartDate}' AND  DATE(CURRENT_DATE - 1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  // late count time for weekly
  lateCountThisWeek: async (userId) => {
    const query = `SELECT  CASE WHEN LEFT(TIME_FORMAT(TIMEDIFF(TIME(in_time) + TIME(O.option_value), TIME(start)), '%H:%i'), 1) = '-' THEN 1 ELSE 0 END  lateCount FROM log AS L JOIN options AS O ON O.option_title = 'tolerance-time'  WHERE  user_id = ${userId} AND L.create_at >  now() - INTERVAL 7 DAY`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  countWorkdaysForMonth: async (userId, monthStartDate) => {
    const query = `SELECT CASE WHEN day_type = 'regular' THEN 1  ELSE 0 END  workdays FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN   '${monthStartDate}' AND  DATE(CURRENT_DATE -1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  thisMonthReports: async (userId, monthStartDate, workdays) => {
    const query = `SELECT COUNT(create_at) AS monthNumberOfWorkingDays, REPLACE(TIME_FORMAT( work_hour , '%h'),'0', '') * ${workdays} AS monthFixedHr,  SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))) AS monthTotalWorkHr, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))), SEC_TO_TIME(work_hour * ${workdays} * 60 * 60) ) monthTotalExtraOrLess, SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}) AS monthAvgWorkTime, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}), work_hour) AS monthAvgExtraOrLess, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),'%h:%i %p') AS monthAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),'%h:%i %p') AS monthAvgEndTime  FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN  '${monthStartDate}' AND  DATE(CURRENT_DATE - 1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  // late count time for weekly monthly
  lateCountThisMonth: async (userId, monthStartDate) => {
    const query = `SELECT  CASE WHEN LEFT(TIME_FORMAT(TIMEDIFF(TIME(in_time) + TIME(O.option_value), TIME(start)), '%H:%i'), 1) = '-' THEN 1 ELSE 0 END  lateCount FROM log AS L JOIN options AS O ON O.option_title = 'tolerance-time'  WHERE  user_id = ${userId} AND DATE(L.create_at) BETWEEN  '${monthStartDate}' AND  DATE(CURRENT_DATE - 1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  countWorkdaysForYear: async (userId, yearStartDate) => {
    const query = `SELECT CASE WHEN day_type = 'regular' THEN 1  ELSE 0 END  workdays FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN   '${yearStartDate}' AND  DATE(CURRENT_DATE -1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  thisYearReports: async (userId, yearStartDate, workdays) => {
    console.log({ userId, yearStartDate, workdays });

    const query = `SELECT COUNT(create_at) AS yearNumberOfWorkingDays, REPLACE(TIME_FORMAT( work_hour , '%h'),'0', '') * ${workdays} AS yearFixedHr,  SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))) AS yearTotalWorkHr, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))), SEC_TO_TIME(work_hour * ${workdays} * 60 * 60) ) yearTotalExtraOrLess, SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}) AS yearAvgWorkTime, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}), work_hour) AS yearAvgExtraOrLess, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),'%h:%i %p') AS yearAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),'%h:%i %p') AS yearAvgEndTime  FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN  '${yearStartDate}' AND  DATE(CURRENT_DATE - 1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  // late count time for  yearly
  lateCountThisYear: async (userId, yearStartDate) => {
    const query = `SELECT  CASE WHEN LEFT(TIME_FORMAT(TIMEDIFF(TIME(in_time) + TIME(O.option_value), TIME(start)), '%H:%i'), 1) = '-' THEN 1 ELSE 0 END  lateCount FROM log AS L JOIN options AS O ON O.option_title = 'tolerance-time'  WHERE  user_id = ${userId} AND DATE(L.create_at) BETWEEN  '${yearStartDate}' AND  DATE(CURRENT_DATE - 1)`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  countUserJoiningDate: async (userId) => {
    const query = `SELECT DATEDIFF(MAX(L.create_at), U.create_at) + 1 as countJoinIngDate FROM log AS L JOIN users AS U ON U.id = L.user_id WHERE    L.user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  numberOfdaysBetweenTwoDates: async (startDate, endDate) => {
    const query = `SELECT DATEDIFF('${endDate}', '${startDate}') AS days`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  countWorkdaysForBetweenTwoDate: async (userId, startDate, endDate) => {
    const query = `SELECT CASE WHEN day_type = 'regular' THEN 1  ELSE 0 END  workdays FROM log  WHERE user_id = ${userId} AND DATE(create_at)  BETWEEN   '${startDate}' AND '${endDate}'`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  reportsBewttenTwoDate: async (userId, startDate, endDate, workdays) => {
    const query = `SELECT COUNT(create_at) AS twoDateNumberOfWorkingDays, REPLACE(TIME_FORMAT( work_hour , '%h'),'0', '') * ${workdays} AS twoDateFixedHr,  SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))) AS twoDateTotalWorkHr, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))), SEC_TO_TIME(work_hour * ${workdays} * 60 * 60) ) twoDateTotalExtraOrLess, SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}) AS twoDateAvgWorkTime, SUBTIME(SEC_TO_TIME(SUM(TIME_TO_SEC(work_time)) / ${workdays}), work_hour) AS twoDateAvgExtraOrLess, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),'%h:%i %p') AS twoDateAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),'%h:%i %p') AS twoDateAvgEndTime  FROM log  WHERE user_id = ${userId} AND DATE(create_at) BETWEEN  '${startDate}' AND  '${endDate}'`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  // late count time for weekly monthly
  lateCountBetweenTwoDate: async (userId, startDate, endDate) => {
    const query = `SELECT  CASE WHEN LEFT(TIME_FORMAT(TIMEDIFF(TIME(in_time) + TIME(O.option_value), TIME(start)), '%H:%i'), 1) = '-' THEN 1 ELSE 0 END  lateCount FROM log  AS L JOIN options AS O ON O.option_title = 'tolerance-time'  WHERE  user_id = ${userId} AND DATE(L.create_at) BETWEEN  '${startDate}' AND  '${endDate}'`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  lastSevenDaysReports: async (userId) => {
    const query = `SELECT  DAYNAME(L.create_at) AS day, DATE_FORMAT(L.create_at,'%d-%m-%Y') AS date,  day_type AS dayType, TIME_FORMAT(start,'%h:%i %p') AS start, CASE WHEN  (TIME_TO_SEC(in_time)   >  TIME_TO_SEC(start)) 
    THEN TIME_FORMAT(TIMEDIFF(TIME(in_time), TIME(start)), '%H:%i')
    WHEN  TIME(start)  BETWEEN TIME(in_time) AND  TIME(SEC_TO_TIME(TIME_TO_SEC(in_time)) + SEC_TO_TIME(TIME_TO_SEC(O.option_value))) THEN ''
    ELSE TIME_FORMAT(TIMEDIFF(TIME( SEC_TO_TIME(TIME_TO_SEC(in_time)) + SEC_TO_TIME(TIME_TO_SEC(O.option_value))), TIME((start))), '%H:%i') END inTimeExtraOrLess, TIME_FORMAT(end,'%h:%i %p') AS end, TIME_FORMAT(TIMEDIFF(TIME(work_hour), TIME(work_time)), '%H:%i') AS outTimeExtraOrLess, TIME_FORMAT(work_time,'%H:%i') AS workTime, REPLACE(TIME_FORMAT( work_hour , '%h'),'0', '') AS workHr, TIME_FORMAT(TIMEDIFF(work_time, work_hour), '%H
    :%i') AS totalTimeExtraOrLess FROM log AS L JOIN options AS O ON O.option_title = 'tolerance-time'  WHERE  user_id = ${userId} AND L.create_at >  now() - INTERVAL 7 DAY`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  reportDetailsBetweenTwoDate: async (userId, startDate, endDate) => {
    const query = `SELECT  DAYNAME(L.create_at) AS day, DATE_FORMAT(L.create_at,'%d %b %y') AS date,  day_type AS dayType, TIME_FORMAT(start,'%h:%i %p') AS start, CASE WHEN  (TIME_TO_SEC(in_time)   >  TIME_TO_SEC(start)) 
    THEN TIME_FORMAT(TIMEDIFF(TIME(in_time), TIME(start)), '%H:%i')
    WHEN  TIME(start)  BETWEEN TIME(in_time) AND  TIME(SEC_TO_TIME(TIME_TO_SEC(in_time)) + SEC_TO_TIME(TIME_TO_SEC(O.option_value))) THEN ''
    ELSE TIME_FORMAT(TIMEDIFF(TIME( SEC_TO_TIME(TIME_TO_SEC(in_time)) + SEC_TO_TIME(TIME_TO_SEC(O.option_value))), TIME((start))), '%H:%i') END inTimeExtraOrLess, TIME_FORMAT(end,'%h:%i %p') AS end, TIME_FORMAT(TIMEDIFF(TIME(work_hour), TIME(work_time)), '%H:%i') AS outTimeExtraOrLess, TIME_FORMAT(work_time,'%H:%i') AS workTime, REPLACE(TIME_FORMAT( work_hour , '%h'),'0', '') AS workHr, TIME_FORMAT(TIMEDIFF(work_time, work_hour), '%H:%i') AS totalTimeExtraOrLess FROM log AS L JOIN options AS O ON O.option_title = 'tolerance-time' WHERE  user_id = ${userId} AND  DATE(L.create_at) BETWEEN '${startDate}' AND '${endDate}'`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  // for in time and out time

  inTime: async () => {
    const query = "SELECT TIME_FORMAT(option_value, '%h %p') as  inTime FROM `options` WHERE option_title = 'in-time'"
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  outTime: async () => {
    const query = "SELECT TIME_FORMAT(option_value, '%h %p') as outTime FROM `options` WHERE option_title = 'out-time'"
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  isUserIdInLog: async (userId) => {
    const query = `SELECT DISTINCT user_id  FROM log WHERE user_id = ${userId}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  checkTodayReportEmptyOrNot: async (userId) => {
    const query = `SELECT DISTINCT user_id, end FROM log WHERE DATE(create_at) = DATE(CURRENT_DATE) AND user_id = ${userId} AND end is NOT NULL`
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },

  // query for update log option value when change option value
  getOptionsValueFromLog: async () => {
    const query = 'SELECT id as logId, in_time as logInTime, out_time AS logOutTime, work_hour AS logFixedHr from log WHERE create_at >  now() - INTERVAL 1 DAY'
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  getOptionsValueForUpdateInTime: async () => {
    const query = "SELECT O.option_value AS inTime FROM options AS O WHERE O.option_title = 'in-time'"
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  getOptionsValueForUpdateOutTime: async () => {
    const query = "SELECT O.option_value AS outTime FROM options AS O WHERE O.option_title = 'out-time'"
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  getOptionsValueForUpdateFixedTime: async () => {
    const query = "SELECT O.option_value AS fixedTime FROM options AS O WHERE O.option_title = 'fixed time'"
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  updateForLogValues: async (inTime, outTime, fixedTime, id) => {
    console.log(' log modal', { inTime, fixedTime, id });

    const query = `UPDATE log SET in_time = '${inTime}', out_time = '${outTime}', work_hour = '${fixedTime}' WHERE id = ${id}`
    const [rows] = await dbConnect.promise().execute(query)
    return rows.affectedRows;
  },
  ifOptionValueIsUpdated: async () => {
    const query = 'SELECT DISTINCT L.id AS logId, L.in_time as logInTime, L.out_time AS logOutTime, L.work_hour AS logFixedHr FROM options AS O JOIN log AS L ON DATE(O.update_at) = DATE(L.create_at)'
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  // query for sum total time all employee
  getTotalTimeToday: async () => {
    const query = 'SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(work_hour))) AS totalTimeToday FROM log WHERE DATE(create_at) = DATE(CURRENT_DATE)'
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  getTotalTimeThisWeek: async () => {
    const query = 'SELECT  SEC_TO_TIME(SUM(TIME_TO_SEC(work_time))) AS totalTimeThisWeek FROM log WHERE create_at >  now() - INTERVAL 7 DAY'
    const [rows] = await dbConnect.promise().execute(query)
    return rows;
  },
  todayEmployeesRecord: async () => {
    const todayEmployeesRecord = 'SELECT U.user_name as name, U.avatar avatar,U.gender,U.user_role as userRole, L.user_id AS userId, Date_Format(L.create_at,\'%Y-%m-%d\') AS curDate, TIME_FORMAT(L.start, \'%h:%i %p\') minStartTime,TIME_FORMAT(L.end, \'%h:%i %p\') endTime, A.work_details   FROM log  AS L JOIN  attendance   AS A  ON A.user_id = L.user_id JOIN  users AS U ON L.user_id = U.id WHERE DATE(L.create_at) = DATE(NOW()) AND L.end = A.end AND L.user_id = A.user_id'
    const [rows] = await dbConnect.promise().execute(todayEmployeesRecord)
    return rows;
  },
}
module.exports = LogModel
