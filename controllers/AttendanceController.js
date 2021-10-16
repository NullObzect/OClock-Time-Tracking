const AttendanceModel = require('../models/AttendanceModel');

const AttendanceController = {

  attendanceStart: async (req, res) => {
    try {
      const { id } = req.user
      const { startTime } = req.body;
      console.log(startTime)

      const insertedAttendanceStart = await AttendanceModel.setAttendanceStart(id, startTime)
      if (insertedAttendanceStart.errno) {
        res.send('Error')
      } else {
        res.send('success ')
      }
    } catch (err) {
      console.log('====>Error form AttendanceController/userAttendance', err);
      return err;
    }
  },

  attendanceEnd: async (req, res) => {
    try {
      const { id } = req.user
      const { endTime } = req.body;
      console.log(endTime)

      const insertedAttendanceEnd = await AttendanceModel.setAttendanceEnd(id, endTime)
      if (insertedAttendanceEnd.errno) {
        res.send('Error')
      } else {
        res.send('success ')
      }
    } catch (err) {
      console.log('====>Error form AttendanceController/userAttendance', err);
      return err;
    }
  },

}

module.exports = AttendanceController
