const LeaveModel = require('../models/LeaveModel');
const {
  dateFormate,
} = require('../utilities/formater');

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
      const insertedLeaveday = await LeaveModel.addLeaveday(userId, dateFormate(start),
        dateFormate(end), reason)
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
      const { user } = req
      const employeeLeaveList = await LeaveModel.getEmployeeLeaveList()
      const selectEmployee = await LeaveModel.selectEmployee();
      const anEmployeeLeavedaysList = await LeaveModel.anEmployeeLeaveList(user.id)

      res.render('pages/leavedays', { employeeLeaveList, anEmployeeLeavedaysList, selectEmployee })
    } catch (err) {
      console.log('====>Error form LeaveController ', err);
    }
  },

  setLeaveData: async (req, res) => {
    const {
      id, start, end, reason,
    } = req.body;
    const isEdit = await LeaveModel.setLeaveEditData(

      dateFormate(start),
      dateFormate(end),
      reason,
      id,
    )
    if (isEdit.errno) {
      res.send('Have an Error')
    } else {
      res.redirect('/options/leavedays')
    }
  },
  getDeleteLeaveday: async (req, res) => {
    try {
      const { id } = req.params
      const isDelete = await LeaveModel.deleteLeaveday(id)
      if (isDelete.errno) {
        res.send('Error')
      } else {
        res.redirect('/options/leavedays')
      }
    } catch (err) {
      console.log('====>Error form  LeaveController/getDeleteLeaveday', err);
    }
  },
  getLeavedayListBetweenTwoDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      console.log('startDate', startDate, endDate)

      const leavedays = await LeaveModel.leavedaysListBetweenTowDate(startDate, endDate)
      const getLeavedays = JSON.parse(JSON.stringify(leavedays))
      console.log({ getLeavedays });
      return res.json(getLeavedays)
    } catch (err) {
      console.log('====>Error form LeaveController/getLeavedayListBetweenTwoDate', err);
    }
  },

}

module.exports = LeaveController;
