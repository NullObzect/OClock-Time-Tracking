const HolidayModel = require('../models/HolidayModel');

const HolidayController = {

  getAddHolidayPage: async (req, res) => {
    res.render('pages/addHolidays')
  },
  addHoliday: async (req, res) => {
    try {
      const { title, start, end } = req.body
      const inserted = await HolidayModel.addHoliday(
        title,
        start,
        end,
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
