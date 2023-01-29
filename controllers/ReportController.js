/* eslint-disable space-before-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-assign */
/* eslint-disable max-len */
const AttendanceModel = require('../models/AttendanceModel');
const LogModel = require('../models/LogModel');
const ProfileModel = require('../models/ProfileModel')
const { pageNumbers } = require('../utilities/pagination')
const {
  timeToHour, workHourFormateForReport, generateMultipleDate, dateFormate, offDaysObject, numOfDay, getNumToDay, generateWeekName,
  convertSecToHr,
} = require('../utilities/formater');
const OptionsModel = require('../models/OptionsModel');
const UserModel = require('../models/UserModel');
const HolidayModel = require('../models/HolidayModel');
const LeaveModel = require('../models/LeaveModel');

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
      const userRole = await AttendanceModel.getEmployeeInfo(userId)

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
        const { weeklyLeaveDay } = await AttendanceModel.weeklyLeaveDay()
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

        const holidaysStartDateThisWeek = await AttendanceModel.getHolidaysStartDateThisMonth(weekStartDate, userId)
        const holidaysStartDateThisWeekArr = holidaysStartDateThisWeek.map((el) => el.holidaysStartDateThisMonth)
        const holidaysDatesThisWeek = generateDatesFromBetweenNum(countHolidaysThisWeekArr, holidaysStartDateThisWeekArr, dateFormate)
        // count holidays end
        // count leavedays start
        const countThisWeekLeavedays = await LogModel.countThisMonthLeavedays(userId, weekStartDate)
        const countThisWeekLeavedaysArr = countThisWeekLeavedays.map((el) => el.countLeaveDay)
        const countThisWeekLeavedaysDatesArr = countThisWeekLeavedays.map((el) => el.startDate)
        const thisWeekLeavedaysDates = generateDatesFromBetweenNum(countThisWeekLeavedaysArr, countThisWeekLeavedaysDatesArr, dateFormate)
        // count leavedays end
        const uniqueHoliLeaveAndOffdaysDateThisWeek = [...new Set([...holidaysDatesThisWeek, ...thisWeekDatesArr, ...thisWeekLeavedaysDates])]

        const thisWeekFinalDateArr = uniqueHoliLeaveAndOffdaysDateThisWeek.filter((el) => !holidaysDatesThisWeek.includes(el) && !thisWeekLeavedaysDates.includes(el))

        const fixedWorkdayThisWeek = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(thisWeekFinalDateArr))

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
        const [{ joiningDate }] = await AttendanceModel.getThisMonthDate(monthStartDate, userId)
        const getThisMonthStartDate = joiningDate
        const monthdaysType = await LogModel.countWorkdaysForMonth(userId, getThisMonthStartDate)
        const workInThisMonthTotalOffdays = monthdaysType.filter((el) => el.workdays === 0).length

        // TODO: new code start
        const offdaysAndHolidaysDateArr = []
        const thisMonthTotalWorkdays = countUserJoinDate(countJoinIngDate, countWorkday)
        generateMultipleDate(thisMonthTotalWorkdays, getThisMonthStartDate, offdaysAndHolidaysDateArr, dateFormate)

        // count holidays  start

        // FIXME: new bug
        const countHolidaysThisMonth = await AttendanceModel.countHolidaysThisMonth(getThisMonthStartDate, userId)
        const countHolidaysThisMonthArr = countHolidaysThisMonth.map((el) => el.countHolidaysThisMonth)
        const holidaysStartDateThisMonth = await AttendanceModel.getHolidaysStartDateThisMonth(getThisMonthStartDate, userId)
        const holidaysStartDateThisMonthArr = holidaysStartDateThisMonth.map((el) => el.holidaysStartDateThisMonth)

        const holidaysDates = generateDatesFromBetweenNum(countHolidaysThisMonthArr, holidaysStartDateThisMonthArr, dateFormate)
        // count holidays end
        // count leavedays start
        const countThisMonthLeavedays = await LogModel.countThisMonthLeavedays(userId, getThisMonthStartDate)

        console.log({ countThisMonthLeavedays });

        const countThisMonthLeavedaysArr = countThisMonthLeavedays.map((el) => el.countLeaveDay)
        const countThisMonthLeavedaysDatesArr = countThisMonthLeavedays.map((el) => el.startDate)

        const thisMonthLeavedaysDates = generateDatesFromBetweenNum(countThisMonthLeavedaysArr, countThisMonthLeavedaysDatesArr, dateFormate)
        console.log({ thisMonthLeavedaysDates });

        // console.log({ thisMonthLeavedaysDates });
        // console.log({ holidaysDates });
        // console.log({ offdaysAndHolidaysDateArr });

        // count leavedays end
        const uniqueHoliLeaveAndOffdaysDate = [...new Set([...holidaysDates, ...offdaysAndHolidaysDateArr, ...thisMonthLeavedaysDates])]

        const thisMonthFinalDateArr = uniqueHoliLeaveAndOffdaysDate.filter((el) => !holidaysDates.includes(el) && !thisMonthLeavedaysDates.includes(el))

        const fixedWorkdayThisMonth = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(thisMonthFinalDateArr), arrFirstAndLastEel(offdaysAndHolidaysDateArr), Number(weeklyLeaveDay))

        // TODO: new code end

        const [{
          monthNumberOfWorkingDays, monthFixedHr, monthTotalWorkHr, monthTotalExtraOrLess, monthAvgWorkTime, monthAvgExtraOrLess, monthAvgStartTime, monthAvgEndTime,
        }] = await LogModel.thisMonthReports(userId, getThisMonthStartDate, countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth))

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
        const lateCountsMonth = await LogModel.lateCountThisMonth(userId, getThisMonthStartDate)
        const lateCountThisMonth = lateCount(lateCountsMonth)
        const lateCountRatioMonth = Math.floor(Number(lateCountThisMonth / countUserJoinDate(countJoinIngDate, fixedWorkdayThisMonth) * 100)) || 0

        /* ======================================================== */
        /* ==========FIXME:  report for this month  END ========== */
        /* ======================================================== */

        /* ======================================================== */
        /* ==========TODO:  report for this year  start ========== */
        /* ======================================================== */

        const [{ yearStartDate, countThisYearWorkday }] = await AttendanceModel.thisYearDates()

        const [{ joiningDateYear }] = await AttendanceModel.getThisYearDate(yearStartDate, userId)

        const getThisYearStartDate = joiningDateYear

        const yeardaysType = await LogModel.countWorkdaysForMonth(userId, getThisYearStartDate)
        const thisYearTotalOffdays = yeardaysType.filter((el) => el.workdays === 0).length
        // TODO: new code start
        const thisYearDatesArr = []
        const thisYearTotalWorkdays = countUserJoinDate(countJoinIngDate, countThisYearWorkday)

        generateMultipleDate(thisYearTotalWorkdays, getThisYearStartDate, thisYearDatesArr, dateFormate)
        const countHolidaysThisYear = await AttendanceModel.countHolidaysThisMonth(getThisYearStartDate, userId)
        const countHolidaysThisYearArr = countHolidaysThisYear.map((el) => el.countHolidaysThisMonth)
        const holidaysStartDateThisYear = await AttendanceModel.getHolidaysStartDateThisMonth(getThisYearStartDate, userId)
        const holidaysStartDateThisYearArr = holidaysStartDateThisYear.map((el) => el.holidaysStartDateThisMonth)
        const holidaysDatesThisYear = generateDatesFromBetweenNum(countHolidaysThisYearArr, holidaysStartDateThisYearArr, dateFormate)

        // count holidays end

        // count leavedays start
        const countThisYearLeavedays = await LogModel.countThisMonthLeavedays(userId, getThisYearStartDate)
        const countThisYearLeavedaysArr = countThisYearLeavedays.map((el) => el.countLeaveDay)
        const countThisYearLeavedaysDatesArr = countThisYearLeavedays.map((el) => el.startDate)
        const thisYearLeavedaysDates = generateDatesFromBetweenNum(countThisYearLeavedaysArr, countThisYearLeavedaysDatesArr, dateFormate)

        // count leavedays end
        const uniqueHoliLeaveAndOffdaysDateThisYear = [...new Set([...holidaysDatesThisYear, ...thisYearDatesArr, ...thisYearLeavedaysDates])]
        const thisYearFinalDateArr = uniqueHoliLeaveAndOffdaysDateThisYear.filter((el) => !holidaysDatesThisYear.includes(el) && !thisYearLeavedaysDates.includes(el))

        const fixedWorkdayThisYear = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(thisYearFinalDateArr))
        //

        const [{
          yearNumberOfWorkingDays, yearFixedHr, yearTotalWorkHr, yearTotalExtraOrLess, yearAvgWorkTime, yearAvgExtraOrLess, yearAvgStartTime, yearAvgEndTime,
        }] = await LogModel.thisYearReports(userId, getThisYearStartDate, countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear))

        const thisYearExtraOrLessHr = chckTotalWorkTimeExtraOrLess(yearTotalExtraOrLess)
        const yearReportDetails = new ReportDetails(
          yearNumberOfWorkingDays,
          countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear),
          yearFixedHr,
          convertSecToHr(yearTotalWorkHr),
          yearAvgWorkTime,
          yearAvgStartTime,
          yearAvgEndTime,
          yearAvgExtraOrLess,
          thisYearExtraOrLessHr,
          isLowOrHighClassForday(countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear), yearNumberOfWorkingDays),
          showDaysIsLowOrHigh(countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear), yearNumberOfWorkingDays),
          isLowOrHighClassForHr(yearAvgExtraOrLess),

        )
        const lateCountsYear = await LogModel.lateCountThisYear(userId, getThisYearStartDate)
        const lateCountThisYear = lateCount(lateCountsYear)

        const lateCountRatioYear = Math.floor(Number(lateCountThisYear / countUserJoinDate(countJoinIngDate, fixedWorkdayThisYear) * 100)) || 0

        // TODO: new feature  for missing date

        /*
          1. get join date
          2. get join date to current date & return  number of day
          3. off days, holidays, leave days date array
          4. present date array
          6. unique date array  (present date array + off days, holidays, leave days date array)
          7. missing date array (join date to current date - unique date array)
          8. missing date array length
        */
        const numOfDayJoiningDateToCurrentDate = await UserModel.numOfDayJoiningDateToCurrentDate(userId)
        const allDateArr = []
        generateMultipleDate(numOfDayJoiningDateToCurrentDate.numOfDay, numOfDayJoiningDateToCurrentDate.joiningDate, allDateArr, dateFormate)
        // holidays date
        const countDayAndStartDate = await HolidayModel.countDayAndStartDateForHoliday(userId)
        const countDay = countDayAndStartDate.map((el) => el.countDay)
        const startDate = countDayAndStartDate.map((el) => el.startDate)
        const holidayDateArr = []
        for (let i = 0; i < countDay.length; i += 1) {
          generateMultipleDate(countDay[i], startDate[i], holidayDateArr, dateFormate)
        }
        // leave date
        const countDayAndStartDateForLeave = await LeaveModel.countDayAndStartDateForLeaveDay(userId)
        const countDayForLeave = countDayAndStartDateForLeave.map((el) => el.countDay)
        const startDateForLeave = countDayAndStartDateForLeave.map((el) => el.startDate)
        const leaveDateArr = []
        for (let i = 0; i < countDayForLeave.length; i += 1) {
          generateMultipleDate(countDayForLeave[i], startDateForLeave[i], leaveDateArr, dateFormate)
        }
        // off date
        const offDateArr = []
        for (let i = 0; i < allDateArr.length; i += 1) {
          if (generateWeekName(allDateArr[i]) == getNumToDay(offDays[0], numOfDay, offDaysObject)) {
            offDateArr.push(allDateArr[i])
          }
          if (offDays.length > 1){
            if (generateWeekName(allDateArr[i]) == getNumToDay(offDays[2], numOfDay, offDaysObject)) {
              offDateArr.push(allDateArr[i])
            }
          }
        }
        // work date date
        const getWorkingDate = await LogModel.workingDate(userId)
        const workingDateArr = getWorkingDate.map((el) => el.workingDate)
        const uniqueDateArr = [...new Set([...holidayDateArr, ...leaveDateArr, ...offDateArr, ...workingDateArr])]
        const missingDateArr = allDateArr.filter((el) => !uniqueDateArr.includes(el))

        // TODO: new feature  for missing date  generate  automated

        const lastTendayData = await LogModel.lastTendaysData(userId)
        const loggedInuser = res.locals.loggedInUser

        console.log({ loggedInuser });

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
            loggedInuser,

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
            missingDateArr,
            userRole,
            loggedInuser,

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
      // TODO: new code start
      const { offDays } = await AttendanceModel.getOffDays()
      const { weeklyLeaveDay } = await AttendanceModel.weeklyLeaveDay()
      // new
      const betweenTwoDateArr = []
      const totalWorkdays = countUserJoinDate(countJoinIngDate, days)
      generateMultipleDate(totalWorkdays, startDate, betweenTwoDateArr, dateFormate)

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

      // FIXME:
      // count leavedays end
      const uniqueBTDHoliLeaveAndOffdaysDate = [...new Set([...holidaysDatesBTD, ...betweenTwoDateArr, ...BTDLeavedaysDates])]

      const finalBTDDatesArr = uniqueBTDHoliLeaveAndOffdaysDate.filter((el) => !holidaysDatesBTD.includes(el) && !BTDLeavedaysDates.includes(el))

      const fixedWorkdayBTD = totalWorkdaysExceptOffAndHolidays(offDays, generateWeekNames(finalBTDDatesArr))

      // TODO: new code end

      // FIXME::
      const [{
        twoDateNumberOfWorkingDays, twoDateFixedHr, twoDateTotalWorkHr, twoDateTotalExtraOrLess, twoDateAvgWorkTime, twoDateAvgExtraOrLess, twoDateAvgStartTime, twoDateAvgEndTime,
      }] = await LogModel.reportsBewttenTwoDate(userId, startDate, endDate, countUserJoinDate(countJoinIngDate, fixedWorkdayBTD))

      const betweenTwoDateExtraOrLessHr = chckTotalWorkTimeExtraOrLess(twoDateTotalExtraOrLess)
      const betweenTwoDatesReportDetails = new ReportDetails(
        twoDateNumberOfWorkingDays,
        countUserJoinDate(countJoinIngDate, fixedWorkdayBTD),
        twoDateFixedHr,
        convertSecToHr(twoDateTotalWorkHr),
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
      const limit = Number(req.query.limit) || process.env.PAGINATION_ROW || 10
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

  absentDate: async (req, res) => {
    const { offDays } = await AttendanceModel.getOffDays()

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
      // TODO: new feature  for missing date

      /*
          1. get join date
          2. get join date to current date & return  number of day
          3. off days, holidays, leave days date array
          4. present date array
          6. unique date array  (present date array + off days, holidays, leave days date array)
          7. missing date array (join date to current date - unique date array)
          8. missing date array length
        */
      const numOfDayJoiningDateToCurrentDate = await UserModel.numOfDayJoiningDateToCurrentDate(userId)
      const allDateArr = []
      generateMultipleDate(numOfDayJoiningDateToCurrentDate.numOfDay, numOfDayJoiningDateToCurrentDate.joiningDate, allDateArr, dateFormate)
      // holidays date
      const countDayAndStartDate = await HolidayModel.countDayAndStartDateForHoliday(userId)
      const countDay = countDayAndStartDate.map((el) => el.countDay)
      const startDate = countDayAndStartDate.map((el) => el.startDate)
      const holidayDateArr = []
      for (let i = 0; i < countDay.length; i += 1) {
        generateMultipleDate(countDay[i], startDate[i], holidayDateArr, dateFormate)
      }
      // leave date
      const countDayAndStartDateForLeave = await LeaveModel.countDayAndStartDateForLeaveDay(userId)
      const countDayForLeave = countDayAndStartDateForLeave.map((el) => el.countDay)
      const startDateForLeave = countDayAndStartDateForLeave.map((el) => el.startDate)
      const leaveDateArr = []
      for (let i = 0; i < countDayForLeave.length; i += 1) {
        generateMultipleDate(countDayForLeave[i], startDateForLeave[i], leaveDateArr, dateFormate)
      }
      // off date
      const offDateArr = []
      for (let i = 0; i < allDateArr.length; i += 1) {
        if (generateWeekName(allDateArr[i]) == getNumToDay(offDays[0], numOfDay, offDaysObject)) {
          offDateArr.push(allDateArr[i])
        }
        if (offDays.length > 1){
          if (generateWeekName(allDateArr[i]) == getNumToDay(offDays[2], numOfDay, offDaysObject)) {
            offDateArr.push(allDateArr[i])
          }
        }
      }
      // work date date
      const getWorkingDate = await LogModel.workingDate(userId)
      const workingDateArr = getWorkingDate.map((el) => el.workingDate)
      const uniqueDateArr = [...new Set([...holidayDateArr, ...leaveDateArr, ...offDateArr, ...workingDateArr])]
      const missingDateArr = allDateArr.filter((el) => !uniqueDateArr.includes(el))

      // TODO: new feature  for missing date  generate  automated

      const lastTendayData = await LogModel.lastTendaysData(userId)
      res.json({ absentDate: missingDateArr, lastTendayData })
    } catch (err) {
      console.log('====>Error form ReportController/absentDate', err);
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
// generate off-day arr
function offDayArr(offdays){
  const getOffDaysArr = [...offdays]
  for (let i = 0; i < getOffDaysArr.length; i += 1) {
    if (getOffDaysArr[i] === ',') {
      getOffDaysArr.splice(i, 1)
    }
  }
  const offDaysNameArr = getOffDaysArr.map((el) => numToDay(offDaysObj, Number(el || 0)))
  return offDaysNameArr
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
function totalWorkdaysExceptOffAndHolidays(offdays, weekNames) {
  const getOffDaysArr = [...offdays]
  for (let i = 0; i < getOffDaysArr.length; i += 1) {
    if (getOffDaysArr[i] === ',') {
      getOffDaysArr.splice(i, 1)
    }
  }
  const offDaysNameArr = getOffDaysArr.map((el) => numToDay(offDaysObj, Number(el || 0)))

  const offDaysLen = weekNames.filter((el) => offDaysNameArr.includes(el)).length

  const totalDays = weekNames.length - offDaysLen
  return totalDays || 0
}
function countLeaveDay(offDayLen, offDayNameArr, betweenTwoNameArr){
  const bothTrue = betweenTwoNameArr.every((el) => offDayNameArr.includes(el))

  const oneIsTrue = offDayNameArr.filter((el) => betweenTwoNameArr.includes(el)).length

  if (bothTrue){
    return offDayLen - 1;
  } if (oneIsTrue){
    return offDayLen
  }

  return offDayLen + 1;
}

//
function arrFirstAndLastEel(arr) {
  const first = arr[0]
  const last = arr[arr.length - 1]
  console.log({ first, last });

  return [first, last]
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
