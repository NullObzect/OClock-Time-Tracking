const UserModel = require('../models/UserModel')
const AttendanceModel = require('../models/AttendanceModel')
const LeaveModel = require('../models/LeaveModel')

const DashboardController = {
  getDashboard: async (req, res) => {
    const users = await UserModel.getAllUsersList()
    const totalUsers = users.length
    const isEndTimeNull = await AttendanceModel.getEndTimeIsNull()
    const totalActive = isEndTimeNull.length
    const requestLeaveList = await LeaveModel.requestLeaveList()
    const [{ totalLeaveToDay }] = await LeaveModel.todayLeaveUser()
    res.render('pages/dashboard', {
      totalUsers, totalLeaveToDay, totalActive, users, isEndTimeNull, requestLeaveList,
    })
  },
}
module.exports = DashboardController
