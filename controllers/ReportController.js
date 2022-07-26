/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const AttendanceModel = require('../models/AttendanceModel');
const LogModel = require('../models/LogModel');
const ProfileModel = require('../models/ProfileModel')
const { pageNumbers } = require('../utilities/pagination')
const {
  timeToHour, workHourFormateForReport,
} = require('../utilities/formater');
const OptionsModel = require('../models/OptionsModel');

// get user id
let isUserId;

const ReportController = {
  // default report page
  userReport: async (req, res) => {
    try {
      isUserId = null;
      const { user } = req
      let userId;
      if (req.params.id) {
        userId = req.params.id;
        isUserId = userId;
      } else if (req.params.api) {
        userId = req.params.api;
      } else {
        userId = user.id;
      }

      const checkUserReportEmptyOrNot = await LogModel.isUserIdInLog(userId)
      const platformUser = await ProfileModel.userConnectionDetailsUniqueInfo(userId)
      const userInfo = await AttendanceModel.getEmployeeInfo(userId)

      if (checkUserReportEmptyOrNot.length !== 0) {
        const [{ avgStartTime }] = await AttendanceModel.avgStartTime(userId)
        const [{ avgEndTime }] = await AttendanceModel.avgEndTime(userId)
        const [{ weekTotal }] = await AttendanceModel.weekTotal(userId)
        const [{ monthTotal }] = await AttendanceModel.thisMonthTotal(userId)
        const weekHr = timeToHour(weekTotal)
        const monthHr = timeToHour(monthTotal)

        //  ============= Start  Reports record for table
        const reportStringify = await LogModel.lastSevenDaysReports(userId)
        const lastSevenDaysReports = JSON.parse(JSON.stringify(reportStringify))
        lastSevenDaysReports.forEach((el) => {
          if (el.dayType !== 'regular') {
            el.inTimeExtraOrLess = ''
            el.outTimeExtraOrLess = ''
            el.workHr = '0'
            el.totalTimeExtraOrLess = ''
          }
          el.inTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.inTimeExtraOrLess = '' : el.inTimeExtraOrLess;

          if (el.end !== null) {
            el.outTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.outTimeExtraOrLess = '' : el.outTimeExtraOrLess;
            // el.outTimeExtraOrLess[0] === '-' ? el.outTimeExtraOrLess = el.outTimeExtraOrLess.slice(1) : el.outTimeExtraOrLess;
          } else {
            el.outTimeExtraOrLess = ''
            el.totalTimeExtraOrLess = ''
            el.workTime = '0'
          }
        })

        /* ======================================================== */
        /* ==========TODO:  report for this today  start ========== */
        /* ======================================================== */
        const [{ start }] = await AttendanceModel.todayStartTime(userId)
        const [{ end }] = await AttendanceModel.todayEndTime(userId)
        const [tTotal] = await AttendanceModel.todayTotal(userId)
        const [{ totalExtrOrLess }] = await AttendanceModel.todayTotal(userId)
        const todayExtraOrLessHr = chckTotalWorkTimeExtraOrLess(totalExtrOrLess)
        const today = await AttendanceModel.getToday(userId)
        const { todayTotal } = tTotal
        const breakTime = today.length
        const gettodayInAndOutTimeExtraOrLess = await LogModel.todayInAndOutTimeExtraOrLess(userId)
        if (gettodayInAndOutTimeExtraOrLess.length === 0) {
          gettodayInAndOutTimeExtraOrLess.push({ inTimeExtraOrLess: '', outTimeExtraOrLess: '' })
        }
        const todayReportDetails = new TodayReportDetails(
          todayTotal,
          start,
          end,
          breakTime,
          todayExtraOrLessHr,
          todayExtraOrLessHr,
          gettodayInAndOutTimeExtraOrLess[0].inTimeExtraOrLess || '',
          gettodayInAndOutTimeExtraOrLess[0].outTimeExtraOrLess || '',

        )
        /* ======================================================== */
        /* ==========FIXME:  report for this today  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this week  start ========== */
        /* ======================================================== */

        const [{ weekCurrentName }] = await AttendanceModel.weekCurrentNameAndDate()
        let getThisWeekNumberOfday;
        if (weekCurrentName === 'Saturday') {
          getThisWeekNumberOfday = 1;
        } else if (weekCurrentName === 'Sunday') {
          getThisWeekNumberOfday = 2;
        } else if (weekCurrentName === 'Monday') {
          getThisWeekNumberOfday = 3;
        } else if (weekCurrentName === 'Tuesday') {
          getThisWeekNumberOfday = 4;
        } else if (weekCurrentName === 'Wednesday') {
          getThisWeekNumberOfday = 5;
        } else if (weekCurrentName === 'Thursday') {
          getThisWeekNumberOfday = 6;
        } else if (weekCurrentName === 'Friday') {
          getThisWeekNumberOfday = 7;
        }
        const [{ weekStartDate }] = await AttendanceModel.getWeekStartDate(getThisWeekNumberOfday)
        const [{ countJoinIngDate }] = await LogModel.countUserJoiningDate(userId)

        const weekdaysType = await LogModel.countWorkdaysForWeek(userId, weekStartDate)
        const thisWeekOffdays = weekdaysType.filter((el) => el.workdays === 0).length
        const weekTotalWorkdays = getThisWeekNumberOfday - thisWeekOffdays;

        // this month leave days
        const getWeekLeavedays = await LogModel.countThisWeekLeavedays(userId, weekStartDate)
        const totalLeavedaysThisWeek = sumLeavedays(getWeekLeavedays)

        const [{
          weekNumberOfWorkingDays, weekFixedHr, weekTotalWorkHr, weekTotalExtraOrLess, weekAvgWorkTime, weekAvgExtraOrLess, weekAvgStartTime, weekAvgEndTime,
        // eslint-disable-next-line no-use-before-define
        }] = await LogModel.thisWeekReports(userId, weekStartDate, countUserJoinDate(countJoinIngDate, weekTotalWorkdays - totalLeavedaysThisWeek))

        const thisWeekExtraOrLessHr = chckTotalWorkTimeExtraOrLess(weekTotalExtraOrLess)
        const weekReportDetails = new ReportDetails(
          weekNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, weekTotalWorkdays) - totalLeavedaysThisWeek || 0,
          weekFixedHr,
          weekTotalWorkHr,
          weekAvgWorkTime,
          weekAvgStartTime,
          weekAvgEndTime,
          weekAvgExtraOrLess,
          thisWeekExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, weekTotalWorkdays), weekNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, weekTotalWorkdays - totalLeavedaysThisWeek || 0), weekNumberOfWorkingDays) || '',
          isLowOrHighClassForHr(weekAvgExtraOrLess),

        )

        // late count this week
        const lateCounts = await LogModel.lateCountThisWeek(userId, weekStartDate)
        const lateCountThisWeek = lateCount(lateCounts)

        /* ======================================================== */
        /* ==========FIXME:  report for this Week  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this month  start ========== */
        /* ======================================================== */

        const [{ monthStartDate, countWorkday }] = await AttendanceModel.thisMonthDates()
        const monthdaysType = await LogModel.countWorkdaysForMonth(userId, monthStartDate)
        const thisMonthOffdays = monthdaysType.filter((el) => el.workdays === 0).length

        // TODO: new code start
        const { offDays } = await AttendanceModel.getOffDays()
        const { dayName } = await AttendanceModel.getDayName(monthStartDate)
        const countTotalOffDays = totalOffDays(offDays, dayName, countUserJoinDate(countJoinIngDate, countWorkday))

        // TODO: new code end

        // FIXME:
        const monthTotalWorkdays = (countWorkday - thisMonthOffdays);

        // this month leave days
        const getLeavedays = await LogModel.countThisMonthLeavedays(userId, monthStartDate)
        const totalLeadedaysThisMonth = sumLeavedays(getLeavedays)
        const totalOffLeaveHolidays = totalLeadedaysThisMonth + countTotalOffDays
        const [{
          monthNumberOfWorkingDays, monthFixedHr, monthTotalWorkHr, monthTotalExtraOrLess, monthAvgWorkTime, monthAvgExtraOrLess, monthAvgStartTime, monthAvgEndTime,
        }] = await LogModel.thisMonthReports(userId, monthStartDate, countUserJoinDate(countJoinIngDate, monthTotalWorkdays - totalOffLeaveHolidays))

        const thisMonthExtraOrLessHr = chckTotalWorkTimeExtraOrLess(monthTotalExtraOrLess)
        const monthReportDetails = new ReportDetails(
          monthNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, monthTotalWorkdays - totalOffLeaveHolidays || 0),
          monthFixedHr,
          monthTotalWorkHr,
          monthAvgWorkTime,
          monthAvgStartTime,
          monthAvgEndTime,
          monthAvgExtraOrLess,
          thisMonthExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, monthTotalWorkdays - totalOffLeaveHolidays), monthNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, monthTotalWorkdays - totalOffLeaveHolidays) || 0, monthNumberOfWorkingDays),
          isLowOrHighClassForHr(monthAvgExtraOrLess),
        )

        const lateCountsMonth = await LogModel.lateCountThisMonth(userId, monthStartDate)

        const lateCountThisMonth = lateCount(lateCountsMonth)

        /* ======================================================== */
        /* ==========FIXME:  report for this month  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this year  start ========== */
        /* ======================================================== */

        const [{ yearStartDate, countThisYearWorkday }] = await AttendanceModel.thisYearDates()
        const yeardaysType = await LogModel.countWorkdaysForMonth(userId, yearStartDate)
        const thisYearTotalOffdays = yeardaysType.filter((el) => el.workdays === 0).length
        // TODO: new code start
        const { offDaysThisYear } = await AttendanceModel.getOffDaysThisYear()
        const { dayNameThisYear } = await AttendanceModel.getDayNameThisYear(yearStartDate)
        const countTotalOffDaysThisYear = totalOffDays(offDaysThisYear, dayNameThisYear, countUserJoinDate(countJoinIngDate, countThisYearWorkday))
        // TODO: new code end
        const yearTotalWorkdays = countThisYearWorkday - thisYearTotalOffdays;
        // this month leave days
        const getThisYearLeavedays = await LogModel.countThisYearLeavedays(userId, yearStartDate)
        const totalLeavedaysThisYear = sumLeavedays(getThisYearLeavedays)
        const thisYearTotalOffLeaveHolidays = (totalLeavedaysThisYear + countTotalOffDaysThisYear)
        const [{
          yearNumberOfWorkingDays, yearFixedHr, yearTotalWorkHr, yearTotalExtraOrLess, yearAvgWorkTime, yearAvgExtraOrLess, yearAvgStartTime, yearAvgEndTime,
        }] = await LogModel.thisYearReports(userId, yearStartDate, countUserJoinDate(countJoinIngDate, yearTotalWorkdays) - thisYearTotalOffLeaveHolidays)

        const thisYearExtraOrLessHr = chckTotalWorkTimeExtraOrLess(yearTotalExtraOrLess)
        const yearReportDetails = new ReportDetails(
          yearNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, yearTotalWorkdays) - thisYearTotalOffLeaveHolidays || 0,
          yearFixedHr,
          yearTotalWorkHr,
          yearAvgWorkTime,
          yearAvgStartTime,
          yearAvgEndTime,
          yearAvgExtraOrLess,
          thisYearExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, yearTotalWorkdays) - thisYearTotalOffLeaveHolidays, yearNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, yearTotalWorkdays) - thisYearTotalOffLeaveHolidays, yearNumberOfWorkingDays),
          isLowOrHighClassForHr(yearAvgExtraOrLess),

        )
        const lateCountsYear = await LogModel.lateCountThisYear(userId, yearStartDate)
        const lateCountThisYear = lateCount(lateCountsYear)

        /* ======================================================== */
        /* ==========FIXME:  report for this year  END ========== */
        /* ======================================================== */
        if (req.params.api) {
          res.json({
            platformUser,
            userInfo,
            todayReportDetails,
            weekReportDetails,
            monthReportDetails,
            yearReportDetails,
            lastSevenDaysReports,
            avgStartTime,
            avgEndTime,
            weekHr,
            monthHr,
            checkUserReportEmptyOrNot,
            lateCountThisWeek,
            lateCountThisMonth,
            lateCountThisYear,

          })
        } else {
          res.render('pages/reports', {
            platformUser,
            userInfo,
            todayReportDetails,
            weekReportDetails,
            monthReportDetails,
            yearReportDetails,
            lastSevenDaysReports,
            avgStartTime,
            avgEndTime,
            weekHr,
            monthHr,
            checkUserReportEmptyOrNot,
            lateCountThisWeek,
            lateCountThisMonth,
            lateCountThisYear,

          })
        }
      } else if (checkUserReportEmptyOrNot.length === 0) {
        if (req.params.api) {
          res.json({
            platformUser,
            userInfo,
            checkUserReportEmptyOrNot,

          });
        } else {
          res.render('pages/reports', {
            platformUser,
            userInfo,
            checkUserReportEmptyOrNot,

          });
        }
      }
    } catch (err) {
      console.log('====>Error form ReportController/ userReport', err);
      return err;
    }
  },
  // return data AJAX for date range input
  reportBetweenTwoDate: async (req, res) => {
    try {
      // isUserId = null
      const { user } = req

      let userId;
      if (isUserId) {
        userId = isUserId;
      } else {
        userId = user.id;
      }

      const { startDate, endDate } = req.query;

      // for date range input in report page

      const getData = await LogModel.reportDetailsBetweenTwoDate(userId, startDate, endDate);

      // log start
      const [{ days }] = await LogModel.numberOfdaysBetweenTwoDates(startDate, endDate)
      const [{ countJoinIngDate }] = await LogModel.countUserJoiningDate(userId)
      const betweenTwoDateTypes = await LogModel.countWorkdaysForBetweenTwoDate(userId, startDate, endDate)
      const betweenTwoDateOffdays = betweenTwoDateTypes.filter((el) => el.workdays === 0).length

      const betweenTwoDateWorkdays = (days === 0 ? 1 : days) - betweenTwoDateOffdays;
      // TODO: new code start
      const { offDays } = await AttendanceModel.getOffDays()
      const { dayName } = await AttendanceModel.getDayName(startDate)
      const countTotalOffDays = totalOffDays(offDays, dayName, countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays))


      // TODO: new code end
      // this month leave days
      const getLeavedaysBetweenTwoDate = await LogModel.countLeavedaysBetweenTwoDate(userId, startDate, endDate)
      const totalLeavedayBetweenTwoDate = sumLeavedays(getLeavedaysBetweenTwoDate)
      const totalOffdayLeaveAndHolidays = totalLeavedayBetweenTwoDate + countTotalOffDays

      // FIXME::
      const [{
        twoDateNumberOfWorkingDays, twoDateFixedHr, twoDateTotalWorkHr, twoDateTotalExtraOrLess, twoDateAvgWorkTime, twoDateAvgExtraOrLess, twoDateAvgStartTime, twoDateAvgEndTime,
      }] = await LogModel.reportsBewttenTwoDate(userId, startDate, endDate, countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays - totalOffdayLeaveAndHolidays))

      const betweenTwoDateExtraOrLessHr = chckTotalWorkTimeExtraOrLess(twoDateTotalExtraOrLess)
      const betweenTwoDatesReportDetails = new ReportDetails(
        twoDateNumberOfWorkingDays,
        countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays - totalOffdayLeaveAndHolidays || 0),
        twoDateFixedHr,
        twoDateTotalWorkHr,
        twoDateAvgWorkTime,
        twoDateAvgStartTime,
        twoDateAvgEndTime,
        twoDateAvgExtraOrLess,
        betweenTwoDateExtraOrLessHr,
        isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays - totalOffdayLeaveAndHolidays), twoDateNumberOfWorkingDays),
        showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays - totalOffdayLeaveAndHolidays || 0), twoDateNumberOfWorkingDays),
        isLowOrHighClassForHr(twoDateAvgExtraOrLess),

      )

      // late count for between two date

      const lateCountsBetweenTwoDate = await LogModel.lateCountBetweenTwoDate(userId, startDate, endDate)
      const lateCountBetweenTwoDate = lateCount(lateCountsBetweenTwoDate)

      //

      const dataToJson = JSON.parse(JSON.stringify(getData))

      dataToJson.forEach((el) => {
        if (el.dayType !== 'regular') {
          el.inTimeExtraOrLess = ''
          el.outTimeExtraOrLess = ''
          el.workHr = '0'
          el.totalTimeExtraOrLess = ''
        }
        el.inTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.inTimeExtraOrLess = '' : el.inTimeExtraOrLess;

        if (el.end !== null) {
          el.outTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.outTimeExtraOrLess = '' : el.outTimeExtraOrLess;
        } else {
          el.outTimeExtraOrLess = ''
          el.totalTimeExtraOrLess = ''
          el.workTime = '0'
        }
      })

      // pagination
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 4
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const dateRangeReport = dataToJson.slice(startIndex, endIndex)

      const pageLength = dataToJson.length / limit
      // eslint-disable-next-line max-len
      const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
      const pageNumber = pageNumbers(numberOfPage, 2, page)

      //
      res.json({
        reports: {
          dateRangeReport, pageNumber, numberOfPage, pageLength, page,
        },
        dateRangeReportBox: { betweenTwoDatesReportDetails, lateCountBetweenTwoDate },
      })
    } catch (err) {
      console.log('====>Error form ReportController/reportBetweenTwoDate', err);
      return err;
    }
  },

}
/* ======================================================== */
/* =====FIXME:  report controller all helper  functions ==== */
/* ======================================================== */

function lateCount(lateCounts) {
  let sum = 0;
  lateCounts.forEach((el) => {
    sum += el.lateCount
  })
  return sum
}

function sumLeavedays(leavedays) {
  let sum = 0;
  leavedays.forEach((el) => {
    sum += el.countLeaveDay
  })
  return sum
}
function countFriday(dayName) {
  let count = 0;
  dayName.forEach((el) => {
    if (el.dayType === 'friday') {
      count += 1
    }
  })
  return count
}
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
  if (workingTotal === null || workingTotal === '') return '';
  if (workingTotal[0] === '-') {
    return 'low';
  }
  if (workingTotal[0] !== '-') {
    return 'high';
  }

  return '';
}
function showDaysIsLowOrHigh(fixedTotal, workingTotal) {
  if (fixedTotal > workingTotal) {
    return `-${fixedTotal - workingTotal}`;
  } if (fixedTotal < workingTotal) {
    return `+${workingTotal - fixedTotal}`;
  } if (fixedTotal === workingTotal) {
    return '';
  }
  return '';
}
function showWorkHrIsLowOrHigh(totalWorkTime) {
  if (totalWorkTime === null || totalWorkTime === ':undefined') {
    return null;
  } if (totalWorkTime[0] === '-') {
    return totalWorkTime;
  } if (totalWorkTime === '') {
    return ''
  }

  return (`+${totalWorkTime}`);
}
function countUserJoinDate(joinDay, currentDay) {
  if (joinDay === null || joinDay === undefined) {
    return false;
  }
  if (currentDay === null || currentDay === undefined) {
    return false;
  }
  if (joinDay > currentDay) {
    return currentDay
  } if (joinDay < currentDay) {
    return joinDay
  }
  if (joinDay === currentDay) {
    return joinDay
  }
}

// day name to number
function dayNameToNumber(getName) {
  let getNumber;

  if (getName === 'Saturday') {
    return getNumber = 1;
  } if (getName === 'Sunday') {
    return getNumber = 2;
  } if (getName === 'Monday') {
    return getNumber = 3;
  } if (getName === 'Tuesday') {
    return getNumber = 4;
  } if (getName === 'Wednesday') {
    return getNumber = 5;
  } if (getName === 'Thursday') {
    return getNumber = 6;
  } if (getName === 'Friday') {
    return getNumber = 7;
  }
}

// generate total offdays
// for  off day
const offDaysObj = {
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
}
function numToDay(obj, num) {
  return Object.keys(obj).find((key) => obj[key] === num)
}
function totalOffDays(offdays, startDate, totalWorkDays) {
  const getOffDaysArr = [...offdays]
  for (let i = 0; i < getOffDaysArr.length; i += 1) {
    if (getOffDaysArr[i] === ',') {
      getOffDaysArr.splice(i, 1)
    }
  }
  const offDaysNameArr = getOffDaysArr.map((el) => numToDay(offDaysObj, Number(el || 0)))
  const getThisMonthAllDaysName = generateMultipleDayName(startDate, totalWorkDays)
  const totalDays = getThisMonthAllDaysName.filter((el) => offDaysNameArr.includes(el)).length

  return totalDays || 0
}

// generate multiple week name
function generateMultipleDayName(dayName, numOfDay) {
  let arr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const findIdex = arr.indexOf(dayName)
  numOfDay += findIdex;
  while (arr.length < numOfDay) { arr = arr.concat(arr); }

  return arr.slice(findIdex, numOfDay)
}

function ReportDetails(
  totalWorkingDays,
  fixedWorkdays,
  fixedTotalHr,
  workingTotalHr,
  avgWorkHr,
  avgStartTime,
  avgEndTime,
  isAvgExtraOrLessHr,
  isTotalExtraOrLessHr,
  classLowOrHighForDay,
  daysIsLowOrHigh,
  classLowOrHighForHr,
) {
  this.totalWorkingDays = totalWorkingDays || 0
  this.fixedWorkdays = fixedWorkdays || 0
  this.fixedTotalHr = (fixedTotalHr) || 0
  this.workingTotalHr = workHourFormateForReport(workingTotalHr) || 0
  this.avgWorkHr = workHourFormateForReport(avgWorkHr) || '0'
  this.avgStartTime = (avgStartTime) || '0'
  this.avgEndTime = (avgEndTime) || '0'
  this.isAvgExtraOrLessHr = showWorkHrIsLowOrHigh(workHourFormateForReport(isAvgExtraOrLessHr)) || ''
  this.isTotalExtraOrLessHr = showWorkHrIsLowOrHigh(workHourFormateForReport(isTotalExtraOrLessHr)) || ''
  this.classLowOrHighForDay = classLowOrHighForDay;
  this.daysIsLowOrHigh = daysIsLowOrHigh || '';
  this.classLowOrHighForHr = classLowOrHighForHr;
}

function TodayReportDetails(todayTotal, start, end, breakTime, isTotalExtraOrLessHr, isLowOrHighClassForToday, inTimeExtraOrLess, outTimeExtraOrLess) {
  this.todayTotal = workHourFormateForReport(todayTotal) || '0'
  this.start = start
  this.end = end
  this.breakTime = breakTime
  this.isTotalExtraOrLessHr = showWorkHrIsLowOrHigh((isTotalExtraOrLessHr))
  this.isLowOrHighClassForToday = isLowOrHighClassForHr(isLowOrHighClassForToday)
  this.inTimeExtraOrLess = inTimeExtraOrLess
  this.outTimeExtraOrLess = outTimeExtraOrLess
}

module.exports = ReportController;
