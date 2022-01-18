/* eslint-disable max-len */
const AttendanceModel = require('../models/AttendanceModel');
// const { timeToHour } = require('../utilities/formater')

const AttendanceController = {
  // Current start time value store in database
  attendanceStart: async (req, res) => {
    const { projectId, workDetails } = req.body
    try {
      const { id } = req.user
      const insertedAttendanceStart = await AttendanceModel.setAttendanceStart(id, projectId, workDetails)
      const [result] = await AttendanceModel.getRunStartData(id)
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
      const [{ start }] = await AttendanceModel.todayStartTime(id)
      const insertedAttendanceEnd = await AttendanceModel.setAttendanceEnd(id)
      const getTodayData = await AttendanceModel.getToday(id)
      const [todayTotalData] = await AttendanceModel.todayTotal(id)
      const [weekTotalData] = await AttendanceModel.weekTotal(id)
      const getWeekData = await AttendanceModel.getWeekHistory(id)
      const [{ end }] = await AttendanceModel.currentEndTime()
      const breakTime = getTodayData.length

      if (insertedAttendanceEnd.errno) {
        return res.send('Error')
      }
      return res.json({
        start, end, breakTime, getTodayData, todayTotalData, weekTotalData, getWeekData,
      })
    } catch (err) {
      console.log('====>Error form AttendanceController/userAttendance', err);
      return err;
    }
  },

}

module.exports = AttendanceController
