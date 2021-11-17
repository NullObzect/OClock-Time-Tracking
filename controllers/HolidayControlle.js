const HolidayModel = require('../models/HolidayModel');

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
}
module.exports = HolidayController
