const AttendanceModel = require('../models/AttendanceModel')
const UserModel = require('../models/UserModel')

const DashboardController = {
  // Get today , this week history & today, this week total value from database
  getDashboard: async (req, res) => {
    const [user] = await UserModel.findUserByEmail(req.user.userMailFormDB)
    const [startData] = await AttendanceModel.getStartData(user.id)
    const weekHistory = await AttendanceModel.getWeekHistory(user.id)
    const today = await AttendanceModel.getToday(user.id)
    const [tTotal] = await AttendanceModel.todayTotal(user.id)
    const [wTotal] = await AttendanceModel.weekTotal(user.id)
    const { todayTotal } = tTotal
    const { weekTotal } = wTotal

    if (startData) {
      const { start } = startData
      res.render('pages/dashboard', {
        start, weekHistory, today, todayTotal, weekTotal,
      })
    } else {
      res.render('pages/dashboard', {
        start: 0, weekHistory, today, todayTotal, weekTotal,
      })
    }
  },
}
module.exports = DashboardController
