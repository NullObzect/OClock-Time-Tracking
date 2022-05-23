const LeaveModel = require('../models/LeaveModel');
const {
  dateFormate,
} = require('../utilities/formater');
const { pageNumbers } = require('../utilities/pagination')

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
      const leaveTypeList = await LeaveModel.leaveTypeList();
      const anEmployeeLeavedaysList = await LeaveModel.anEmployeeLeaveList(user.id)

      res.render('pages/leavedays', { employeeLeaveList, anEmployeeLeavedaysList, selectEmployee,leaveTypeList })
    } catch (err) {
      console.log('====>Error form LeaveController ', err);
    }
  },

  setLeaveData: async (req, res) => {
    try {
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
    } catch (error) {
      console.log('lea err', error)
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
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 2
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const dateRangeReport = getLeavedays.slice(startIndex, endIndex)

      console.log({ dateRangeReport });
      const pageLength = getLeavedays.length / limit

      // eslint-disable-next-line max-len
      const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
      const pageNumber = pageNumbers(numberOfPage, 2, page)

      res.json({
        reports: {
          dateRangeReport, pageNumber, numberOfPage, pageLength, page,
        },
      })
    } catch (err) {
      console.log('====>Error form LeaveController/getLeavedayListBetweenTwoDate', err);
    }
  },
  requestLeaveList: async (req, res) => {
    try {
      res.render('pages/request-leave-list.ejs')
    } catch (error) {
      console.log(error)
    }
  },
  addLeaveType: async (req, res) => {
    const { name, duration } = req.body
    console.log(name)
    try {
      const insertedLeavedayType = await LeaveModel.addLeaveType(name, duration)
      res.redirect('/options/option-values')
    } catch (error) {
      console.log(error)
    }
  },

}

module.exports = LeaveController;
