const AttendanceModel = require('../models/AttendanceModel')
const UserModel = require('../models/UserModel')

const DashboardController = {
  // Get today , this week history & today, this week total value from database
  getDashboard: async (req, res) => {
    const [user] = await UserModel.findUserByEmail(req.user.userMailFormDB)
    const weekHistory = await AttendanceModel.getWeekHistory(user.id)
    const today = await AttendanceModel.getToday(user.id)
    const [tTotal] = await AttendanceModel.todayTotal(user.id)
    const [wTotal] = await AttendanceModel.weekTotal(user.id)
    const { todayTotal } = tTotal
    const { weekTotal } = wTotal

    res.render('pages/dashboard', {
      weekHistory, today, todayTotal, weekTotal,
    })
  },
  // getRunStartData: async (req, res) => {
  //   const [{ start }] = await AttendanceModel.getRunStartData(req.user.id)
  //   res.json(start)
  // },
}
module.exports = DashboardController
