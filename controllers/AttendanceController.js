/* eslint-disable max-len */
const AttendanceModel = require('../models/AttendanceModel');
const LogModel = require('../models/LogModel');
const OptionsModel = require('../models/OptionsModel');

// const { timeToHour } = require('../utilities/formater')

const AttendanceController = {
  // Current start time value store in database
  attendanceStart: async (req, res) => {
    const { projectId, workDetails } = req.body
    try {
      //
      function stringToNumber(s) {
        if (s.length > 0) {
          return s.replace(/,/, ',')
        }
        return ''
      }
      const [{ offDayValues }] = await OptionsModel.getOffDaysValue();

      //
      const { id } = req.user
      const [{ inTime }] = await AttendanceModel.getInTime()
      const [{ outTime }] = await AttendanceModel.getOutTime()

      console.log(inTime, outTime)

      // new

      const isId = await AttendanceModel.getCurrentDateUserId(id);
      const isUserId = isId
      //

      const insertedAttendanceStart = await AttendanceModel.setAttendanceStart(id, inTime, outTime, projectId, workDetails)
      //
      if (isUserId === undefined) {
        await AttendanceModel.insertLog(stringToNumber(offDayValues), id)
      }

      //
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
      if (isUserId) {
        await AttendanceModel.updateLog(id)
        await AttendanceModel.updateLogTotalWorkTime(id, totalWorkTime)
      }

      const getTodayData = await AttendanceModel.getToday(id)
      const [todayTotalData] = await AttendanceModel.todayTotal(id)
      const [weekTotalData] = await AttendanceModel.weekTotal(id)
      const getWeekData = await AttendanceModel.getWeekHistory(id)
      const [{ end }] = await AttendanceModel.currentEndTime()
      const breakTime = getTodayData.length
      console.log('sss', start)
      console.log('today total', todayTotalData)

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
      console.log('req.body', req.body);

      const { userId, date, endTime } = req.body

      const timeStamp = JSON.parse(JSON.stringify(`${date} ${endTime}`))
      await AttendanceModel.updateEndTime(userId, timeStamp)
      await AttendanceModel.updateEndTimeForLog(userId, timeStamp)

      const isWorkTime = await AttendanceModel.getUpdateEndTimeWorkTime(userId, date)
      const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
      console.log('totalWorkTime', totalWorkTime)
      await AttendanceModel.setLogTotalWorkTimeAdmin(userId, totalWorkTime, date)
      res.redirect('/dashboard')
    } catch (err) {
      console.log('====>Error form AttendanceController', err);
    }
  },

  updateStartTime: async (req, res) => {
    try {
      console.log('updateStartTime', req.body)
      const { userId, startTime, date } = req.body
      const { aId } = await AttendanceModel.getMinStartTime(userId)
      const { logUpdateId } = await AttendanceModel.getUpdateLogStartTimeId(userId)
      console.log({ logUpdateId });

      // const [{ start }] = getMinStartTime
      console.log('getMinStartTime', aId);

      const timeStamp = JSON.parse(JSON.stringify(`${date} ${startTime}`))
      await AttendanceModel.setStartTime(aId, timeStamp)
      await AttendanceModel.setStartTimeForLog(logUpdateId, timeStamp)

      res.status(200).json('success')
    } catch (err) {
      console.log('====>Error form AttendanceController', err);
    }
  },

}

module.exports = AttendanceController
