const dbConnect = require('../config/database');

const AttendanceModel = {

  setAttendanceStart: async (id, startTime) => {
    try {
      const sqlStart = 'INSERT INTO `attendance`(`user_id`,`start`) VALUES (?,?)';
      const values = [id, startTime]
      const [rows] = await dbConnect.promise().execute(sqlStart, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },

  setAttendanceEnd: async (id, endTime) => {
    try {
      const sqlEnd = 'UPDATE  attendance SET  end = ?, status = 0 WHERE user_id = ?  AND  status = 1';
      const values = [endTime, id]
      const [rows] = await dbConnect.promise().execute(sqlEnd, values);
      return rows;
    } catch (err) {
      console.log('====>Error form AttendanceModel/setAttendance', err);
      return err;
    }
  },
}

// sql query for  attendance

// SELECT	TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(end_time)))),  SEC_TO_TIME(SUM(TIME_TO_SEC(TIME(start_time))))) AS total_time  FROM attendance WHERE user_id = 9 AND DATE(create_at) = '2021-10-16'
module.exports = AttendanceModel;
