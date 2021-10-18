const AttendanceModel = require('../models/AttendanceModel')
const UserModel = require('../models/UserModel')

const DashboardController = {
  getDashboard: async (req, res) => {
    console.log(req.user)
    const [user] = await UserModel.findUserByEmail(req.user.userMailFormDB)
    const [startData] = await AttendanceModel.getStartData(user.id)
    const history = await AttendanceModel.getHistory(user.id)
    const today = await AttendanceModel.getToday(user.id)
    const grandTotal = await AttendanceModel.getTodayTotal(user.id)
    console.log(grandTotal)
    console.log(history)
    if (startData) {
      const { start } = startData
      res.render('pages/dashboard', {
        start, history, today, grandTotal,
      })
    } else {
      res.render('pages/dashboard', {
        start: 0, history, today, grandTotal,
      })
    }
  },
}
module.exports = DashboardController
