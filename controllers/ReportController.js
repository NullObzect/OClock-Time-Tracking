/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const { INTEGER } = require('sequelize');
const AttendanceModel = require('../models/AttendanceModel');
const LogModel = require('../models/LogModel');
const ProfileModel = require('../models/ProfileModel')
const { pageNumbers } = require('../utilities/pagination')
const {
  timeToHour, workHourFormateForReport, generateMultipleDate, dateFormate,
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
        const { offDays } = await AttendanceModel.getOffDays()
        const [{ weekStartDate }] = await AttendanceModel.getWeekStartDate(getThisWeekNumberOfday)
        const [{ countJoinIngDate }] = await LogModel.countUserJoiningDate(userId)
        const weekdaysType = await LogModel.countWorkdaysForWeek(userId, weekStartDate)
        const thisWeekOffdays = weekdaysType.filter((el) => el.workdays === 0).length
        // TODO:  new code

        const thisWeekDatesArr = []

        const thisWeekTotalWorkdays = countUserJoinDate(countJoinIngDate, getThisWeekNumberOfday)
        generateMultipleDate(thisWeekTotalWorkdays, weekStartDate, thisWeekDatesArr, dateFormate)
        // count holidays  start
        const countHolidaysThisWeek = await AttendanceModel.countHolidaysThisMonth(weekStartDate, userId)
        const countHolidaysThisWeekArr = countHolidaysThisWeek.map((el) => el.countHolidaysThisMonth)
        console.log(countHolidaysThisWeekArr);

        const holidaysStartDateThisWeek = await AttendanceModel.getHolidaysStartDateThisMonth(weekStartDate, userId)
        const holidaysStartDateThisWeekArr = holidaysStartDateThisWeek.map((el) => el.holidaysStartDateThisMonth)
        const holidaysDatesThisWeek = generateDatesFromBetweenNum(countHolidaysThisWeekArr, holidaysStartDateThisWeekArr, dateFormate)
        // count holidays end
        // count leavedays start
        const countThisWeekLeavedays = await LogModel.countThisMonthLeavedays(userId, weekStartDate)
        const countThisWeekLeavedaysArr = countThisWeekLeavedays.map((el) => el.countLeaveDay)

        const countThisWeekLeavedaysDatesArr = countThisWeekLeavedays.map((el) => el.startDate)
        const thisWeekLeavedaysDates = generateDatesFromBetweenNum(countThisWeekLeavedaysArr, countThisWeekLeavedaysDatesArr, dateFormate)

        const thisWeekLeavedaysLen = thisWeekLeavedaysDates.length
        // count leavedays end
        const uniqueHoliLeaveAndOffdaysDateThisWeek = [...new Set([...holidaysDatesThisWeek, ...thisWeekDatesArr, ...thisWeekLeavedaysDates])]

        const fixedWorkdayThisWeek = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(uniqueHoliLeaveAndOffdaysDateThisWeek), thisWeekLeavedaysLen) - thisWeekOffdays

        // TODO: new code end

        const [{
          weekNumberOfWorkingDays, weekFixedHr, weekTotalWorkHr, weekTotalExtraOrLess, weekAvgWorkTime, weekAvgExtraOrLess, weekAvgStartTime, weekAvgEndTime,
        // eslint-disable-next-line no-use-before-define
        }] = await LogModel.thisWeekReports(userId, weekStartDate, countUserJoinDate(countJoinIngDate, fixedWorkdayThisWeek))

        const thisWeekExtraOrLessHr = chckTotalWorkTimeExtraOrLess(weekTotalExtraOrLess)
        const weekReportDetails = new ReportDetails(
          weekNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, fixedWorkdayThisWeek),
          weekFixedHr,
          weekTotalWorkHr,
          weekAvgWorkTime,
          weekAvgStartTime,
          weekAvgEndTime,
          weekAvgExtraOrLess,
          thisWeekExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, fixedWorkdayThisWeek), weekNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, fixedWorkdayThisWeek), weekNumberOfWorkingDays) || '',
          isLowOrHighClassForHr(weekAvgExtraOrLess),

        )

        // late count this week
        const lateCounts = await LogModel.lateCountThisWeek(userId, weekStartDate)
        const lateCountThisWeek = lateCount(lateCounts)
        const lateCountRatioWeek = Math.floor(Number(lateCountThisWeek / countUserJoinDate(countJoinIngDate, fixedWorkdayThisWeek) * 100)) || 0

        /* ======================================================== */
        /* ==========FIXME:  report for this Week  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this month  start ========== */
        /* ======================================================== */

        const [{ monthStartDate, countWorkday }] = await AttendanceModel.thisMonthDates()
        const monthdaysType = await LogModel.countWorkdaysForMonth(userId, monthStartDate)
        const workInThisMonthTotalOffdays = monthdaysType.filter((el) => el.workdays === 0).length

        // TODO: new code start
        const offdaysAndHolidaysDateArr = []
        const thisMonthTotalWorkdays = countUserJoinDate(countJoinIngDate, countWorkday)
        generateMultipleDate(thisMonthTotalWorkdays, monthStartDate, offdaysAndHolidaysDateArr, dateFormate)
        // count holidays  start
        const countHolidaysThisMonth = await AttendanceModel.countHolidaysThisMonth(monthStartDate, userId)
        const countHolidaysThisMonthArr = countHolidaysThisMonth.map((el) => el.countHolidaysThisMonth)
        const holidaysStartDateThisMonth = await AttendanceModel.getHolidaysStartDateThisMonth(monthStartDate, userId)
        const holidaysStartDateThisMonthArr = holidaysStartDateThisMonth.map((el) => el.holidaysStartDateThisMonth)
        const holidaysDates = generateDatesFromBetweenNum(countHolidaysThisMonthArr, holidaysStartDateThisMonthArr, dateFormate)
        // count holidays end
        // count leavedays start
        const countThisMonthLeavedays = await LogModel.countThisMonthLeavedays(userId, monthStartDate)
        const countThisMonthLeavedaysArr = countThisMonthLeavedays.map((el) => el.countLeaveDay)

        const countThisMonthLeavedaysDatesArr = countThisMonthLeavedays.map((el) => el.startDate)
        const thisMonthLeavedaysDates = generateDatesFromBetweenNum(countThisMonthLeavedaysArr, countThisMonthLeavedaysDatesArr, dateFormate)

        const thisMonthLeavedaysLen = thisMonthLeavedaysDates.length

        // count leavedays end
        const uniqueHoliLeaveAndOffdaysDate = [...new Set([...holidaysDates, ...offdaysAndHolidaysDateArr, ...thisMonthLeavedaysDates])]
        console.log('uniqueHoliAndOffdaysDate', uniqueHoliLeaveAndOffdaysDate.length);

        const fixedWorkdayThisMonth = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(uniqueHoliLeaveAndOffdaysDate), thisMonthLeavedaysLen) - workInThisMonthTotalOffdays
        console.log('fixedWorkThisMonth', fixedWorkdayThisMonth);

        // TODO: new code end

        const [{
          monthNumberOfWorkingDays, monthFixedHr, monthTotalWorkHr, monthTotalExtraOrLess, monthAvgWorkTime, monthAvgExtraOrLess, monthAvgStartTime, monthAvgEndTime,
        }] = await LogModel.thisMonthReports(userId, monthStartDate, countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth))

        const thisMonthExtraOrLessHr = chckTotalWorkTimeExtraOrLess(monthTotalExtraOrLess)
        const monthReportDetails = new ReportDetails(
          monthNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth),
          monthFixedHr,
          monthTotalWorkHr,
          monthAvgWorkTime,
          monthAvgStartTime,
          monthAvgEndTime,
          monthAvgExtraOrLess,
          thisMonthExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth), monthNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth) || 0, monthNumberOfWorkingDays),
          isLowOrHighClassForHr(monthAvgExtraOrLess),
        )

        const lateCountsMonth = await LogModel.lateCountThisMonth(userId, monthStartDate)

        const lateCountThisMonth = lateCount(lateCountsMonth)
        const lateCountRatioMonth = Math.floor(Number(lateCountThisMonth / countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth) * 100)) || 0

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
        const thisYearDatesArr = []
        const thisYearTotalWorkdays = countUserJoinDate(countJoinIngDate, countThisYearWorkday)
        generateMultipleDate(thisYearTotalWorkdays, yearStartDate, thisYearDatesArr, dateFormate)
        const countHolidaysThisYear = await AttendanceModel.countHolidaysThisMonth(yearStartDate, userId)
        const countHolidaysThisYearArr = countHolidaysThisYear.map((el) => el.countHolidaysThisMonth)
        const holidaysStartDateThisYear = await AttendanceModel.getHolidaysStartDateThisMonth(yearStartDate, userId)
        const holidaysStartDateThisYearArr = holidaysStartDateThisYear.map((el) => el.holidaysStartDateThisMonth)
        const holidaysDatesThisYear = generateDatesFromBetweenNum(countHolidaysThisYearArr, holidaysStartDateThisYearArr, dateFormate)

        // count holidays end

        // count leavedays start
        const countThisYearLeavedays = await LogModel.countThisMonthLeavedays(userId, yearStartDate)
        const countThisYearLeavedaysArr = countThisYearLeavedays.map((el) => el.countLeaveDay)
        const countThisYearLeavedaysDatesArr = countThisYearLeavedays.map((el) => el.startDate)
        const thisYearLeavedaysDates = generateDatesFromBetweenNum(countThisYearLeavedaysArr, countThisYearLeavedaysDatesArr, dateFormate)
        const thisYearLeavedaysLen = thisYearLeavedaysDates.length
        // count leavedays end
        const uniqueHoliLeaveAndOffdaysDateThisYear = [...new Set([...holidaysDatesThisYear, ...thisYearDatesArr, ...thisYearLeavedaysDates])]

        const fixedWorkdayThisYear = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(uniqueHoliLeaveAndOffdaysDateThisYear), thisYearLeavedaysLen) - thisYearTotalOffdays

        //

        const [{
          yearNumberOfWorkingDays, yearFixedHr, yearTotalWorkHr, yearTotalExtraOrLess, yearAvgWorkTime, yearAvgExtraOrLess, yearAvgStartTime, yearAvgEndTime,
        }] = await LogModel.thisYearReports(userId, yearStartDate, countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear))

        const thisYearExtraOrLessHr = chckTotalWorkTimeExtraOrLess(yearTotalExtraOrLess)
        const yearReportDetails = new ReportDetails(
          yearNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear),
          yearFixedHr,
          yearTotalWorkHr,
          yearAvgWorkTime,
          yearAvgStartTime,
          yearAvgEndTime,
          yearAvgExtraOrLess,
          thisYearExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear), yearNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear), yearNumberOfWorkingDays),
          isLowOrHighClassForHr(yearAvgExtraOrLess),

        )
        const lateCountsYear = await LogModel.lateCountThisYear(userId, yearStartDate)
        const lateCountThisYear = lateCount(lateCountsYear)

        const lateCountRatioYear = Math.floor(Number(lateCountThisYear / countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear) * 100)) || 0
        

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
            lateCountRatioWeek,
            lateCountThisMonth,
            lateCountRatioMonth,
            lateCountThisYear,
            lateCountRatioYear,

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
            lateCountRatioWeek,
            lateCountThisMonth,
            lateCountRatioMonth,
            lateCountThisYear,
            lateCountRatioYear,

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

      // const betweenTwoDateWorkdays = (days === 0 ? 1 : days) - betweenTwoDateOffdays;
      // console.log('====>betweenTwoDateWorkdays', betweenTwoDateWorkdays);

      // TODO: new code start
      const { offDays } = await AttendanceModel.getOffDays()
      const { dayName } = await AttendanceModel.getDayName(startDate)
      // const countTotalOffDays = totalOffDays(offDays, dayName, countUserJoinDate(countJoinIngDate, betweenTwoDateWorkdays))

      // new
      const betweenTwoDateArr = []

      const totalWorkdays = countUserJoinDate(countJoinIngDate, days)

      generateMultipleDate(totalWorkdays, startDate, betweenTwoDateArr, dateFormate)

      // count holidays  start
      // count holidays  start
      const countHolidaysBetweenTwoDate = await AttendanceModel.countHolidaysBetweenTwoDate(startDate, endDate, userId)
      const countHolidaysBTDArr = countHolidaysBetweenTwoDate.map((el) => el.countHolidaysBetweenTwoDate)

      const holidaysStartDateBetweenTwoDate = await AttendanceModel.getHolidaysStartDateBetweenTwoDate(startDate, endDate, userId)
      const holidaysStartDateBTDArr = holidaysStartDateBetweenTwoDate.map((el) => el.holidaysStartDateBetweenTwoDate)

      const holidaysDatesBTD = generateDatesFromBetweenNum(countHolidaysBTDArr, holidaysStartDateBTDArr, dateFormate)

      // count leavedays start
      const countBTDLeavedays = await AttendanceModel.countBetweenTwoDatesLeavedays(startDate, endDate, userId)
      const countBTDLeavedaysArr = countBTDLeavedays.map((el) => el.countLeaveDay)

      const countBTDLeavedaysDatesArr = countBTDLeavedays.map((el) => el.startDate)

      const BTDLeavedaysDates = generateDatesFromBetweenNum(countBTDLeavedaysArr, countBTDLeavedaysDatesArr, dateFormate)
      const BTDLeavedaysLen = BTDLeavedaysDates.length

      // count leavedays end
      const uniqueBTDHoliLeaveAndOffdaysDate = [...new Set([...holidaysDatesBTD, ...betweenTwoDateArr, ...BTDLeavedaysDates])]

      const fixedWorkdayBTD = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(uniqueBTDHoliLeaveAndOffdaysDate), BTDLeavedaysLen) - betweenTwoDateOffdays
      // TODO: new code end
      // this month leave days
      // const getLeavedaysBetweenTwoDate = await LogModel.countLeavedaysBetweenTwoDate(userId, startDate, endDate)
      // const totalLeavedayBetweenTwoDate = sumLeavedays(getLeavedaysBetweenTwoDate)
      // const totalOffdayLeaveAndHolidays = totalLeavedayBetweenTwoDate + countTotalOffDays

      // FIXME::
      const [{
        twoDateNumberOfWorkingDays, twoDateFixedHr, twoDateTotalWorkHr, twoDateTotalExtraOrLess, twoDateAvgWorkTime, twoDateAvgExtraOrLess, twoDateAvgStartTime, twoDateAvgEndTime,
      }] = await LogModel.reportsBewttenTwoDate(userId, startDate, endDate, countUserJoinDate(countJoinIngDate, fixedWorkdayBTD))

      const betweenTwoDateExtraOrLessHr = chckTotalWorkTimeExtraOrLess(twoDateTotalExtraOrLess)
      const betweenTwoDatesReportDetails = new ReportDetails(
        twoDateNumberOfWorkingDays,
        countUserJoinDate(countJoinIngDate, fixedWorkdayBTD),
        twoDateFixedHr,
        twoDateTotalWorkHr,
        twoDateAvgWorkTime,
        twoDateAvgStartTime,
        twoDateAvgEndTime,
        twoDateAvgExtraOrLess,
        betweenTwoDateExtraOrLessHr,
        isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, fixedWorkdayBTD), twoDateNumberOfWorkingDays),
        showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, fixedWorkdayBTD), twoDateNumberOfWorkingDays),
        isLowOrHighClassForHr(twoDateAvgExtraOrLess),

      )

      // late count for between two date

      const lateCountsBetweenTwoDate = await LogModel.lateCountBetweenTwoDate(userId, startDate, endDate)
      const lateCountBetweenTwoDate = lateCount(lateCountsBetweenTwoDate)
      const lateCountRatio = Math.floor(Number(lateCountBetweenTwoDate / countUserJoinDate(countJoinIngDate, fixedWorkdayBTD) * 100))

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
      const limit = Number(req.query.limit) || process.env.PAGINATION_ROW
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
        dateRangeReportBox: { betweenTwoDatesReportDetails, lateCountBetweenTwoDate, lateCountRatio },
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
// for code holidays
function generateDatesFromBetweenNum(countDayArr, startDateArr, dateFormat) {
  const temp = []
  for (let i = 0; i < startDateArr.length; i += 1) {
    generateMultipleDate(countDayArr[i], `'${startDateArr[i]}'`, temp, dateFormat)
  }
  return temp
}
function generateWeekNames(getDate) {
  const dateArrlen = getDate.length
  const weekNameArr = []

  for (let i = 0; i < dateArrlen; i += 1) {
    weekNameArr.push(new Date(`'${getDate[i]}'`).toLocaleDateString('en-US', { weekday: 'long' }))
  }
  return weekNameArr
}
function totalWorkdaysExceptOffAndHolidays(offdays, weekNames, leavedaysLen) {
  const getOffDaysArr = [...offdays]
  for (let i = 0; i < getOffDaysArr.length; i += 1) {
    if (getOffDaysArr[i] === ',') {
      getOffDaysArr.splice(i, 1)
    }
  }
  const offDaysNameArr = getOffDaysArr.map((el) => numToDay(offDaysObj, Number(el || 0)))
  const offDaysLen = weekNames.filter((el) => offDaysNameArr.includes(el)).length
  const finalOffdaysLen = offDaysLen + cmpLeaveAndWeek(offDaysLen, leavedaysLen)
  const totalDays = weekNames.length - finalOffdaysLen
  return totalDays || 0
}
function cmpLeaveAndWeek(week, leave) {
  if (week === 0 && leave === 0) return 0;
  week <= 4 && leave <= 4 ? week++ : week
  if (week > leave) {
    return week
  } if (week < leave) {
    if (week === 2) {
      leave = 2
    } else if (week === 3) {
      leave = 3
    } else if (week === 4) {
      leave = 5
    } else if (week === 5) {
      leave = 5
    }
    return leave
  }
  return week
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
