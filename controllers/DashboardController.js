const AttendanceModel = require('../models/AttendanceModel')
const UserModel = require('../models/UserModel')
const OptionsModel = require('../models/OptionsModel')
const { timeToHour } = require('../utilities/formater')
const OptionsController = require('./OptionsController')

const DashboardController = {
  // Get today , this week history & today, this week total value from database
  getDashboard: async (req, res) => {
    const { user } = req
    // const [user] = await UserModel.findUserByEmail(req.user.user_mail)
    const [{ start }] = await AttendanceModel.todayStartTime(user.id)
    const [{ end }] = await AttendanceModel.todayEndTime(user.id)
    const projects = await OptionsModel.getProjects()
    const weekHistory = await AttendanceModel.getWeekHistory(user.id)
    const today = await AttendanceModel.getToday(user.id)
    const [tTotal] = await AttendanceModel.todayTotal(user.id)
    const [wTotal] = await AttendanceModel.weekTotal(user.id)
    let { todayTotal } = tTotal
    const { weekTotal } = wTotal
    todayTotal = timeToHour(todayTotal)
    const breakTime = today.length
    console.log(req.loggedInUser)
    res.render('pages/dashboard', {
      start, end, breakTime, weekHistory, today, todayTotal, weekTotal, projects,
    })
  },
  getRunStartData: async (req, res) => {
    try {
      const [{ start }] = await AttendanceModel.getRunStartData(req.user.id)
      res.json(start)
    } catch (err) {
      res.json(0)
    }
  },
}
module.exports = DashboardController
