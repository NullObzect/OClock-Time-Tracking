/* eslint-disable max-len */
const AttendanceModel = require('../models/AttendanceModel');
// const { timeToHour } = require('../utilities/formater')

const AttendanceController = {
  // Current start time value store in database
  attendanceStart: async (req, res) => {
    const { projectId, workDetails } = req.body
    try {
      const { id } = req.user
      const [{ inTime }] = await AttendanceModel.getInTime()
      const [{ outTime }] = await AttendanceModel.getOutTime()
      // const isId = await AttendanceModel.getCurrentDateUserId(id);
      // const isUserId = isId
      // console.log({ isUserId });

      // console.log('xxx', isUserId === undefined);
      // if (!isUserId) {
      //   await AttendanceModel.setAttendanceStart(id, inTime, outTime, projectId, workDetails)
      // } else if (isUserId) {
      //   await AttendanceModel.setAttendanceEnd(id)
      // }
      const insertedAttendanceStart = await AttendanceModel.setAttendanceStart(id, inTime, outTime, projectId, workDetails)
      const [result] = await AttendanceModel.getRunStartData(id)
      const { start } = result
      if (!insertedAttendanceStart) {
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
      const isId = await AttendanceModel.getCurrentDateUserId(id);
      const isUserId = isId
      const [{ start }] = await AttendanceModel.todayStartTime(id)

      await AttendanceModel.setAttendanceEnd(id)
      // count today total work time and store in database
      const isWorkTime = await AttendanceModel.getCurrentDateWorkTime(id)
      const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
      // const totalWorkTime = (isWorkTime);
      // console.log(typeof totalWorkTime);

      if (isUserId === undefined) {
        await AttendanceModel.insertLog(id)
      } else if (isUserId) {
        await AttendanceModel.updateLog(id)
        await AttendanceModel.updateLogTotalWorkTime(id, totalWorkTime)
      }

      const getTodayData = await AttendanceModel.getToday(id)
      const [todayTotalData] = await AttendanceModel.todayTotal(id)
      const [weekTotalData] = await AttendanceModel.weekTotal(id)
      const getWeekData = await AttendanceModel.getWeekHistory(id)
      const [{ end }] = await AttendanceModel.currentEndTime()
      const breakTime = getTodayData.length

      return res.json({
        start, end, breakTime, getTodayData, todayTotalData, weekTotalData, getWeekData,
      })
    } catch (err) {
      console.log('====>Error form AttendanceController/userAttendance', err);
      return err;
    }
  },
  updateEndTime: async (req, res) => {
    try {
      const { uId, endDate, endTime } = req.body
      const timeStamp = JSON.parse(JSON.stringify(`${endDate} ${endTime}`))
      await AttendanceModel.updateEndTime(uId, timeStamp)
      const isWorkTime = await AttendanceModel.getUpdateEndTimeWorkTime(uId, endDate)
      const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
      await AttendanceModel.setLogTotalWorkTimeAdmin(uId, totalWorkTime, endDate)
      res.redirect('/dashboard')
    } catch (err) {
      console.log('====>Error form AttendanceController', err);
    }
  },

}

module.exports = AttendanceController
