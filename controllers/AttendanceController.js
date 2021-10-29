const AttendanceModel = require('../models/AttendanceModel');

const AttendanceController = {
  // Current start time value store in database
  attendanceStart: async (req, res) => {
    try {
      const { id } = req.user
      const insertedAttendanceStart = await AttendanceModel.setAttendanceStart(id)
      const [result] = await AttendanceModel.getStartData(id)
      const { start } = result
      if (insertedAttendanceStart.errno) {
        return res.send('Error')
      }
      return res.json(start)
    } catch (err) {
      console.log('====>Error form AttendanceController/userAttendance', err);
      return err;
    }
  },
  // Current end time value store in database
  attendanceEnd: async (req, res) => {
    try {
      const { id } = req.user
      const insertedAttendanceEnd = await AttendanceModel.setAttendanceEnd(id)
      const getTodayData = await AttendanceModel.getToday(id)
      const [todayTotalData] = await AttendanceModel.todayTotal(id)
      const [weekTotalData] = await AttendanceModel.weekTotal(id)
      const getWeekData = await AttendanceModel.getWeekHistory(id)
      if (insertedAttendanceEnd.errno) {
        return res.send('Error')
      }
      return res.json({
        getTodayData, todayTotalData, weekTotalData, getWeekData,
      })
    } catch (err) {
      console.log('====>Error form AttendanceController/userAttendance', err);
      return err;
    }
  },
}

module.exports = AttendanceController
