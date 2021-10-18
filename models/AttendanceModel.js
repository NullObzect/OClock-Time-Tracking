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
      const sqlEnd = 'UPDATE  attendance SET  end = CURRENT_TIMESTAMP, status = 0 WHERE user_id = ?  AND  status = 1';
      const values = [id]
      const [rows] = await dbConnect.promise().execute(sqlEnd, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
  getStartData: async (userId) => {
    const getStartSql = 'SELECT start FROM `attendance` WHERE user_id =? and status =1'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getStartSql, value);
    return rows;
  },
  getHistory: async (userId) => {
    const getHistory = 'SELECT Date(create_at) as Dates ,Time(start) as start , Time(end) as end, timediff(end,start ) as total FROM attendance WHERE user_id = ? and status = 0'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getHistory, value);
    return rows;
  },
  getToday: async (userId) => {
    const getTodaySql = 'SELECT  Time(start) as start , Time(end) as end, timediff(end,start ) as total FROM attendance WHERE user_id = ? and status = 0 and Date(create_at)= Date(CURRENT_DATE)'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(getTodaySql, value);
    return rows;
  },
  getTodayTotal: async (userId) => {
    const todayTotalSql = 'SELECT TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end)))), SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start))))) as grandTotal FROM  attendance WHERE user_id = ? and status = 0 and Date(create_at)= Date(CURRENT_DATE)'
    const value = [userId]
    const [rows] = await dbConnect.promise().execute(todayTotalSql, value);
    return rows;
  },
}

// sql query for  attendance

// SELECT	TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end_time)))),  SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start_time))))) AS total_time  FROM attendance WHERE user_id = 9 AND DATE(create_at) = '2021-10-16'
module.exports = AttendanceModel;
