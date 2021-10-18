const AttendanceModel = require('../models/AttendanceModel')
const UserModel = require('../models/UserModel')

const DashboardController = {
  getDashboard: async (req, res) => {
    console.log(req.user)
    const [user] = await UserModel.findUserByEmail(req.user.userMailFormDB)
    const [startData] = await AttendanceModel.getStartData(user.id)
    const weekHistory = await AttendanceModel.getWeekHistory(user.id)
    const today = await AttendanceModel.getToday(user.id)
    const todayTotal = await AttendanceModel.todayTotal(user.id)
    const weekTotal = await AttendanceModel.weekTotal(user.id)
    console.log(todayTotal)
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
