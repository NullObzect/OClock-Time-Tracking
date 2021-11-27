const dbConnect = require('../config/database');

const AttendanceModel = {

  setAttendanceStart: async (id) => {
    try {
      const sqlStart = 'INSERT INTO `attendance`(`user_id`) VALUES (?)';
      const values = [id]
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
    // const onlyGroupByNull = 'SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""))'
    const value = [userId]
    // await dbConnect.promise().execute(onlyGroupByNull);
    const [rows] = await dbConnect.promise().execute(getWeekHistory, value);
    return rows;
  },
  getToday: async (userId) => {
    const getTodaySql = 'SELECT  Time_format(Time(start),"%h:%i% %p") as start , Time_format(Time(end),"%h:%i% %p") as end, timediff(end,start ) as total FROM attendance WHERE user_id = ? and end IS NOT NULL and Date(create_at)= Date(CURRENT_DATE)'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getTodaySql, value);
    return rows;
  },
  todayTotal: async (userId) => {
    const todayTotalSql = 'SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as todayTotal FROM  attendance WHERE user_id = ? and end IS NOT NULL and Date(create_at)= Date(CURRENT_DATE)'
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

  // an employee report last 7 days
  anEmployeeReportLastSavenDays: async (userId) => {
    const lastSeventDaysSql = "SELECT DAYNAME(create_at) AS day, DATE_FORMAT(create_at,'%d %b %y') AS date,  DATE_FORMAT(create_at, '%Y-%m-%d') AS date_for_holiday, TIME_FORMAT(MIN(start),'%h:%i %p') AS start, TIME_FORMAT(MAX(end),'%h:%i %p') AS end, TIMEDIFF(MAX(end), MIN(start)) as working_time, SUBTIME(TIMEDIFF(MAX(end), MIN(start)), TIME(o.option_value)) AS time_count,  o.option_value  AS  fixed_time, 'regular' AS type FROM attendance  JOIN options AS o  WHERE o.option_title = 'fixed time' AND user_id = ? AND create_at >  now() - INTERVAL 7 day GROUP BY DATE(create_at) ";
    const value = [userId];
    const [rows] = await dbConnect.promise().execute(lastSeventDaysSql, value);
    return rows;
  },
  // an employee repot berween to date
  anEmployeeReportBetweenTwoDate: async (userId, startDate, endDate) => {
    try {
      const betweenTowDateSql = "SELECT DAYNAME(create_at) AS day, DATE_FORMAT(create_at, '%Y-%m-%d') AS date_for_holiday, DATE_FORMAT(DATE(create_at),'%d %b %y') AS date, TIME_FORMAT(TIME(MIN(start)),'%h:%i %p') AS start, TIME_FORMAT(TIME(MAX(end)),'%h:%i %p') AS end, TIMEDIFF(MAX(end), MIN(start)) as working_time, SUBTIME(TIMEDIFF(MAX(end), MIN(start)), TIME(o.option_value)) AS time_count, o.option_value  AS fixed_time, 'regular' AS type FROM attendance JOIN options AS o  WHERE o.option_title = 'fixed time' AND user_id = ? AND  DATE(create_at) BETWEEN ? AND ? GROUP BY DATE(create_at)";

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

  // get fixed working hours
  getFixedTime: async () => {
    const getHours = "SELECT o.option_value AS fixed_time  FROM `options` AS o WHERE o.option_title = 'fixed time'"
    const [row] = await dbConnect.promise().execute(getHours)
    return row;
  },

  // admin see employee reports
  getEmployeeInfo: async (id) => {
    const getInfo = 'SELECT id,user_name, avatar FROM `users` WHERE id = ?'
    const value = [id]
    const [row] = await dbConnect.promise().execute(getInfo, value)
    return row[0]
  },
}

module.exports = AttendanceModel;
