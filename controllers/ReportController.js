/* eslint-disable no-undef */
const AttendanceModel = require('../models/AttendanceModel');
const { timeToHour } = require('../utilities/formater');
// grobal variable  multiple date
const holidaysArray = [];
const leaveDaysArray = [];
global.holidayAndLeavedaysDateRange = []
//

function dateFormate(dateTime) {
  const today = dateTime

  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
  const getDate = `${year}-${month}-${day}`;

  return getDate;
}
// holiday dates
function multipleDate(numOfDay, date) {
  const myDate = new Date(date);
  for (let i = 1; i <= numOfDay; i += 1) {
    holidaysArray.push(dateFormate(new Date(myDate.setDate(myDate.getDate() + 1))))
  }
}
// leave dates
function multipleLeaveDates(numOfDay, date) {
  const myDate = new Date(date);
  for (let i = 1; i <= numOfDay; i += 1) {
    leaveDaysArray.push(dateFormate(new Date(myDate.setDate(myDate.getDate() + 1))))
  }
}

const ReportController = {

  userReport: async (req, res) => {
    try {
      const userId = req.user.id;
      const lastSevenDaysReport = await AttendanceModel.anEmployeeReportLastSavenDays(userId);
      const [{ avgStartTime }] = await AttendanceModel.avgStartTime(userId)
      const [{ avgEndTime }] = await AttendanceModel.avgEndTime(userId)
      const [{ weekTotal }] = await AttendanceModel.weekTotal(userId)
      const [{ monthTotal }] = await AttendanceModel.thisMonthTotal(userId)
      const weekHr = timeToHour(weekTotal)
      const monthHr = timeToHour(monthTotal)
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
      const leaveDayObject = [];
      employeeWorkInLeaveDay.forEach((el) => {
        leaveDayObject.push({ l_date: el, type: 'leave', fixed_time: '0' })
      })

      const margeHolidaysAndLeaveDays = [...holidayObject, ...leaveDayObject]
      holidayAndLeavedaysDateRange = margeHolidaysAndLeaveDays;

      console.log(margeHolidaysAndLeaveDays)
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
      // console.log({ reportStringify })
      console.log(holidaysArray, leaveDaysArray);

      const userReport = [...reportStringify]

      res.render('pages/report', {
        userReport, avgStartTime, avgEndTime, weekHr, monthHr,
      });
    } catch (err) {
      console.log('====>Error form ReportController/ userReport', err);
      return err;
    }
  },
  // return data AJAX
  reportBetweenTwoDate: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      const getData = await AttendanceModel.anEmployeeReportBetweenTwoDate(userId, startDate, endDate);

      const dataToJson = JSON.parse(JSON.stringify(getData))
      // console.log({ dataToJson });
      // console.log({ holidayAndLeavedaysArrayForBetweenToDate });

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

      console.log({ dataToJson });

      return res.json(dataToJson);
    } catch (err) {
      console.log('====>Error form ReportController/reportBetweenTwoDate', err);
      return err;
    }
  },

}

module.exports = ReportController;
