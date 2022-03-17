const HolidayModel = require('../models/HolidayModel');
const UserModel = require('../models/UserModel')

// const helperJs = require('../public/js/halper')
const Flash = require('../utilities/Flash')
// console.log(helperJs)
const {
  dateFormate,
} = require('../utilities/formater');

const HolidayController = {

  getAddHolidayPage: async (req, res) => {
    console.log('message', req.flash('fail'))
    res.render('pages/addHolidays')
  },
  addHoliday: async (req, res) => {
    try {
      const { title, start, end } = req.body
      if (req.body.title == '') {
        console.log('tittle error')
        req.flash('fail', 'please input fill up')
        res.redirect('/add-holiday')
      }
      const inserted = await HolidayModel.addHoliday(
        title,
        helperJs.getDateFormat(start),
        helperJs.getDateFormat(end),
      )
      if (inserted.errno) {
        res.send('Error')
      } else {
        res.redirect('/options/holiday')
      }
    } catch (err) {
      console.log('====>Error form HolidayControlle/addHoliday', err);
    }
  },
  holidayList: async (req, res) => {
    try {
      const holidays = await HolidayModel.holidaysList()
      res.render('pages/holiday', { holidays })
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
    const {
      title, start, end, id,
    } = req.body
    console.log(req.body);

    const isUpdate = await HolidayModel.updateHoliday(
      id,
      title,
      dateFormate(start),
      dateFormate(end),

    )
    if (isUpdate.errno) {
      res.send('Have Error')
    } else {
      res.redirect('/options/holiday')
    }
  },
  getDeleteHoliday: async (req, res) => {
    const getId = req.params.id
    const isDelete = await HolidayModel.deleteHoliday(getId)
    if (isDelete.errno) {
      res.send('Have Error')
    } else {
      res.redirect('/options/holiday')
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
