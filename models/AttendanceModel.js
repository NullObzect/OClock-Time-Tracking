const dbConnect = require('../config/database');

const AttendanceModel = {
  todayStartTime: async (id) => {
    const getStartSql = 'SELECT  Time_format(MIN(Time(start)),"%h:%i% %p") as start FROM attendance ,projects WHERE user_id = ? and end IS NOT NULL and Date(create_at)= Date(CURRENT_DATE);'
    const [rows] = await dbConnect.promise().execute(getStartSql, [id]);
    return rows;
  },
  todayEndTime: async (id) => {
    const getEndSql = 'SELECT Time_format(MAX(Time(end)),"%h:%i% %p") as end FROM attendance ,projects WHERE user_id = ? and Date(create_at)= Date(CURRENT_DATE)';
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
  setAttendanceStart: async (id, projectId, workDetails) => {
    try {
      const sqlStart = 'INSERT INTO `attendance`(`user_id`,`project_id`, `work_details`) VALUES (?,?,?)';
      const values = [id, projectId, workDetails]
      const [rows] = await dbConnect.promise().execute(sqlStart, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },

  setAttendanceEnd: async (id) => {
    try {
      const sqlEnd = 'UPDATE  attendance SET  end = CURRENT_TIMESTAMP WHERE user_id = ?  AND end IS NULL';
      const values = [id]
      const [rows] = await dbConnect.promise().execute(sqlEnd, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  getRunStartData: async (userId) => {
    const getRunStartSql = 'SELECT start FROM `attendance` WHERE user_id =? and end IS NULL'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getRunStartSql, value);
    return rows;
  },
  getWeekHistory: async (userId) => {
    const getWeekHistory = 'SELECT date_format((create_at),"%d %b %y") as date, TIME_FORMAT(SEC_TO_TIME(min(TIME_TO_SEC(start))),"%h:%i% %p") as start ,TIME_FORMAT(SEC_TO_TIME(max(TIME_TO_SEC(end))),"%h:%i% %p") as end ,TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as total FROM attendance WHERE user_id = ? AND end IS NOT NULL and date(create_at) BETWEEN date( CURRENT_DATE - INTERVAL 7 day) and date(CURRENT_DATE) GROUP BY date(create_at) ORDER BY date(create_at) ASC'
    const value = [userId]
    // await dbConnect.promise().execute(onlyGroupByNull);
    const [rows] = await dbConnect.promise().execute(getWeekHistory, value);
    return rows;
  },

  // report for today
  /* ======= report model  for this week ========= */
  thisWeekFridayDate: async () => {
    const query = "SELECT CASE WHEN (DAYNAME(NOW() -1) = 'Friday')  THEN DATE(NOW() -1) ELSE null  end AS isFriday"
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  thisWeekDay: async () => {
    const query = 'SELECT DAYOFWEEK(CURRENT_DATE()) AS thisWeekDay'
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  weekCurrentNameAndDate: async () => {
    const query = 'SELECT DAYNAME(DATE(CURRENT_DATE() -1)) AS weekCurrentName, DATE_FORMAT(DATE(CURRENT_DATE() -1), "%Y-%m-%d") AS weekCurrentDate'
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },
  getWeekStartDate: async (val) => {
    const query = `SELECT DATE_FORMAT(DATE(CURRENT_DATE() - ${val}),'%Y-%m-%d') AS weekStartDate`
    const [rows] = await dbConnect.promise().execute(query)
    return rows
  },

  // day , total work time and average work in week
  weekDayAndWorkTime: async (userId, weekStartDate, weekCurrentDate) => {
    const query = "SELECT COUNT(DISTINCT DATE(create_at)) AS thisWeekTotalWorkingDays, TIME_FORMAT( O.option_value, '%h') * COUNT(DISTINCT DATE(create_at)) AS weekFixedTotalHr, TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) as weekWorkTotalHr,  SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at)))  AS weekAvgTotalHr, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),'%h:%i') AS weekAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),'%h:%i') AS weekAvgEndTime, SUBTIME(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at))), TIME(O.option_value)) AS thisWeekAvgLessOrExtra, SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(create_at)) * 60) *60)) AS weekTotalExtrOrLess FROM attendance JOIN options AS O ON o.option_title = 'fixed time'  WHERE user_id = ? AND DATE(create_at) BETWEEN   ? AND ?"

    const value = [userId, weekStartDate, weekCurrentDate]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  // average start and end time
  weekAvgStartEnd: async (userId) => {
    const query = "SELECT TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(StartTime))),'%h:%i %p') AS weekAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(EndTime))),'%h:%i %p') AS weekAvgEndTime FROM (SELECT MIN(time(start)) as StartTime, MAX(time(end)) as EndTime FROM attendance WHERE user_id = ? AND DATE(CURRENT_DATE - INTERVAL 6 day)) attendance"
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },

  /* ======= report for this month ======= */
  // this month off days (friday)
  // thisMonthOffdays: async () => {
  //   const query = 'SELECT WEEKOFYEAR(date(CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE)-1 DAY)) AS thisMonthOffdays'
  //   const [rows] = await dbConnect.promise().execute(query);
  //   return rows;
  // },
  thisMonthOffdays: async () => {
    const query = "select ceiling((day(now()) - (6 - weekday(date_format(now(),'%Y-%m-01'))))/7)  + case when 6 - weekday(date_format(now(),'%Y-%m-01'))> 0  then 1 else 0 end thisMonthOffdays"
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  // this month holidays
  thisMonthHolidays: async () => {
    const query = "SELECT DATE_FORMAT(start,'%Y-%m-%d') AS holidayStartDate, DATEDIFF(end,start) + 1 countHolidays FROM holidays AS h  WHERE DATE(H.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE)"
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  // this month employee leave days
  thisMonthLeaveDays: async (userId) => {
    const query = "SELECT DATE_FORMAT(start, '%Y-%m-%d') AS leaveStartDate, DATEDIFF(end,start) + 1 AS countLeaveDays  FROM `employee_leaves` AS el WHERE DATE(el.start) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE)-1 DAY) and date(CURRENT_DATE) AND user_id  = ?"

    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  // this month working day
  thisMonthDates: async () => {
    const query = 'SELECT   DATE_FORMAT(NOW() - interval (DAYOFMONTH(NOW()) -1) DAY, "%Y-%m-%d") AS startDate,  DATEDIFF(CURRENT_DATE,  NOW() - INTERVAL (DAYOFMONTH(now())-1) DAY) AS countWorkday'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },
  monthDayAndWorkTime: async (userId) => {
    const query = "SELECT COUNT(DISTINCT DATE(create_at)) AS thisMonthTotalWorkingDays, TIME_FORMAT( O.option_value, '%h') * COUNT(DISTINCT DATE(create_at)) AS monthFixedTotalHr, TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) as monthWorkTotalHr,  SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at)))   AS monthAvgTotalHr, SUBTIME(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at))), TIME(O.option_value)) AS thisMonthAvgLessOrExtra, SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(create_at)) * 60) *60)) AS monthTotalExtrOrLess FROM attendance JOIN options AS O ON o.option_title = 'fixed time'  WHERE user_id = ? AND END IS NOT NULL AND Date(create_at) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE) -1 DAY) and date(CURRENT_DATE)"
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  monthAvgStartEnd: async (userId) => {
    const query = "SELECT TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(StartTime))),'%h:%i %p') AS monthAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(EndTime))),'%h:%i %p') AS monthAvgEndTime FROM (SELECT MIN(time(start)) as StartTime, MAX(time(end)) as EndTime FROM attendance  WHERE user_id = ? AND DATE(CURRENT_DATE - INTERVAL  DAYOFMONTH(CURRENT_DATE)-1 DAY)) attendance"

    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  /* ===== report query for  this year ===== */
  // this year off days (friday)
  thisYearOffdays: async () => {
    const query = 'SELECT WEEKOFYEAR(CURDATE()) AS thisYearOffdays'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

  // count this year  dates
  thisYearDates: async () => {
    const query = 'SELECT   DATE_FORMAT(NOW() - interval (DAYOFYEAR(NOW()) -1) DAY, "%Y-%m-%d") AS startDate,  DATEDIFF(CURRENT_DATE,  NOW() - INTERVAL (DAYOFYEAR(now())-1) DAY) AS countWorkday'
    const [rows] = await dbConnect.promise().execute(query);
    return rows;
  },

  yearDayAndWorkTime: async (userId) => {
    const query = "SELECT COUNT(DISTINCT DATE(create_at)) AS thisYearTotalWorkingDays, TIME_FORMAT( O.option_value, '%h') * COUNT(DISTINCT DATE(create_at)) AS yearFixedTotalHr, TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) as yearWorkTotalHr,  SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at)))   AS yearAvgTotalHr, SUBTIME(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at))), TIME(O.option_value)) AS thisYearAvgLessOrExtra, SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(create_at)) * 60) *60)) AS yearTotalExtrOrLess FROM attendance JOIN options AS O ON o.option_title = 'fixed time'  WHERE user_id = ? AND END IS NOT NULL AND Date(create_at) BETWEEN date( CURRENT_DATE - INTERVAL  DAYOFYEAR(CURRENT_DATE) -1 DAY) and date(CURRENT_DATE)"
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  yearAvgStartEnd: async (userId) => {
    const query = "SELECT TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(StartTime))),'%h:%i %p') AS yearAvgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(EndTime))),'%h:%i %p') AS yearAvgEndTime FROM (SELECT MIN(time(start)) as StartTime, MAX(time(end)) as EndTime FROM attendance  WHERE user_id = ? AND DATE(CURRENT_DATE - INTERVAL 365 day)) attendance"

    const value = [userId]
    const [rows] = await dbConnect.promise().execute(query, value);
    return rows;
  },
  getToday: async (userId) => {
    const getTodaySql = 'SELECT  project_name,work_details, Time_format(Time(start),"%h:%i% %p") as start , Time_format(Time(end),"%h:%i% %p") as end, timediff(end,start ) as total FROM attendance ,projects WHERE project_id=projects.id AND user_id = ? and end IS NOT NULL and Date(create_at)= Date(CURRENT_DATE)'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getTodaySql, value);
    return rows;
  },
  todayTotal: async (userId) => {
    const todayTotalSql = 'SELECT TIME_FORMAT(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))),"%h:%i") as todayTotal, TIME_FORMAT(SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(create_at)) * 60) *60)),"%h:%i")   AS totalExtrOrLess FROM  attendance  JOIN options AS o ON o.option_title = "fixed time" WHERE user_id = ? and end IS NOT NULL and Date(create_at)= Date(CURRENT_DATE)'
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

  // employee average working time Model
  averageWeekWorkTime: async (userId) => {
    const avgWeekTotal = 'SELECT TIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) / 7) as week_avg FROM attendance WHERE user_id = ?';
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(avgWeekTotal, value)
    return rows;
  },

  // an employee reports last 7 days
  anEmployeeReportLastSavenDays: async (userId) => {
    const lastSeventDaysSql = "SELECT DAYNAME(create_at) AS day, DATE_FORMAT(create_at,'%d %b %y') AS date,  DATE_FORMAT(create_at, '%Y-%m-%d') AS date_for_holiday, TIME_FORMAT(MIN(start),'%h:%i %p') AS start, TIME_FORMAT(MAX(end),'%h:%i %p') AS end, TIMEDIFF(MAX(end), MIN(start)) as working_time, SUBTIME(TIMEDIFF(MAX(end), MIN(start)), TIME(o.option_value)) AS time_count,  TIME_FORMAT(o.option_value, '%h')  AS  fixed_time, 'regular' AS type FROM attendance  JOIN options AS o  WHERE o.option_title = 'fixed time' AND user_id = ? AND create_at >  now() - INTERVAL 7 day GROUP BY DATE(create_at)";
    const value = [userId];
    const [rows] = await dbConnect.promise().execute(lastSeventDaysSql, value);
    return rows;
  },
  // an employee report between to date
  anEmployeeReportBetweenTwoDate: async (userId, startDate, endDate) => {
    try {
      const betweenTowDateSql = "SELECT DAYNAME(create_at) AS day, DATE_FORMAT(create_at, '%Y-%m-%d') AS date_for_holiday, DATE_FORMAT(DATE(create_at),'%d %b %y') AS date, TIME_FORMAT(TIME(MIN(start)),'%h:%i %p') AS start, TIME_FORMAT(TIME(MAX(end)),'%h:%i %p') AS end, TIMEDIFF(MAX(end), MIN(start)) as working_time, SUBTIME(TIMEDIFF(MAX(end), MIN(start)), TIME(o.option_value)) AS time_count,  TIME_FORMAT(o.option_value, '%h')  AS fixed_time, 'regular' AS type FROM attendance JOIN options AS o  WHERE o.option_title = 'fixed time' AND user_id = ? AND  DATE(create_at) BETWEEN ? AND ? GROUP BY DATE(create_at)";

      const values = [userId, startDate, endDate];
      const [rows] = await dbConnect.promise().execute(betweenTowDateSql, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/aEmployeeRportBetweenTwoDate', err);
      return err;
    }
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
  // get holiday date
  holidaysDate: async () => {
    try {
      const getHolidayDatSql = "SELECT DATE_FORMAT(start,'%Y-%m-%d') AS holiday_start, DATEDIFF(end,start) + 1 count_holiday, h.title AS title FROM holidays AS h";
      const [rows] = await dbConnect.promise().execute(getHolidayDatSql);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/ getHolidayDatSql', err);
      return err;
    }
  },
  // get holiday date
  employeeLeaveDates: async (id) => {
    try {
      const getLeaveDateSql = "SELECT DATE_FORMAT(start, '%Y-%m-%d') AS leave_start, DATEDIFF(end,start) + 1 AS count_leave_day, el.reason AS leave_reason  FROM `employee_leaves` AS el WHERE user_id  = ?";
      const value = [id]
      const [rows] = await dbConnect.promise().execute(getLeaveDateSql, value);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/ employeeLeaveDates ', err);
      return err;
    }
  },

  // last seven days total
  reportLastSevendaysTotalForEmployee: async (id) => {
    try {
      const getSevendaysTotalSql = 'SELECT COUNT(DISTINCT DATE(create_at)) AS present, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),"%h:%i %p") AS avgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),"%h:%i %p") AS avgEndTime, o.option_value * COUNT(DISTINCT Date(create_at)) AS fixed_total, TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) AS weekTotal, TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) AS total_seconds, "00" AS totalLessORExtra FROM attendance JOIN options AS o WHERE o.option_title = "fixed time" AND user_id = ? AND END IS NOT NULL AND create_at > now() - INTERVAL 7  day'
      const value = [id]

      const [rows] = await dbConnect.promise().execute(getSevendaysTotalSql, value)
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/reportLastSevendaysTotalForEmployee', err);
      return err;
    }
  },
  // between to date total for employee
  reportBetweenTwoDateTotal: async (userId, startDate, endDate) => {
    console.log({ userId, startDate, endDate });

    const getTotal = `SELECT DAYNAME('${startDate}') startDayName, DATEDIFF('${endDate}', '${startDate}')  AS totalDay,  TIME_FORMAT(O.option_value, "%H")  AS fixedTime, COUNT(DISTINCT DATE(create_at)) AS day, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(start))),"%h:%i %p") AS avgStartTime, TIME_FORMAT(SEC_TO_TIME(AVG(TIME_TO_SEC(end))),"%h:%i %p") AS avgEndTime, o.option_value * COUNT(DISTINCT Date(create_at)) AS fixed_total, TIME_FORMAT(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))), "%h:%i") AS weekTotal, TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) AS total_seconds, "00" AS totalLessORExtra, TIME_FORMAT(SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at))), "%h:%i") AS  avgWorkHour FROM attendance JOIN options AS o WHERE o.option_title = "fixed time"  AND user_id = ? AND DATE(create_at) BETWEEN ? AND  ? `
    const values = [userId, startDate, endDate];
    const [rows] = await dbConnect.promise().execute(getTotal, values);
    return rows;
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
}
module.exports = AttendanceModel;

// SELECT    SUM(DATEDIFF(H.end, H.start) + 1)  AS numOfHoliday   FROM `attendance` AS A JOIN holidays AS H  ON DATE(A.create_at)   IN    (DATE(H.start))

// WHERE A.user_id = 18 AND   Date(create_at)   BETWEEN date( CURRENT_DATE - INTERVAL 300 day) and date(CURRENT_DATE)

// SELECT  SUM( DISTINCT DATEDIFF(EL.end, EL.start) + 1) AS numOfLeaveDay,  sum(DATEDIFF(H.end, H.start) + 1 ) AS numOfHoliday  FROM `attendance` AS A  JOIN holidays AS H  ON DATE(A.create_at)   IN    (DATE(H.start))    JOIN employee_leaves AS EL ON DATE(A.create_at) IN (DATE(EL.start))

// WHERE A.user_id = 18 AND   Date(create_at)   BETWEEN date( CURRENT_DATE - INTERVAL 300 day) and date(CURRENT_DATE)

// function generateTotalOffdays(fridays, leavedays, holidays){

//   if(fridays == null)  return null;
//   if(leavedays == null)  return null;
//   if(holidays == null)  return null;
//   const margedArr = [...fridays, ...leavedays, ...holidays];
//   const uniqueArray = [... new Set(margedArr)]

//    return uniqueArray.length;

// }
// console.log(generateTotalOffdays(fridays,leavedays,holidays))

// SELECT   DATE_FORMAT(NOW() - interval (DAY(NOW()) -1) DAY, "%Y-%m-%d") AS thisMonthStartDate,  DATEDIFF(CURRENT_DATE,  NOW() - INTERVAL (DAY(now())-1) DAY) AS countThisMonthWorkday

// const query = "SELECT COUNT(DISTINCT DATE(create_at)) AS weekDay, TIME_FORMAT( O.option_value, '%h') * COUNT(DISTINCT DATE(create_at)) AS weekFixedTotal, TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) as weekTotalHr,  SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start))))) / COUNT(DISTINCT DATE(create_at)))   AS weekAvgTotal, SUBTIME(TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))),SEC_TO_TIME(((O.option_value) * COUNT(DISTINCT DATE(create_at)) * 60) *60)) AS weekTotalExtrOrLess FROM attendance JOIN options AS O ON o.option_title = 'fixed time'   WHERE user_id = ? AND END IS NOT NULL and Date(create_at) BETWEEN date( CURRENT_DATE - INTERVAL 6 day) and date(CURRENT_DATE)"
