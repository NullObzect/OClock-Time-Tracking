/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
const AttendanceModel = require('../models/AttendanceModel');
const UserModel = require('../models/UserModel')
const ProfileModel = require('../models/ProfileModel')
const { pageNumbers } = require('../utilities/pagination')
const {
  timeToHour, calculateTime, dateFormate, timeFormateForReport, workHourFormateForReport, timeToHourWithoutMint,
} = require('../utilities/formater');
const HolidayModel = require('../models/HolidayModel');
const LeaveModel = require('../models/LeaveModel');
//

// grobal variable  multiple date
const holidaysArray = [];
const leaveDaysArray = [];
let holidayAndLeavedaysDateRange = []

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
// leave dates function
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

      //  ============= Start  Reports record for table
      // for holidays
      const holidaysDate = await AttendanceModel.holidaysDate();
      // multiple date

      holidaysDate.forEach((el) => {
        multipleDate(el.count_holiday, el.holiday_start)
      })
      // console.log({ holidaysArray })
      // last seven days report array
      const lastSevenDaysReportDates = []
      const reportStringify = JSON.parse(JSON.stringify(lastSevenDaysReport));

      reportStringify.forEach((el) => {
        lastSevenDaysReportDates.push(el.date_for_holiday)
      })

      // check employee work in holiday

      const employeeWorkInHoliday = holidaysArray.filter((el) => lastSevenDaysReportDates.includes(el))
      console.log({ employeeWorkInHoliday })
      const holidayObject = [];
      employeeWorkInHoliday.forEach((el) => {
        holidayObject.push({ h_date: el, type: 'holiday', fixed_time: '0' })
      })
      console.log({ holidayObject });

      // =========for employee leave date
      const employeeLeaveDates = await AttendanceModel.employeeLeaveDates(userId)
      console.log({ employeeLeaveDates });

      employeeLeaveDates.forEach((el) => {
        multipleLeaveDates(el.count_leave_day, el.leave_start)
      })

      const employeeWorkInLeaveDay = leaveDaysArray.filter((el) => lastSevenDaysReportDates.includes(el))
      console.log({ employeeWorkInLeaveDay });

      const leaveDayObject = [];
      employeeWorkInLeaveDay.forEach((el) => {
        leaveDayObject.push({ l_date: el, type: 'leave', fixed_time: '0' })
      })
      // marge holiday and leave days array of object
      const margeHolidaysAndLeaveDays = [...holidayObject, ...leaveDayObject]

      holidayAndLeavedaysDateRange = margeHolidaysAndLeaveDays;
      console.log({ holidayAndLeavedaysDateRange });
      // check holiday and leave day then change type
      checkHolidaysAndLeavedays(reportStringify, margeHolidaysAndLeaveDays)
      console.log({ margeHolidaysAndLeaveDays });

      //  =============== report for today
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
      // console.log({ totalExtrOrLess })

      const todayReportDetails = new TodayReportDetails(
        todayTotal,
        start,
        end,
        breakTime,
        extraWorkHour,
        lessWorkHour,
      )
      // ==================== report for this week
      const [{
        weekDay, weekFixedTotal, weekTotalHr, weekAvgTotal, weekTotalExtrOrLess,
      }] = await AttendanceModel.weekDayAndWorkTime(userId)

      const [{ weekAvgStartTime, weekAvgEndTime }] = await AttendanceModel.weekAvgStartEnd(userId)
      let weekExtraWorkHour; let weekLessWorkHour;
      chckTotalWorkTimeExtraOrLess(weekTotalExtrOrLess, weekExtraWorkHour, weekLessWorkHour)
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
      // console.log({ weekReportDetails })
      /* ======================================================== */
      /* ==========TODO:  report for this month  start ========== */
      /* ======================================================== */
      // is this month holiday and leave day in offday
      const [{ thisMonthOffdays }] = await AttendanceModel.thisMonthOffdays()
      const isOffdaysInHolidaysThisMonth = await HolidayModel.thisMonthOffdaysInHolidays()
      const isOffdaysInLeaveadaysThisMonth = await LeaveModel.thisMonthOffdaysInLeavedays(userId)
      console.log({ thisMonthOffdays });

      const thisMonthTotalOffdaysInHolidaysAndLeavedays = countNumberOfOffdaysInHolidayAndLevedays(isOffdaysInHolidaysThisMonth, isOffdaysInLeaveadaysThisMonth)
      console.log({ thisMonthTotalOffdaysInHolidaysAndLeavedays });

      // const yyy = generateWeekNames('Thursday', 5)
      // console.log({ yyy })

      const getTotalOffdays = (thisMonthOffdays + thisMonthTotalOffdaysInHolidaysAndLeavedays);
      const getThiMontHolidayDates = await AttendanceModel.thisMonthHolidays()
      const getThisMonthLeaveDates = await AttendanceModel.thisMonthLeaveDays(userId)
      const getThisMonthdays = await AttendanceModel.thisMonthDates()
      const thisMonthTotalWorkdays = generateAllOffdaysToWorkdays(getTotalOffdays, getThisMonthLeaveDates, getThiMontHolidayDates, getThisMonthdays)

      // console.log({ getTotalOffdays, thisMonthTotalWorkdays });

      const [{
        thisMonthTotalWorkingDays, monthFixedTotalHr, monthWorkTotalHr, monthAvgTotalHr, thisMonthAvgLessOrExtra, monthTotalExtrOrLess,
      }] = await AttendanceModel.monthDayAndWorkTime(userId)

      const [{ monthAvgStartTime, monthAvgEndTime }] = await
      AttendanceModel.monthAvgStartEnd(userId)
      const thisMonthExtraOrLessHr = chckTotalWorkTimeExtraOrLess(monthTotalExtrOrLess)

      const monthReportDetails = new ReportDetails(
        thisMonthTotalWorkingDays,
        thisMonthTotalWorkdays,
        monthFixedTotalHr,
        monthWorkTotalHr,
        monthAvgTotalHr,
        monthAvgStartTime,
        monthAvgEndTime,
        thisMonthAvgLessOrExtra,
        thisMonthExtraOrLessHr,
        isLowOrHighClassForday(thisMonthTotalWorkdays, thisMonthTotalWorkingDays),
        showDaysIsLowOrHigh(thisMonthTotalWorkdays, thisMonthTotalWorkingDays),
        isLowOrHighClassForHr(thisMonthAvgLessOrExtra),

      )
      console.log({ monthReportDetails })
      /* ======================================================== */
      /* ==========FIXME:  report for this month  END ========== */
      /* ======================================================== */

      /* ======================================================== */
      /* ==========TODO:  report for this year  start ========== */
      /* ======================================================== */
      const [{ thisYearOffdays }] = await AttendanceModel.thisYearOffdays()
      const getThisYearHolidays = await HolidayModel.thisYearHolidays()

      const getThisYearLeavedays = await LeaveModel.thisYearLeaveDays(userId)
      const getThisYearDates = await AttendanceModel.thisYearDates()
      const isOffdaysInHolidaysThisYear = await HolidayModel.thisYearOffdaysInHolidays()
      const isOffdaysInLeaveadaysThisYear = await LeaveModel.thisYearOffdaysInLeavedays(userId)

      const thisYearTotalOffdaysInHolidaysAndLeavedays = countNumberOfOffdaysInHolidayAndLevedays(isOffdaysInHolidaysThisYear, isOffdaysInLeaveadaysThisYear)

      const getTotalOffdaysThisYear = (thisYearOffdays + thisYearTotalOffdaysInHolidaysAndLeavedays);
      // this year total workdays
      const thisYearTotalWorkdays = generateAllOffdaysToWorkdays(getTotalOffdaysThisYear, getThisYearLeavedays, getThisYearHolidays, getThisYearDates)

      console.log({ thisYearTotalWorkdays });

      const [{
        thisYearTotalWorkingDays, yearFixedTotalHr, yearWorkTotalHr, yearAvgTotalHr, thisYearAvgLessOrExtra, yearTotalExtrOrLess,
      }] = await AttendanceModel.yearDayAndWorkTime(userId)
      const [{ yearAvgStartTime, yearAvgEndTime }] = await
      AttendanceModel.yearAvgStartEnd(userId)
      const thisYearExtraOrLessHr = chckTotalWorkTimeExtraOrLess(yearTotalExtrOrLess)

      const yearReportDetails = new ReportDetails(
        thisYearTotalWorkingDays,
        thisYearTotalWorkdays,
        yearFixedTotalHr,
        yearWorkTotalHr,
        yearAvgTotalHr,
        yearAvgStartTime,
        yearAvgEndTime,
        thisYearAvgLessOrExtra,
        thisYearExtraOrLessHr,
        isLowOrHighClassForday(thisYearTotalWorkdays, thisYearTotalWorkingDays),
        showDaysIsLowOrHigh(thisYearTotalWorkdays, thisYearTotalWorkingDays),
        isLowOrHighClassForHr(thisYearAvgLessOrExtra),
      )

      /* ======================================================== */
      /* ==========FIXME:  report for this year  END ========== */
      /* ======================================================== */
      // console.log({ yearReportDetails })

      // sum fixed time

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
/* ======================================================== */
/* =====FIXME:  report controller all helper  functions ==== */
/* ======================================================== */
function checkHolidaysAndLeavedays(report, holidaysAndLeavedaysArr) {
  // chek holiday and leave day then change type
  for (let i = 0; i < report.length; i += 1) {
    for (let j = 0; j < holidaysAndLeavedaysArr.length; j += 1) {
      if (report[i].date_for_holiday === holidaysAndLeavedaysArr[j].h_date) {
        report[i].type = holidaysAndLeavedaysArr[j].type
        report[i].fixed_time = holidaysAndLeavedaysArr[j].fixed_time

        break;
      } else if (report[i].date_for_holiday === holidaysAndLeavedaysArr[j].l_date) {
        report[i].type = holidaysAndLeavedaysArr[j].type
        report[i].fixed_time = holidaysAndLeavedaysArr[j].fixed_time

        break;
      }
    }
  }
}
/* ======================================================== */
/* =======FIXME:  Report controller helper functions ====== */
/* ======================================================== */
// data to stringify and push an array
function dataToJsonAndpushDataToArray(data, arr) {
  const dataToJson = JSON.parse(JSON.stringify(data))
  dataToJson.forEach((el) => {
    arr.push(Object.values(el))
  })
  return arr;
}
// holiday dates function
function multipleDatesGenerateOnArray(numOfDay, date, arr) {
  const myDate = new Date(date);
  const gotDate = new Date(myDate.setDate(myDate.getDate() - 1))

  for (let i = 1; i <= numOfDay; i += 1) {
    arr.push(dateFormate(gotDate.setDate(gotDate.getDate() + 1)))
  }
}
// get offdays, holidays, leavedays  and  alldates from database
function generateAllOffdaysToWorkdays(offdays, leavedays, holidays, allDates) {
  const getLeavedaysArray = [];
  const getHolidaysArray = [];
  const getAllDatesArray = [];

  leavedays.forEach((el) => { multipleDatesGenerateOnArray(el.countThisMonthWorkday, el.thisMonthStartDate, getLeavedaysArray) })

  holidays.forEach((el) => { multipleDatesGenerateOnArray(el.countHolidays, el.holidayStartDate, getHolidaysArray) })

  allDates.forEach((el) => { multipleDatesGenerateOnArray(el.countWorkday, el.tartDate, getAllDatesArray) })

  return generateTotalWorkdays(offdays, getLeavedaysArray, getHolidaysArray, getAllDatesArray);
}

// holidays, leavedays and off days total
function generateTotalWorkdays(offdays, leavedays, holidays, allDates) {
  if (offdays == null) return null;
  if (leavedays == null) return null;
  if (holidays == null) return null;
  if (allDates == null) return null;
  const margedArr = [...leavedays, ...holidays];
  const uniqueArray = [...new Set(margedArr)]
  const fixedWorkdays = allDates.filter((el) => !uniqueArray.includes(el))

  return fixedWorkdays.length - offdays;
}
// check total working time extra or less

function chckTotalWorkTimeExtraOrLess(totalWorkTime) {
  let isExtra; let
    isLess;
  if (totalWorkTime === null || totalWorkTime === '') {
    return '';
  } if (totalWorkTime[0] === '-') {
    return isLess = totalWorkTime;
  }
  return isExtra = totalWorkTime;
}
// generate multiple day names
function generateWeekNames(dayName, numOfDay) {
  let arr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const findIdex = arr.indexOf(dayName)
  numOfDay += findIdex;
  while (arr.length < numOfDay) { arr = arr.concat(arr); }
  return arr.slice(findIdex, numOfDay)
}
// function for total offdays
function countNumberOfOffdaysInHolidayAndLevedays(offdaysInHolidays, offdaysInLeavedays) {
  const temp1 = [];
  let temp2 = [];
  if (offdaysInHolidays === null) return null;
  if (offdaysInLeavedays === null) return null;

  offdaysInHolidays.forEach((el) => {
    temp1.push(generateWeekNames(el.stratDayName, el.countDays))
  })
  offdaysInLeavedays.forEach((el) => {
    temp1.push(generateWeekNames(el.stratDayName, el.countDays))
  })
  temp2 = [].concat(...temp1)
  const numberOfFriday = temp2.reduce((el, val) => el + (val === 'Friday'), 0)
  return numberOfFriday
}
// highlighted working activity in report
function isLowOrHighClassForday(fixedTotal, workingTotal) {
  if (fixedTotal > workingTotal) {
    return 'low';
  } if (fixedTotal < workingTotal) {
    return 'high';
  }
  return '';
}
function isLowOrHighClassForHr(workingTotal) {
  if (workingTotal === null) return null;
  if (workingTotal[0] === '-') {
    return 'low';
  } if (workingTotal[0] !== '-') {
    return 'high';
  }
  return '';
}
function showDaysIsLowOrHigh(fixedTotal, workingTotal) {
  if (fixedTotal > workingTotal) {
    return fixedTotal - workingTotal;
  } if (fixedTotal < workingTotal) {
    return workingTotal - fixedTotal;
  }
  return '';
}
function showWorkHrIsLowOrHigh(totalWorkTime) {
  if (totalWorkTime === null) return null;
  if (totalWorkTime[0] === '-') {
    return totalWorkTime;
  } if (totalWorkTime === '') {
    return ''
  }
  return (`+${totalWorkTime}`);
}
// constructor function for report details

function ReportDetails(
  totalWorkingDays, fixedWorkdays, fixedTotalHr,
  workingTotalHr, avgWorkHr, avgStartTime,
  avgEndTime, isAvgExtraOrLessHr, isTotalExtraOrLessHr,
  classLowOrHighForDay, daysIsLowOrHigh, classLowOrHighForHr,
) {
  this.totalWorkingDays = totalWorkingDays || '0'
  this.fixedWorkdays = fixedWorkdays || '0'
  this.fixedTotalHr = fixedTotalHr || '0'
  this.workingTotalHr = workHourFormateForReport(workingTotalHr) || '0'
  this.avgWorkHr = workHourFormateForReport(avgWorkHr) || '0'
  this.avgStartTime = timeFormateForReport(avgStartTime) || '0'
  this.avgEndTime = timeFormateForReport(avgEndTime) || '0'
  this.isAvgExtraOrLessHr = showWorkHrIsLowOrHigh(workHourFormateForReport(isAvgExtraOrLessHr))
  this.isTotalExtraOrLessHr = showWorkHrIsLowOrHigh(workHourFormateForReport(isTotalExtraOrLessHr))
  this.classLowOrHighForDay = classLowOrHighForDay;
  this.daysIsLowOrHigh = daysIsLowOrHigh;
  this.classLowOrHighForHr = classLowOrHighForHr;
}

function TodayReportDetails(todayTotal, start, end, breakTime, totalExtra, totalLess) {
  this.todayTotal = timeFormateForReport(todayTotal)
  this.start = start
  this.end = end
  this.breakTime = breakTime
  this.totalExtra = timeToHourWithoutMint(totalExtra)
  this.totalLess = timeToHourWithoutMint(totalLess)
}
module.exports = ReportController;
