const LeaveModel = require('../models/LeaveModel');
const helperJs = require('../public/js/halper')

const LeaveController = {
  getAddLeavedayPage: async (req, res) => {
    const selectEmployee = await LeaveModel.selectEmployee();
    res.render('pages/addLeavedays', { selectEmployee })
  },
  addLeaveday: async (req, res) => {
    try {
      const {
        userId, start, end, reason,
      } = req.body
      const insertedLeaveday = await LeaveModel.addLeaveday(userId, helperJs.getDateFormat(start),
        helperJs.getDateFormat(end), reason)
      if (insertedLeaveday.errno) {
        res.send('Error')
      } else {
        res.redirect('/')
      }
    } catch (err) {
      console.log('====>Error form  LeaveController/addLeaveday', err);
    }
  },

}

module.exports = LeaveController;
