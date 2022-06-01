const UserModel = require('../models/UserModel')
const AttendanceModel = require('../models/AttendanceModel')
const LeaveModel = require('../models/LeaveModel')
const { stringToNumber, time12HrTo24Hr, time24HrTo12Hr } = require('../utilities/formater')

const DashboardController = {
  getDashboard: async (req, res) => {
    const [{ inTime }] = await AttendanceModel.getInTime()
    const [{ outTime }] = await AttendanceModel.getOutTime()

    const users = await UserModel.getAllUsersList()
    const totalUsers = users.length
    const isEndTimeNull = await AttendanceModel.getEndTimeIsNull()
    const totalActive = isEndTimeNull.length
    const requestLeaveList = await LeaveModel.requestLeaveList()
    const [{ totalLeaveToDay }] = await LeaveModel.todayLeaveUser()
    res.render('pages/dashboard', {
      totalUsers,
      totalActive,
      users,
      isEndTimeNull,
      requestLeaveList,
      inTime: time24HrTo12Hr(inTime),
      outTime: time24HrTo12Hr(outTime),
      totalLeaveToDay,
    });
  },
}
module.exports = DashboardController
