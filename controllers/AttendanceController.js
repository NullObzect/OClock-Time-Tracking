/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */

const AttendanceModel = require('../models/AttendanceModel');
const OptionsModel = require('../models/OptionsModel');
const { stringToNumber, time12HrTo24Hr } = require('../utilities/formater')

const UserModel = require('../models/UserModel');
// const { timeToHour } = require('../utilities/formater')

const convertTime = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
};

const AttendanceController = {
  // Current start time value store in database
  attendanceStart: async (req, res) => {
    const { projectId, workDetails } = req.body
    try {
      const [{ offDayValues }] = await OptionsModel.getOffDaysValue();
      const { id } = req.user
      const [{ inTime }] = await AttendanceModel.getInTime()
      const [{ outTime }] = await AttendanceModel.getOutTime()
      const isId = await AttendanceModel.getCurrentDateUserId(id);
      const isUserId = isId
      const insertedAttendanceStart = await AttendanceModel.setAttendanceStart(id, inTime, outTime, projectId, workDetails)
      //
      if (isUserId === undefined) {
        await AttendanceModel.insertLog(stringToNumber(offDayValues), id)
      }
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
      const { userId, date, endTime } = req.body
      const covertEndTime = convertTime(endTime)
      const timeStamp = JSON.parse(JSON.stringify(`${date} ${covertEndTime}`))
      await AttendanceModel.updateEndTime(userId, date, timeStamp)
      await AttendanceModel.updateEndTimeForLog(userId, timeStamp)
      const isWorkTime = await AttendanceModel.getUpdateEndTimeWorkTime(userId, date)
      const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
      await AttendanceModel.setLogTotalWorkTimeAdmin(userId, totalWorkTime, date)
      res.redirect('/home')
    } catch (err) {
      console.log('====>Error form AttendanceController', err);
    }
  },

  updateStartTime: async (req, res) => {
    try {
      const { userId, startTime, date } = req.body
      const { aId } = await AttendanceModel.getMinStartTime(userId, date)
      const { logUpdateId } = await AttendanceModel.getUpdateLogStartTimeId(userId, date)
      const covertStartTime = convertTime(startTime)
      const timeStamp = JSON.parse(JSON.stringify(`${date} ${covertStartTime}`))
      await AttendanceModel.setStartTime(aId, date, timeStamp)
      await AttendanceModel.setStartTimeForLog(logUpdateId, date, timeStamp)

      res.status(200).json('success')
    } catch (err) {
      console.log('====>Error form AttendanceController', err);
    }
  },
  // attendance entry & exit API

  attendanceEntryOrExitsAPI: async (req, res) => {
    const data = req.body
    const [{ inTime }] = await AttendanceModel.getInTime()
    const [{ outTime }] = await AttendanceModel.getOutTime()
    const objectLength = Object.keys(data).length;

    for (let i = 0; i < objectLength; i += 1) {
      setTimeout(async () => {
        const { finger_id: fingerId, time } = data[i];
        console.log({ fingerId, time });
        const user = await UserModel.userFindByFingerId(fingerId)
        const [{ offDayValues }] = await OptionsModel.getOffDaysValue();
        const timeStamp = JSON.parse(JSON.stringify(`${time}`))

        try {
          if (user.length > 0) {
            const fingeIdArray = []
            user.map((u) => {
              const { fingerID } = u
              const fingeId = fingerID.split(',')
              fingeIdArray.push(fingeId)
            })
            const index = fingeIdArray.findIndex((arr) => arr.includes(fingerId.toString()))
            const person = user[index]
            const userID = person.id

            const isId = await AttendanceModel.getCurrentDateUserIdInAttendanceForAPI(userID, timeStamp);
            const getCurDateAttendanceIdWithOutTime = await AttendanceModel.getCurrentDateUserIdInAttendanceWithOutTimeForAPI(userID);

            /* =======  FIXME: time is null start ========= */

            if (time === undefined || time === null) {
              if (getCurDateAttendanceIdWithOutTime === undefined) {
                await AttendanceModel.setAttendanceStart(userID, inTime, outTime, 0, 'Entry')
                await AttendanceModel.insertLog(stringToNumber(offDayValues), userID)
              } else if (getCurDateAttendanceIdWithOutTime !== undefined) {
                const { endTimeIsNullWithOutTime } = await AttendanceModel.isAttendanceEndTimeNullAPIWithOutTime(userID)

                if (endTimeIsNullWithOutTime === 1) {
                  await AttendanceModel.setAttendanceEnd(userID)
                  await AttendanceModel.setLogEndForAPI(userID)
                  const isWorkTime = await AttendanceModel.getCurrentDateWorkTime(userID)
                  const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
                  await AttendanceModel.updateLog(userID)
                  await AttendanceModel.updateLogTotalWorkTime(userID, totalWorkTime)
                } else if (endTimeIsNullWithOutTime === 0) {
                  await AttendanceModel.setAttendanceStart(userID, inTime, outTime, 0, 'Entry')
                }
              }
              res.json('success')
            }
            /* ========= FIXME: time is null end ====== */

            /* =========  TODO: this block work for required time ======= */
            if (isId === undefined && time !== undefined) {
              await AttendanceModel.setAttendanceStartForAPI(userID, inTime, outTime, 0, 'Entry', timeStamp)
              const isIdInLog = await AttendanceModel.getCurrentDateUserIdForAPI(userID, timeStamp);
              if (isIdInLog === undefined) {
                await AttendanceModel.insertLog(stringToNumber(offDayValues), userID)
                await AttendanceModel.setLogStartTimeForAPI(userID, timeStamp)
              }
            } else if (isId !== undefined && time !== undefined) {
              const { endTimeIsNull } = await AttendanceModel.isAttendanceEndTimeNullAPI(userID, timeStamp)
              if (endTimeIsNull === 1) {
                await AttendanceModel.setAttendanceEndTimeForAPI(userID, timeStamp)
                await AttendanceModel.updateLogEndTimeForAPI(timeStamp, userID)
                const isWorkTime = await AttendanceModel.calculateTotalWorkTimeAPI(userID, timeStamp)
                const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
                await AttendanceModel.updateLogTotalWorkTimeAPI(userID, totalWorkTime, timeStamp)
              } else if (endTimeIsNull === 0) {
                await AttendanceModel.setAttendanceStartForAPI(userID, inTime, outTime, 0, 'Entry', timeStamp)
              }
            }
            res.json('success')
          } else {
            res.json('User Not Found')
          }
        } catch (error) {
          console.log(error)
        }
      }, 1000 * i)
    }
  },

  checkIsExistAttendance: async (req, res) => {
    try {
      const { userId, date } = req.query

      const isExist = await AttendanceModel.isExistCurrentDateUserId(date, userId)
      if (isExist !== undefined) {
        return res.json(isExist)
      }
    } catch (err) {
      console.log('====>Error form/ checkIsExistAttendance controllers', err);
    }
  },

  manualAttendance: async (req, res) => {
    try {
      // default values
      const [{ offDayValues }] = await OptionsModel.getOffDaysValue();
      const [{ inTime }] = await AttendanceModel.getInTime()
      const [{ outTime }] = await AttendanceModel.getOutTime()

      const {
        userId, date, startTime, endTime, getInTime, getOutTime,
      } = req.body
      const isExist = await AttendanceModel.isExistCurrentDateUserIdForManualInput(date, userId);
      if (isExist !== undefined) {
        // return res.json('Already Exist')
        res.status(200).json('Already Exist')
      }
      if (startTime === '' && endTime !== '') {
        // return res.json('Please Enter Start Time')
        res.status(200).json('Please Enter Start Time')
      }
      const timeStampForStart = JSON.parse(JSON.stringify(`${date} ${time12HrTo24Hr(startTime)}`))
      const timeStampForEnd = JSON.parse(JSON.stringify(`${date} ${time12HrTo24Hr(endTime)}`))

      const getLocalCurTime = Date().slice(16, 21);
      const getLocalCurTimeStamp = JSON.parse(JSON.stringify(`${date} ${getLocalCurTime}`))
      // for manual entry
      if (startTime === undefined || startTime === '') {
        await AttendanceModel.setAttendanceStartForAPI(userId, time12HrTo24Hr(getInTime) || inTime, time12HrTo24Hr(getOutTime) || outTime, 0, 'Manual Entry', getLocalCurTimeStamp)

        const isUserId = await AttendanceModel.isExistCurrentDateUserIdForManualInput(date, userId);

        if (isUserId === undefined) {
          await AttendanceModel.insertLogForManual(stringToNumber(offDayValues), date, userId)
        }
        res.json('success')
      } else if (startTime !== undefined || startTime !== '') {
        await AttendanceModel.setAttendanceStartForAPI(userId, time12HrTo24Hr(getInTime) || inTime, time12HrTo24Hr(getOutTime) || outTime, 0, 'Manual Entry', timeStampForStart)
        const isUserId = await AttendanceModel.isExistCurrentDateUserIdForManualInput(date, userId);
        if (isUserId === undefined) {
          await AttendanceModel.insertLogForManual(stringToNumber(offDayValues), date, userId)
        }
        res.json('success')
      } else if (startTime !== '' && endTime !== '') {
        await AttendanceModel.setAttendanceForManualInput(userId, time12HrTo24Hr(getInTime) || inTime, time12HrTo24Hr(getOutTime) || outTime, 0, 'Manual Entry', timeStampForStart, timeStampForEnd)
        const isUserId = await AttendanceModel.isExistCurrentDateUserIdForManualInput(date, userId);

        if (isUserId === undefined) {
          const isWorkTime = await AttendanceModel.getUpdateEndTimeWorkTime(userId, date)
          const { totalWorkTime } = JSON.parse(JSON.stringify(isWorkTime))
          await AttendanceModel.insertLogForManual(stringToNumber(offDayValues), date, userId)
          await AttendanceModel.updateLogForManualInput(userId, timeStampForEnd, totalWorkTime)
        }
        res.json('success')
      }
    } catch (err) {
      console.log('====>Error form manualAttendance/ controllers', err);
    }
  },

}

module.exports = AttendanceController
