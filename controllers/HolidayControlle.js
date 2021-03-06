/* eslint-disable max-len */
/* eslint-disable no-undef */
const HolidayModel = require('../models/HolidayModel');
const UserModel = require('../models/UserModel')
const { pageNumbers } = require('../utilities/pagination')
const paginationCountPage = require('../utilities/paginationCountPage')

// const helperJs = require('../public/js/halper')
const Flash = require('../utilities/Flash')
// console.log(helperJs)
const {
  dateFormate,
} = require('../utilities/formater');

const HolidayController = {

  addHoliday: async (req, res) => {
    try {
      const { title, start, end } = req.body
      if (req.body.title === '') {
        console.log('tittle error')
        req.flash('fail', 'please input fill up')
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
    console.log(startDate, endDate)
    if (startDate) {
      holiday = await HolidayModel.holidaysListBetweenTowDate(startDate, endDate)
    } else {
      holiday = await HolidayModel.holidaysList()
    }

    try {
      const [holidays, numberOfPage, page, pageNumber, limit] = paginationCountPage(req, holiday)
      const pathUrl = req.path.replace('/', '')
      res.render('pages/holiday', {
        holidays, numberOfPage, page, pageNumber, limit, pathUrl, startDate, endDate,
      })
    } catch (err) {
      console.log('====>Error form HolidayControlle/holidayList', err);
    }
  },
  getHolidayListBetweenTwoDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const holidays = await HolidayModel.holidaysListBetweenTowDate(startDate, endDate)
      console.log({ holidays })
      const getHoliday = JSON.parse(JSON.stringify(holidays))
      // for pagination
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || process.env.PAGINATION_ROW
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const dateRangeReport = getHoliday.slice(startIndex, endIndex)

      const pageLength = getHoliday.length / limit

      const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
      const pageNumber = pageNumbers(numberOfPage, 2, page)

      // const [holidays, numberOfPage, page, pageNumber, limit] = paginationCountPage(req, holiday)

      res.json({
        reports: {
          dateRangeReport, pageNumber, numberOfPage, pageLength, page,
        },
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
    console.log(userId)
    const holidays = await HolidayModel.holidaysList()

    res.render('pages/employeeSeeHolidays', { holidays })
  },
}
module.exports = HolidayController
