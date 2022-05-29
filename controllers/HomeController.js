const AttendanceModel = require('../models/AttendanceModel')
const LogModel = require('../models/LogModel')
const OptionsModel = require('../models/OptionsModel')
const { timeToHour } = require('../utilities/formater')
const OptionsController = require('./OptionsController')

const HomeController = {
  // Get today , this week history & today, this week total value from database
  getHome: async (req, res) => {
    const { user } = req

    const checkTodayReportEmptyOrNot = await LogModel.checkTodayReportEmptyOrNot(user.id)
    const [{ start }] = await AttendanceModel.todayStartTime(user.id)
    const [{ end }] = await AttendanceModel.todayEndTime(user.id)
    const projects = await OptionsModel.getProjects()
    const today = await AttendanceModel.getToday(user.id)
    const [tTotal] = await AttendanceModel.todayTotal(user.id)
    const [wTotal] = await AttendanceModel.weekTotal(user.id)
    let { todayTotal } = tTotal
    const { weekTotal } = wTotal
    todayTotal = timeToHour(todayTotal)
    const breakTime = today.length

    // is end time null
    const isEndTimeNull = await AttendanceModel.getEndTimeIsNull()

    res.render('pages/home', {
      start,
      end,
      breakTime,
      today,
      todayTotal,
      weekTotal,
      projects,
      checkTodayReportEmptyOrNot,
      isEndTimeNull,
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
  getUpdateOptionValues: async (req, res) => {
    try {
      const { optionId, optionValue } = req.body;
      const isUpdate = await OptionsModel.updateOptionValue(optionValue, optionId)
      if (isUpdate.errno) {
        res.send('Error')
      } else {
        res.redirect('/options')
      }
    } catch (err) {
      console.log('====>Error form OptionsController updateOptionValues', err);
    }
  },
}
module.exports = HomeController
