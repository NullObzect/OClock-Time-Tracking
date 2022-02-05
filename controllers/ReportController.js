/* eslint-disable no-unused-expressions */
const AttendanceModel = require('../models/AttendanceModel');
const UserModel = require('../models/UserModel')
const ProfileModel = require('../models/ProfileModel')
const { pageNumbers } = require('../utilities/pagination')
const {
  timeToHour, calculateTime, dateFormate, timeFormateForReport, workHourFormateForReport, timeToHourWithoutMint,
} = require('../utilities/formater');
//

// grobal variable  multiple date
const holidaysArray = [];
const leaveDaysArray = [];
global.holidayAndLeavedaysDateRange = []

// constructor function
function ReportDetails(day, fixedTotalHour, workHour, avgWorkHour, avgStartTime, avgEndTime, totalExtra, totalLess) {
  this.day = day || null
  this.fixedTotalHour = fixedTotalHour || null
  this.workHour = workHourFormateForReport(workHour)
  this.avgWorkHour = workHourFormateForReport(avgWorkHour)
  this.avgStartTime = timeFormateForReport(avgStartTime)
  this.avgEndTime = timeFormateForReport(avgEndTime)
  this.totalExtra = timeToHourWithoutMint(totalExtra)
  this.totalLess = timeToHourWithoutMint(totalLess)
}
function TodayReportDetails(todayTotal, start, end, breakTime, totalExtra, totalLess) {
  this.todayTotal = timeFormateForReport(todayTotal)
  this.start = start
  this.end = end
  this.breakTime = breakTime
  this.totalExtra = timeToHourWithoutMint(totalExtra)
  this.totalLess = timeToHourWithoutMint(totalLess)
}

// sum fixedTime
let sumFixedTime = null;
function totalFixedTime(day, fixedTime, type) {
  const getHour = fixedTime[1]
  if (type === 'regular' && day !== 'Friday') {
    sumFixedTime += Number(getHour);
  } else {
    sumFixedTime += 0;
  }
  return sumFixedTime;
}

// holiday dates function
function multipleDate(numOfDay, date) {
  const myDate = new Date(date);
  const gotDate = new Date(myDate.setDate(myDate.getDate() - 1))

  for (let i = 1; i <= numOfDay; i += 1) {
    holidaysArray.push(dateFormate(gotDate.setDate(gotDate.getDate() + 1)))
  }
}
// leave dates funciton
function multipleLeaveDates(numOfDay, date) {
  const myDate = new Date(date);
  const gotDate = new Date(myDate.setDate(myDate.getDate() - 1))

  for (let i = 1; i <= numOfDay; i += 1) {
    leaveDaysArray.push(dateFormate(gotDate.setDate(gotDate.getDate() + 1)))
  }
}

const ReportController = {

  userReport: async (req, res) => {
    try {
      const { user } = req
      let userId;
      if (req.params.id) {
        userId = req.params.id;
      } else {
        userId = user.id;
      }

      const userInfo = await AttendanceModel.getEmployeeInfo(userId)
      const lastSevenDaysReport = await AttendanceModel.anEmployeeReportLastSavenDays(userId);
      const [{ avgStartTime }] = await AttendanceModel.avgStartTime(userId)
      const [{ avgEndTime }] = await AttendanceModel.avgEndTime(userId)
      const [{ weekTotal }] = await AttendanceModel.weekTotal(userId)
      const [{ monthTotal }] = await AttendanceModel.thisMonthTotal(userId)
      const weekHr = timeToHour(weekTotal)
      const monthHr = timeToHour(monthTotal)

      // report for today
      const [{ start }] = await AttendanceModel.todayStartTime(userId)
      const [{ end }] = await AttendanceModel.todayEndTime(userId)
      const [tTotal] = await AttendanceModel.todayTotal(userId)
      const [{ totalExtrOrLess }] = await AttendanceModel.todayTotal(userId)
      let extraWorkHour; let lessWorkHour;
      if (totalExtrOrLess === null) {
        extraWorkHour = '00:00';
        lessWorkHour = '00:00';
      } else if (totalExtrOrLess[0] === '-') {
        lessWorkHour = totalExtrOrLess;
      } else {
        extraWorkHour = totalExtrOrLess;
      }
      const platformUser = await ProfileModel.userConnectionDetailsUniqueInfo(userId)
      const today = await AttendanceModel.getToday(userId)
      const { todayTotal } = tTotal

      const breakTime = today.length
      console.log({ totalExtrOrLess })

      const todayReportDetails = new TodayReportDetails(
        todayTotal,
        start,
        end,
        breakTime,
        extraWorkHour,
        lessWorkHour,
      )
      // report for this week
      const [{
        weekDay, weekFixedTotal, weekTotalHr, weekAvgTotal, weekTotalExtrOrLess,
      }] = await AttendanceModel.weekDayAndWorkTime(userId)

      const [{ weekAvgStartTime, weekAvgEndTime }] = await AttendanceModel.weekAvgStartEnd(userId)
      let weekExtraWorkHour; let weekLessWorkHour;
      if (weekTotalExtrOrLess === null) {
        weekExtraWorkHour = '00:00';
        weekLessWorkHour = '00:00';
      } else if (weekTotalExtrOrLess[0] === '-') {
        weekLessWorkHour = weekTotalExtrOrLess;
      } else {
        weekExtraWorkHour = weekTotalExtrOrLess;
      }
      const weekReportDetails = new ReportDetails(
        weekDay,
        weekFixedTotal,
        weekTotalHr,
        weekAvgTotal,
        weekAvgStartTime,
        weekAvgEndTime,
        weekExtraWorkHour,
        weekLessWorkHour,
      )
      console.log({ weekReportDetails })
      // report for this month
      const [{
        monthDay, monthFixedTotalHr, monthWorkTotalHr, monthAvgTotalHr, monthTotalExtrOrLess,
      }] = await AttendanceModel.monthDayAndWorkTime(userId)

      const [{ monthAvgStartTime, monthAvgEndTime }] = await
      AttendanceModel.monthAvgStartEnd(userId)
      let monthExtraWorkHour; let monthLessWorkHour;
      if (monthTotalExtrOrLess === null) {
        monthExtraWorkHour = '00:00';
        monthLessWorkHour = '00:00';
      } else if (monthTotalExtrOrLess[0] === '-') {
        monthLessWorkHour = monthTotalExtrOrLess;
      } else {
        monthExtraWorkHour = monthTotalExtrOrLess;
      }
      const monthReportDetails = new ReportDetails(
        monthDay,
        monthFixedTotalHr,
        monthWorkTotalHr,
        monthAvgTotalHr,
        monthAvgStartTime,
        monthAvgEndTime,
        monthExtraWorkHour,
        monthLessWorkHour,
      )
      console.log({ monthReportDetails })
      // report for this year
      const [{
        yearDay, yearFixedTotalHr, yearWorkTotalHr, yearAvgTotalHr, yearTotalExtrOrLess,
      }] = await AttendanceModel.yearDayAndWorkTime(userId)

      const [{ yearAvgStartTime, yearAvgEndTime }] = await
      AttendanceModel.yearAvgStartEnd(userId)
      let yearExtraWorkHour; let yearLessWorkHour;
      if (yearTotalExtrOrLess === null) {
        yearExtraWorkHour = '00:00';
        yearLessWorkHour = '00:00';
      } else if (yearTotalExtrOrLess[0] === '-') {
        yearLessWorkHour = yearTotalExtrOrLess;
      } else {
        yearExtraWorkHour = yearTotalExtrOrLess;
      }
      const yearReportDetails = new ReportDetails(
        yearDay,
        yearFixedTotalHr,
        yearWorkTotalHr,
        yearAvgTotalHr,
        yearAvgStartTime,
        yearAvgEndTime,
        yearExtraWorkHour,
        yearLessWorkHour,
      )
      // console.log({ yearReportDetails })
      // for holidays
      const holidaysDate = await AttendanceModel.holidaysDate();
      // multiple date

      holidaysDate.forEach((el) => {
        multipleDate(el.count_holiday, el.holiday_start)
      })
      const lastSevenDaysReportDates = []
      const reportStringify = JSON.parse(JSON.stringify(lastSevenDaysReport));

      reportStringify.forEach((el) => {
        lastSevenDaysReportDates.push(el.date_for_holiday)
      })
      // check employee work in holiday
      const employeeWorkInHoliday = holidaysArray.filter((el) => lastSevenDaysReportDates.includes(el))
      // console.log({ employeeWorkInHoliday })
      const holidayObject = [];
      employeeWorkInHoliday.forEach((el) => {
        holidayObject.push({ h_date: el, type: 'holiday', fixed_time: '0' })
      })

      // =========for employee leave date
      const employeeLeaveDates = await AttendanceModel.employeeLeaveDates(userId)

      employeeLeaveDates.forEach((el) => {
        multipleLeaveDates(el.count_leave_day, el.leave_start)
      })

      const employeeWorkInLeaveDay = leaveDaysArray.filter((el) => lastSevenDaysReportDates.includes(el))
      // console.log({ employeeWorkInLeaveDay });

      const leaveDayObject = [];
      employeeWorkInLeaveDay.forEach((el) => {
        leaveDayObject.push({ l_date: el, type: 'leave', fixed_time: '0' })
      })
      // marge holiday and leave days array of object
      const margeHolidaysAndLeaveDays = [...holidayObject, ...leaveDayObject]
      // console.log({ margeHolidaysAndLeaveDays });
      // console.log({ leaveDayObject });

      holidayAndLeavedaysDateRange = margeHolidaysAndLeaveDays;

      // chek holiday and leave day then change type
      for (let i = 0; i < reportStringify.length; i += 1) {
        for (let j = 0; j < margeHolidaysAndLeaveDays.length; j += 1) {
          if (reportStringify[i].date_for_holiday === margeHolidaysAndLeaveDays[j].h_date) {
            reportStringify[i].type = margeHolidaysAndLeaveDays[j].type
            reportStringify[i].fixed_time = margeHolidaysAndLeaveDays[j].fixed_time

            break;
          } else if (reportStringify[i].date_for_holiday === margeHolidaysAndLeaveDays[j].l_date) {
            reportStringify[i].type = margeHolidaysAndLeaveDays[j].type
            reportStringify[i].fixed_time = margeHolidaysAndLeaveDays[j].fixed_time

            break;
          }
        }
      }

      // sum fixed time
      // console.log({reportStringify});

      let sumSevendaysFixedTime;
      reportStringify.forEach((el) => {
        sumSevendaysFixedTime = totalFixedTime(el.day, el.fixed_time, el.type)
      })
      console.log({ sumSevendaysFixedTime });

      // last seven days total reports for employee
      const employeeLastSevendaysReportTotal = await AttendanceModel.reportLastSevendaysTotalForEmployee(userId)
      employeeLastSevendaysReportTotal.forEach((el) => {
        el.fixed_total = sumSevendaysFixedTime
        el.totalLessORExtra = calculateTime(sumSevendaysFixedTime, el.total_seconds);
      })

      const userReport = [...reportStringify]
      sumFixedTime = 0;
      sumSevendaysFixedTime = 0

      // console.log({ userReport });

      res.render('pages/reports', {
        platformUser,
        userInfo,
        todayReportDetails,
        weekReportDetails,
        monthReportDetails,
        yearReportDetails,
        userReport,
        avgStartTime,
        avgEndTime,
        weekHr,
        monthHr,
        employeeLastSevendaysReportTotal,
      });
    } catch (err) {
      console.log('====>Error form ReportController/ userReport', err);
      return err;
    }
  },
  // return data AJAX for date range input
  reportBetweenTwoDate: async (req, res) => {
    try {
      const userId = req.user.id;
      // const { user } = req

      // let userId;
      // if (req.params.id) {
      //   userId = req.params.id;
      // } else {
      //   userId = user.id;
      // }

      const { startDate, endDate } = req.query;
      const getData = await AttendanceModel.anEmployeeReportBetweenTwoDate(
        userId, startDate, endDate,
      );
      const getBetweenTowDateTotal = await AttendanceModel.reportBetweenTwoDateTotal(userId, startDate, endDate)
      const betweenTowDateTotalToJson = JSON.parse(JSON.stringify(getBetweenTowDateTotal))

      const dataToJson = JSON.parse(JSON.stringify(getData))
      // console.log({ dataToJson });
      // console.log({ holidayAndLeavedaysDateRange });

      for (let i = 0; i < dataToJson.length; i += 1) {
        // eslint-disable-next-line no-undef
        for (let j = 0; j < holidayAndLeavedaysDateRange.length; j += 1) {
          if (dataToJson[i].date_for_holiday === holidayAndLeavedaysDateRange[j].h_date) {
            dataToJson[i].type = holidayAndLeavedaysDateRange[j].type
            dataToJson[i].fixed_time = holidayAndLeavedaysDateRange[j].fixed_time

            break;
          } else if (dataToJson[i].date_for_holiday === holidayAndLeavedaysDateRange[j].l_date) {
            dataToJson[i].type = holidayAndLeavedaysDateRange[j].type
            dataToJson[i].fixed_time = holidayAndLeavedaysDateRange[j].fixed_time

            break;
          }
        }
      }
      let dateRangeFixedTime = 0;

      //  store fixed time with date range

      betweenTowDateTotalToJson.forEach((el) => {
        el.fixed_total = el.day * el.fixedTime;
        el.totalLessORExtra = calculateTime(el.fixed_total, el.total_seconds)
      })

      console.log('yyy', { dataToJson });
      console.log('xxxx', { betweenTowDateTotalToJson });

      // count time total extar or less
      // return res.json(dataToJson)
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 4
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const dateRangeReport = dataToJson.slice(startIndex, endIndex)
      const pageLength = dataToJson.length / limit
      // eslint-disable-next-line max-len
      const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
      const pageNumber = pageNumbers(numberOfPage, 2, page)
      res.json({
        reports: {
          dateRangeReport, pageNumber, numberOfPage, pageLength, page,
        },
        reportDateRangeTotal: { betweenTowDateTotalToJson },
      })
      dateRangeFixedTime = 0;
    } catch (err) {
      console.log('====>Error form ReportController/reportBetweenTwoDate', err);
      return err;
    }
  },

  // return data AJAX for date range input
  reportBetweenTwoDateForAdmin: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      console.log(startDate, endData);

      const getData = await AttendanceModel.anEmployeeReportBetweenTwoDate(
        getId, startDate, endDate,
      );
      const getBetweenTowDateTotal = await AttendanceModel.reportBetweenTwoDateTotal(getId, startDate, endDate)
      const betweenTowDateTotalToJson = JSON.parse(JSON.stringify(getBetweenTowDateTotal))
      console.log({ betweenTowDateTotalToJson });

      const dataToJson = JSON.parse(JSON.stringify(getData))

      for (let i = 0; i < dataToJson.length; i += 1) {
        // eslint-disable-next-line no-undef
        for (let j = 0; j < holidayAndLeavedaysDateRange.length; j += 1) {
          if (dataToJson[i].date_for_holiday === holidayAndLeavedaysDateRange[j].h_date) {
            dataToJson[i].type = holidayAndLeavedaysDateRange[j].type
            dataToJson[i].fixed_time = holidayAndLeavedaysDateRange[j].fixed_time

            break;
          } else if (dataToJson[i].date_for_holiday === holidayAndLeavedaysDateRange[j].l_date) {
            dataToJson[i].type = holidayAndLeavedaysDateRange[j].type
            dataToJson[i].fixed_time = holidayAndLeavedaysDateRange[j].fixed_time

            break;
          }
        }
      }

      // console.log({dataToJson, betweenTowDateTotalToJson});

      betweenTowDateTotalToJson.forEach((el) => {
        el.fixed_total = el.day * el.fixedTime;
        el.totalLessORExtra = calculateTime(el.fixed_total, el.total_seconds)
      })

      // return res.json(dataToJson)
      res.json({
        reports: { dataToJson },
        reportDateRangeTotal: { betweenTowDateTotalToJson },
      })
    } catch (err) {
      console.log('====>Error form ReportController/reportEmployees', err);
      return err;
    }
  },
}

module.exports = ReportController;
