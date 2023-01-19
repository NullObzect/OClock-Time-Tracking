/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const LeaveModel = require('../models/LeaveModel');
const htmlTextMessage = require('./htmlMailText')
const sendMail = require('../utilities/sendMail');
const AttendanceModel = require('../models/AttendanceModel');
const paginationCountPage = require('../utilities/paginationCountPage')

const {
  dateFormate, dateDiff,
} = require('../utilities/formater');
const { pageNumbers } = require('../utilities/pagination');
const OptionsModel = require('../models/OptionsModel');
const UserModel = require('../models/UserModel');

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
      const insertedLeaveday = await LeaveModel.addLeaveday(
        userId,
        typeId,
        dateFormate(start),
        dateFormate(end),
      )
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
    let userId = user.id;
    let searchID
    if (req.params.id) {
      userId = req.params.id;
      searchID = userId
    }
    const { startDate, endDate } = req.query;
    let userReport; let numberOfPage; let page; let pageNumber;
    let limit
    let employeeLeaveLists;
    let anEmployeeLeavedaysLists;

    try {
      employeeLeaveLists = await LeaveModel.getEmployeeLeaveList()
      const selectEmployee = await LeaveModel.selectEmployee();
      const leaveTypeList = await LeaveModel.leaveTypeList();
      anEmployeeLeavedaysLists = await LeaveModel.anEmployeeLeaveList(userId)
      const anEmployeeRequestLeaveList = await LeaveModel.anEmployeeRequestLeaveList(userId)

      const userInfo = await AttendanceModel.getEmployeeInfo(userId)
      const [{ joinThisYearOrNot }] = await LeaveModel.checkUserJoinThisYearOrNot(userId)

      if (startDate) {
        employeeLeaveLists = await LeaveModel.leavedaysListBetweenTowDate(startDate, endDate)
        anEmployeeLeavedaysLists = await LeaveModel.leavedaysListBetweenTowDateWithId(userId, startDate, endDate)
      }

      // console.log({
      //   userReport, numberOfPage, page, pageNumber, limit,
      // })

      if (user.user_role == 'admin' && req.params.id === undefined) {
        [userReport, numberOfPage, page, pageNumber, limit] = paginationCountPage(req, employeeLeaveLists)
      } else if (req.params.id) {
        [userReport, numberOfPage, page, pageNumber, limit] = paginationCountPage(req, anEmployeeLeavedaysLists)
      } else {
        [userReport, numberOfPage, page, pageNumber, limit] = paginationCountPage(req, anEmployeeLeavedaysLists)
      }
      const pathUrl = req._parsedOriginalUrl.pathname

      if (joinThisYearOrNot === 0) {
        const [{ totalLeaveDay }] = await OptionsModel.getTotalLeaveDay(userId)
        const totalLeaveDayLimit = totalLeaveDay
        const leaveLimitReport = await LeaveModel.leaveLimitReport(userId)
        const [{ countLeave }] = await LeaveModel.leaveLimitCount(userId)
        const [{ countUnpaidLeave }] = await LeaveModel.countUnpaidLeave(userId)

        const getTotalLeave = Number(countLeave - countUnpaidLeave || 0)
        //  console.log('admin', { userReport })
        res.render('pages/leavedays', {
          userReport,
          numberOfPage,
          page,
          pageNumber,
          limit,
          pathUrl,
          selectEmployee,
          leaveTypeList,
          userInfo,
          totalLeaveDayLimit,
          leaveLimitReport,
          countLeave,
          getTotalLeave,
          searchID,
          startDate,
          endDate,
          anEmployeeRequestLeaveList,

        })
      } else {
        const [{ totalLeaveDay }] = await OptionsModel.getTotalLeaveDay(userId)
        const totalLeaveDayLimit = Number(totalLeaveDay - joinThisYearOrNot)
        const leaveLimitReport = await LeaveModel.leaveLimitReportJointCurrentYearUser(userId)
        const [{ countLeave }] = await LeaveModel.leaveLimitCountJointCurrentYearUser(userId)
        const [{ countUnpaidLeave }] = await LeaveModel.leaveLimitCountUnpaidLeaveCurrentYearUser(userId)
        const getTotalLeave = Number(countLeave - countUnpaidLeave || 0)
        res.render('pages/leavedays', {
          userReport,
          numberOfPage,
          page,
          pageNumber,
          limit,
          pathUrl,
          selectEmployee,
          leaveTypeList,
          userInfo,
          totalLeaveDayLimit,
          leaveLimitReport,
          countLeave,
          getTotalLeave,
          searchID,
          startDate,
          endDate,
          anEmployeeRequestLeaveList,
        })
      }
    } catch (err) {
      console.log('====>Error form LeaveController ', err);
    }
  },

  setLeaveData: async (req, res) => {
    try {
      const {
        id, start, end,
      } = req.body;
      console.log('edit', req.body);
      const isEdit = await LeaveModel.setLeaveEditData(

        dateFormate(start),
        dateFormate(end),
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
        return res.json({ response: 'error' })
      }
      return res.redirect('/options/leavedays')
    } catch (err) {
      console.log('====>Error form  LeaveController/getDeleteLeaveday', err);
    }
  },
  getLeavedayListBetweenTwoDate: async (req, res) => {
    const { id } = req.params
    let leavedays;
    const [userInfo] = await UserModel.findId(id)
    const admin = userInfo.user_role == 'admin'

    try {
      const { startDate, endDate } = req.query;
      if (admin) {
        leavedays = await LeaveModel.leavedaysListBetweenTowDate(startDate, endDate)
      } else {
        leavedays = await LeaveModel.leavedaysListBetweenTowDateWithId(id, startDate, endDate)
      }

      const getLeavedays = JSON.parse(JSON.stringify(leavedays))
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || process.env.PAGINATION_ROW || 10
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const dateRangeReport = getLeavedays.slice(startIndex, endIndex)

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
      const mailsend = await sendMail(email, subject, textMessage, htmlMessage)
      return res.redirect('/options/leavedays')
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
  acceptEachRequest: async (req, res) => {
    const requestLeaveList = await LeaveModel.requestLeaveList()

    // const

    for (let i = 0; i < requestLeaveList.length; i += 1) {
      //  console.log(requestLeaveList[i].id)
      const [requestLeave] = await LeaveModel.requestLeaveFind(requestLeaveList[i].id)

      //  console.log({ requestLeave });
      const {
        userId, userName, userMail, typeId, typeName, start, end, duration,
      } = requestLeave

      console.log({ userId });
      const addUserLeave = await LeaveModel.addLeaveday(userId, typeId, start, end)
      try {
        const subject = 'Accept leave request'
        const textMessage = `${userName} leave request accepted`
        const htmlMessage = htmlTextMessage.acceptRequestLeave(userName, typeName, start, end, duration)
        if (addUserLeave.affectedRows) {
          await LeaveModel.requestLeaveDelete(requestLeaveList[i].id)
          sendMail(userMail, subject, textMessage, htmlMessage)
          //  res.redirect('/options/request-leave')
        }
      } catch (error) {
        console.log(error)
      }
    }

    res.redirect('/options/request-leave')
  },

}

module.exports = LeaveController;
