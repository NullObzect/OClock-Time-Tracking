/* eslint-disable max-len */
const AttendanceModel = require('../models/AttendanceModel');
const LogModel = require('../models/LogModel');
const ProfileModel = require('../models/ProfileModel')
const { pageNumbers } = require('../utilities/pagination')
const {
  timeToHour, calculateTime, dateFormate, workHourFormateForReport,
} = require('../utilities/formater');

//
let isUserId;

const ReportController = {

  userReport: async (req, res) => {
    try {
      isUserId = null;
      const { user } = req
      let userId;
      if (req.params.id) {
        userId = req.params.id;
        isUserId = userId;
      } else {
        userId = user.id;
      }

      const checkUserReportEmptyOrNot = await LogModel.isUserIdInLog(userId)
      // console.log({ checkUserReportEmptyOrNot });
      // console.log('dddd', checkUserReportEmptyOrNot.length);

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
          console.log('start', el.outTimeExtraOrLess);
          if (el.dayType !== 'regular') {
            el.inTimeExtraOrLess = ''
            el.outTimeExtraOrLess = ''
            el.workHr = '0'
            el.totalTimeExtraOrLess = ''
          }
          el.inTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.inTimeExtraOrLess = '' : el.inTimeExtraOrLess;

          el.outTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.outTimeExtraOrLess = '' : el.outTimeExtraOrLess;
          el.outTimeExtraOrLess[0] === '-' ? el.outTimeExtraOrLess = el.outTimeExtraOrLess.slice(1) : el.outTimeExtraOrLess;
          // console.log('end', el.totalTimeExtraOrLess[1]);
        })
        // .split('').filter((el) => el === '0').length === 4 ? el.inTimeExtraOrLess = '' : inTimeExtraOrLess
        // console.log({ lastSevenDaysReports });

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
        console.log({ todayTotal });

        const breakTime = today.length
        const todayReportDetails = new TodayReportDetails(
          todayTotal,
          start,
          end,
          breakTime,
          todayExtraOrLessHr,
          todayExtraOrLessHr,

        )
        console.log({ todayReportDetails });

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
        console.log({ getThisWeekNumberOfday });

        const [{ weekStartDate }] = await AttendanceModel.getWeekStartDate(getThisWeekNumberOfday)
        // log  start
        const [{ countJoinIngDate }] = await LogModel.countUserJoiningDate(userId)
        console.log({ countJoinIngDate });

        const weekdaysType = await LogModel.countWorkdaysForWeek(userId, weekStartDate)
        const thisWeekOffdays = weekdaysType.filter((el) => el.workdays === 0).length
        const weekTotalWorkdays = getThisWeekNumberOfday - thisWeekOffdays;
        const [{
          weekNumberOfWorkingDays, weekFixedHr, weekTotalWorkHr, weekTotalExtraOrLess, weekAvgWorkTime, weekAvgExtraOrLess, weekAvgStartTime, weekAvgEndTime,
        }] = await LogModel.thisWeekReports(userId, weekStartDate, countUserJoinDate(countJoinIngDate, weekTotalWorkdays))

        const thisWeekExtraOrLessHr = chckTotalWorkTimeExtraOrLess(weekTotalExtraOrLess)
        const weekReportDetails = new ReportDetails(
          weekNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, weekTotalWorkdays),
          weekFixedHr,
          weekTotalWorkHr,
          weekAvgWorkTime,
          weekAvgStartTime,
          weekAvgEndTime,
          weekAvgExtraOrLess,
          thisWeekExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, weekTotalWorkdays), weekNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, weekTotalWorkdays), weekNumberOfWorkingDays) || '',
          isLowOrHighClassForHr(weekAvgExtraOrLess),

        )
        // log end

        /* ======================================================== */
        /* ==========FIXME:  report for this today  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this month  start ========== */
        /* ======================================================== */

        // log start
        const [{ monthStartDate, countWorkday }] = await AttendanceModel.thisMonthDates()
        const monthdaysType = await LogModel.countWorkdaysForMonth(userId, monthStartDate)
        const thisMonthOffdays = monthdaysType.filter((el) => el.workdays === 0).length
        const monthTotalWorkdays = countWorkday - thisMonthOffdays;

        const [{
          monthNumberOfWorkingDays, monthFixedHr, monthTotalWorkHr, monthTotalExtraOrLess, monthAvgWorkTime, monthAvgExtraOrLess, monthAvgStartTime, monthAvgEndTime,
        }] = await LogModel.thisMonthReports(userId, monthStartDate, countUserJoinDate(countJoinIngDate, monthTotalWorkdays))

        const thisMonthExtraOrLessHr = chckTotalWorkTimeExtraOrLess(monthTotalExtraOrLess)
        const monthReportDetails = new ReportDetails(
          monthNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, monthTotalWorkdays),
          monthFixedHr,
          monthTotalWorkHr,
          monthAvgWorkTime,
          monthAvgStartTime,
          monthAvgEndTime,
          monthAvgExtraOrLess,
          thisMonthExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, monthTotalWorkdays), monthNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, monthTotalWorkdays), monthNumberOfWorkingDays),
          isLowOrHighClassForHr(monthAvgExtraOrLess),
        )
        // log end

        /* ======================================================== */
        /* ==========FIXME:  report for this month  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this year  start ========== */
        /* ======================================================== */

        const [{ yearStartDate, countThisYearWorkday }] = await AttendanceModel.thisYearDates()
        const yeardaysType = await LogModel.countWorkdaysForMonth(userId, yearStartDate)
        const thisYearTotalOffdays = yeardaysType.filter((el) => el.workdays === 0).length
        const yearTotalWorkdays = countThisYearWorkday - thisYearTotalOffdays;
        // checking this year joining date

        const [{
          yearNumberOfWorkingDays, yearFixedHr, yearTotalWorkHr, yearTotalExtraOrLess, yearAvgWorkTime, yearAvgExtraOrLess, yearAvgStartTime, yearAvgEndTime,
        }] = await LogModel.thisYearReports(userId, yearStartDate, countUserJoinDate(countJoinIngDate, yearTotalWorkdays))

        const thisYearExtraOrLessHr = chckTotalWorkTimeExtraOrLess(yearTotalExtraOrLess)
        const yearReportDetails = new ReportDetails(
          yearNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, yearTotalWorkdays),
          yearFixedHr,
          yearTotalWorkHr,
          yearAvgWorkTime,
          yearAvgStartTime,
          yearAvgEndTime,
          yearAvgExtraOrLess,
          thisYearExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, yearTotalWorkdays), yearNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, yearTotalWorkdays), yearNumberOfWorkingDays),
          isLowOrHighClassForHr(yearAvgExtraOrLess),

        )

        /* ======================================================== */
        /* ==========FIXME:  report for this year  END ========== */
        /* ======================================================== */

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

        });
      } else if (checkUserReportEmptyOrNot.length === 0) {
        res.render('pages/reports', {
          platformUser,
          userInfo,
          checkUserReportEmptyOrNot,

        });
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
      const getData = await LogModel.reportDetailsBetweenTwoDate(
        userId, startDate, endDate,
      );

      // log start
      console.log({ startDate, endDate });

      const [{ days }] = await LogModel.numberOfdaysBetweenTwoDates(startDate, endDate)
      console.log({ days });

      const [{ countJoinIngDate }] = await LogModel.countUserJoiningDate(userId)

      const betweenTwoDateTypes = await LogModel.countWorkdaysForBetweenTwoDate(userId, startDate, endDate)
      const betweenTwoDateOffdays = betweenTwoDateTypes.filter((el) => el.workdays === 0).length
      const betweenTwoDateWorkdays = days - betweenTwoDateOffdays;
      console.log({ betweenTwoDateWorkdays });

      const [{
        twoDateNumberOfWorkingDays, twoDateFixedHr, twoDateTotalWorkHr, twoDateTotalExtraOrLess, twoDateAvgWorkTime, twoDateAvgExtraOrLess, twoDateAvgStartTime, twoDateAvgEndTime,
      }] = await LogModel.reportsBewttenTwoDate(userId, startDate, endDate, countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays))

      const betweenTwoDateExtraOrLessHr = chckTotalWorkTimeExtraOrLess(twoDateTotalExtraOrLess)
      const betweenTwoDatesReportDetails = new ReportDetails(
        twoDateNumberOfWorkingDays,
        countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays),
        twoDateFixedHr,
        twoDateTotalWorkHr,
        twoDateAvgWorkTime,
        twoDateAvgStartTime,
        twoDateAvgEndTime,
        twoDateAvgExtraOrLess,
        betweenTwoDateExtraOrLessHr,
        isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays), twoDateNumberOfWorkingDays),
        showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays), twoDateNumberOfWorkingDays),
        isLowOrHighClassForHr(twoDateAvgExtraOrLess),

      )

      // log end

      const dataToJson = JSON.parse(JSON.stringify(getData))

      dataToJson.forEach((el) => {
        if (el.dayType !== 'regular') {
          el.inTimeExtraOrLess = ''
          el.outTimeExtraOrLess = ''
          el.workHr = '0'
          el.totalTimeExtraOrLess = ''
        }
        el.inTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.inTimeExtraOrLess = '' : el.inTimeExtraOrLess;

        el.outTimeExtraOrLess.split('').filter((x) => x === '0').length === 4 ? el.outTimeExtraOrLess = '' : el.outTimeExtraOrLess;

        el.outTimeExtraOrLess[0] === '-' ? el.outTimeExtraOrLess = el.outTimeExtraOrLess.slice(1) : el.outTimeExtraOrLess;
      })
      console.log({ dataToJson })

      // pagination
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 4
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const dateRangeReport = dataToJson.slice(startIndex, endIndex)

      console.log({ dateRangeReport });

      const pageLength = dataToJson.length / limit
      // eslint-disable-next-line max-len
      const numberOfPage = Number.isInteger(pageLength) ? Math.floor(pageLength) : Math.floor(pageLength) + 1
      const pageNumber = pageNumbers(numberOfPage, 2, page)

      //
      res.json({
        reports: {
          dateRangeReport, pageNumber, numberOfPage, pageLength, page,
        },
        dateRangeReportBox: { betweenTwoDatesReportDetails },
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
}
// constructor function for report details

function ReportDetails(
  totalWorkingDays, fixedWorkdays, fixedTotalHr,
  workingTotalHr, avgWorkHr, avgStartTime,
  avgEndTime, isAvgExtraOrLessHr, isTotalExtraOrLessHr,
  classLowOrHighForDay, daysIsLowOrHigh, classLowOrHighForHr,
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

function TodayReportDetails(todayTotal, start, end, breakTime, isTotalExtraOrLessHr, isLowOrHighClassForToday) {
  this.todayTotal = workHourFormateForReport(todayTotal) || '0'
  this.start = start
  this.end = end
  this.breakTime = breakTime
  this.isTotalExtraOrLessHr = showWorkHrIsLowOrHigh((isTotalExtraOrLessHr))
  this.isLowOrHighClassForToday = isLowOrHighClassForHr(isLowOrHighClassForToday)
}

module.exports = ReportController;
