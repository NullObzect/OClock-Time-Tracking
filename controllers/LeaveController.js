/* eslint-disable max-len */
const LeaveModel = require('../models/LeaveModel');
const htmlTextMessage = require('./htmlMailText')
const sendMail = require('../utilities/sendMail');
const AttendanceModel = require('../models/AttendanceModel');

const {
  dateFormate, dateDiff,
} = require('../utilities/formater');
const { pageNumbers } = require('../utilities/pagination');

const LeaveController = {
  getAddLeavedayPage: async (req, res) => {
    const selectEmployee = await LeaveModel.selectEmployee();
    res.render('partials/add-leaveday-modal', { selectEmployee })
  },
  addLeaveday: async (req, res) => {
    try {
      const {
        userId, typeId, start, end,
      } = req.body
      const insertedLeaveday = await LeaveModel.addLeaveday(userId, typeId, dateFormate(start),
        dateFormate(end))
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
    const { user } = req
    let userId;
    if (req.params.id) {
      userId = req.params.id;
    } else {
      userId = user.id;
    }
    try {
      const employeeLeaveList = await LeaveModel.getEmployeeLeaveList()
      const selectEmployee = await LeaveModel.selectEmployee();
      const leaveTypeList = await LeaveModel.leaveTypeList();
      const anEmployeeLeavedaysList = await LeaveModel.anEmployeeLeaveList(user.id)
      const userInfo = await AttendanceModel.getEmployeeInfo(userId)
      console.log(anEmployeeLeavedaysList)
      res.render('pages/leavedays', {
        employeeLeaveList, anEmployeeLeavedaysList, selectEmployee, leaveTypeList, userInfo,
      })
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
    const requestLeaveList = await LeaveModel.requestLeaveList()
    try {
      res.render('pages/request-leave-list.ejs', { requestLeaveList })
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
  sendRequestLeave: async (req, res) => {
    const { user } = req
    const {
      typeId, start, end,
    } = req.body
    const [leaveTypeName] = await LeaveModel.leaveTypeFind(typeId)
    const totalLeaveDay = dateDiff(start, end)
    const email = process.env.ADMIN_MAIL
    try {
      const sendRequestLeave = await LeaveModel.sendRequestLeave(user.id, typeId, start, end)
      const subject = 'Request For leave'
      const textMessage = `${user.user_name} request for leave`
      const htmlMessage = htmlTextMessage.sendRequestLeave(user.user_name, leaveTypeName.name, start, end, totalLeaveDay)
      await sendMail(email, subject, textMessage, htmlMessage)
      res.redirect('/options/leavedays')
    } catch (error) {
      console.log(error)
    }
  },
  acceptRequestLeave: async (req, res) => {
    const { id } = req.params
    const [requestLeave] = await LeaveModel.requestLeaveFind(id)
    const {
      userId, userName, userMail, typeId, typeName, start, end, duration,
    } = requestLeave
    const addUserLeave = await LeaveModel.addLeaveday(userId, typeId, start, end)
    console.log(addUserLeave)
    try {
      const subject = 'Accept leave request'
      const textMessage = `${userName} leave request accepted`
      const htmlMessage = htmlTextMessage.acceptRequestLeave(userName, typeName, start, end, duration)
      if (addUserLeave.affectedRows) {
        await LeaveModel.requestLeaveDelete(id)
        sendMail(userMail, subject, textMessage, htmlMessage)
        res.redirect('/options/request-leave')
      }
    } catch (error) {
      console.log(error)
    }
  },
  rejectRequestLeave: async (req, res) => {
    const { id } = req.params
    const [requestLeave] = await LeaveModel.requestLeaveFind(id)
    const {
      userName, userMail, typeName, start, end, duration,
    } = requestLeave
    try {
      const subject = 'Reject leave request'
      const textMessage = `${userName} leave request rejected`
      const htmlMessage = htmlTextMessage.rejectRequestLeave(userName, typeName, start, end, duration)
      await LeaveModel.requestLeaveDelete(id)
      sendMail(userMail, subject, textMessage, htmlMessage)
      res.redirect('/options/request-leave')
    } catch (error) {
      console.log(error)
    }
  },
  editLeaveType: async (req, res) => {
    const data = req.body
    const entries = Object.entries(data)
    for (let i = 0; i < entries.length; i++) {
      const id = entries[i][0]
      const value = entries[i][1]
      await LeaveModel.editLeaveType(value, id)
    }
    res.redirect('/options/option-values')
  },

}

module.exports = LeaveController;
