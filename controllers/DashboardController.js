const axios = require('axios')
const UserModel = require('../models/UserModel')
const AttendanceModel = require('../models/AttendanceModel')
const LeaveModel = require('../models/LeaveModel')
const LogModel = require('../models/LogModel')
const { time24HrTo12Hr } = require('../utilities/formater')

const DashboardController = {
  getDashboard: async (req, res) => {
    const [{ inTime }] = await AttendanceModel.getInTime()
    const [{ outTime }] = await AttendanceModel.getOutTime()

    const users = await UserModel.getAllUsersList()
    const totalUsers = users.length
    const isEndTimeNull = await AttendanceModel.getEndTimeIsNull()
    const totalActive = isEndTimeNull.length
    const requestLeaveList = await LeaveModel.requestLeaveList()
    const [{ totalLeaveToDay }] = await LeaveModel.todayLeaveUser()
    const todayEmployeesRecord = await LogModel.todayEmployeesRecord()

    res.render('pages/dashboard', {
      totalUsers,
      totalActive,
      users,
      isEndTimeNull,
      requestLeaveList,
      inTime: time24HrTo12Hr(inTime),
      outTime: time24HrTo12Hr(outTime),
      totalLeaveToDay,
      todayEmployeesRecord,
    });
  },
  userTodayDetailsForAdmin: async (req, res) => {
    const { id } = req.params
    const todayWorkList = await AttendanceModel.getToday(id)
    const api = await axios.get(`${process.env.BASE_URL}/dashboard/user-report/${id}`)
    const userReport = api.data
    const {
      userInfo, todayReportDetails, weekReportDetails, lateCountThisWeek,
    } = userReport
    res.json({
      userInfo,
      todayReportDetails,
      weekReportDetails,
      todayWorkList,
      lateCountThisWeek,

    })
  },
  chartDataAdmin: async (req, res) => {
    // chart data for admin dashboard
    const todayChartData = await LogModel.todayChartData()

    const { todayTotalHr, todayWorkedHr, needHr } = todayChartData[0];
    console.log({ todayTotalHr, todayWorkedHr, needHr });

    res.json([todayTotalHr, todayWorkedHr, needHr]);
  },
  trackingEmployeesToday: async (req, res) => {
    const users = await UserModel.getAllUsersList()
    const totalEmployees = users.length
    const [{ totalLeaveToDay }] = await LeaveModel.todayLeaveUser()
    const { todayWorkingEmployee } = await LogModel.todayWorkingEmployees()

    console.log(totalEmployees, totalLeaveToDay, todayWorkingEmployee);
    const trackingTodayEmployeeArr = [totalEmployees, todayWorkingEmployee, totalLeaveToDay]
    res.json(trackingTodayEmployeeArr)
  },

}
module.exports = DashboardController
