const LeaveModel = require('../models/LeaveModel');
//const helperJs = require('../public/js/halper')

const LeaveController = {
  getAddLeavedayPage: async (req, res) => {
    const selectEmployee = await LeaveModel.selectEmployee();
    res.render('partials/add-leaveday-modal', { selectEmployee })
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
        res.redirect('/options/leavedays')
      }
    } catch (err) {
      console.log('====>Error form  LeaveController/addLeaveday', err)
    }
  },
  employeeLeavedaysList: async (req, res) => {
    try {
      const employeeLeaveList = await LeaveModel.getEmployeeLeaveList()
      const selectEmployee = await LeaveModel.selectEmployee();

      res.render('pages/leavedays', { employeeLeaveList, selectEmployee })
    } catch (err) {
      console.log('====>Error form LeaveController ', err);
    }
  },
  getEditLeavePage: async (req, res) => {
    global.lId = req.params.id
    const selectEmployee = await LeaveModel.selectEmployee();
    const getData = await LeaveModel.getLeaveEditData(lId)

    res.render('pages/editLeave', { selectEmployee, getData })
  },

  setLeaveData: async (req, res) => {
    const id = lId
    const {
      userId, start, end, reason,
    } = req.body;
    const isEdit = await LeaveModel.setLeaveEditData(
      id,
      userId,
      helperJs.getDateFormat(start),
      helperJs.getDateFormat(end),
      reason,
      lId,
    )
    if (isEdit.errno) {
      res.send('Have an Error')
    } else {
      res.redirect('/leavedays-list')
    }
  },

}

module.exports = LeaveController;
