/* eslint-disable max-len */
/* eslint-disable no-undef */
const HolidayModel = require('../models/HolidayModel');
const UserModel = require('../models/UserModel')
const paginationCountPage = require('../utilities/paginationCountPage')

const {
  dateFormate,
} = require('../utilities/formater');

const HolidayController = {

  addHoliday: async (req, res) => {
    try {
      const { title, start, end } = req.body
      if (req.body.title === '') {
        res.redirect('/add-holiday')
      }
      const inserted = await HolidayModel.addHoliday(
        title,
        dateFormate(start),
        dateFormate(end),
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
    let holiday
    const { startDate, endDate } = req.query;
    if (startDate) {
      holiday = await HolidayModel.holidaysListBetweenTowDate(startDate, endDate)
    } else {
      holiday = await HolidayModel.holidaysList()
    }
    try {
      const [holidays, numberOfPage, page, pageNumber, limit] = paginationCountPage(req, holiday)
      const pathUrl = req.path
      res.render('pages/holiday', {
        holidays, numberOfPage, page, pageNumber, limit, pathUrl, startDate, endDate,
      })
    } catch (err) {
      console.log('====>Error form HolidayControlle/holidayList', err);
    }
  },

  getEditHolidayPage: async (req, res) => {
    global.hId = req.params.id;
    const holidayData = await HolidayModel.getHolidayData(hId)

    res.render('pages/editHoliday', { holidayData })
  },
  getUpdateHoliday: async (req, res) => {
    const {
      title, start, end, id,
    } = req.body

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
    const userId = user.id;
    const holidays = await HolidayModel.holidaysList()

    res.render('pages/employeeSeeHolidays', { holidays })
  },
}
module.exports = HolidayController
