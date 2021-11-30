const HolidayModel = require('../models/HolidayModel');
const UserModel = require('../models/UserModel')

const helperJs = require('../public/js/halper')
// console.log(helperJs)

const HolidayController = {

  getAddHolidayPage: async (req, res) => {
    res.render('pages/addHolidays')
  },
  addHoliday: async (req, res) => {
    try {
      const { title, start, end } = req.body

      const inserted = await HolidayModel.addHoliday(
        title,
        helperJs.getDateFormat(start),
        helperJs.getDateFormat(end),
      )
      if (inserted.errno) {
        res.send('Error')
      } else {
        res.redirect('/')
      }
    } catch (err) {
      console.log('====>Error form HolidayControlle/addHoliday', err);
    }
  },
  holidayList: async (req, res) => {
    try {
     
      const holidays = await HolidayModel.holidaysList()
      res.render('pages/holidays', { holidays })
    } catch (err) {
      console.log('====>Error form HolidayControlle/holidayList', err);
    }
  },
  getEditHolidayPage: async (req, res) => {
    global.hId = req.params.id;
    const holidayData = await HolidayModel.getHolidayData(hId)
    console.log({ holidayData })

    res.render('pages/editHoliday', { holidayData })
  },
  getUpdateHoliday: async (req, res) => {
    const id = hId;
    const { title, start, end } = req.body
    const isUpdate = await HolidayModel.updateHoliday(
      id,
      title,
      helperJs.getDateFormat(start),
      helperJs.getDateFormat(end),
      hId,
    )
    if (isUpdate.errno) {
      res.send('Have Error')
    } else {
      res.redirect('/holiday-list')
    }
  },
  getDeleteHoliday: async (req, res) => {
    const getId = req.params.id
    const isDelete = await HolidayModel.deleteHoliday(getId)
    if (isDelete.errno) {
      res.send('Have Error')
    } else {
      res.redirect('/holiday-list')
    }
  },
  employeeSeeHolidays: async (req, res) => {
    const [user] = await UserModel.findUserByEmail(req.user.userMailFormDB)
    console.log({ user })

    const userId = user.id;
    console.log(userId)
    const holidays = await HolidayModel.holidaysList()

    res.render('pages/employeeSeeHolidays', { holidays })
  },
}
module.exports = HolidayController
