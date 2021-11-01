const AttendanceModel = require('../models/AttendanceModel');
const { timeToHour } = require('../utilities/formater');

const ReportController = {

  userReport: async (req, res) => {
    try {
      const userId = req.user.id;
      const userReport = await AttendanceModel.anEmployeeReportLastSavenDays(userId);
      const [{ avgStartTime }] = await AttendanceModel.avgStartTime(userId)
      const [{ avgEndTime }] = await AttendanceModel.avgEndTime(userId)
      const [{ weekTotal }] = await AttendanceModel.weekTotal(userId)
      const [{ monthTotal }] = await AttendanceModel.thisMonthTotal(userId)
      const weekHr = timeToHour(weekTotal)
      const monthHr = timeToHour(monthTotal)
      // for holidays
      const holidaysDate = await AttendanceModel.holidaysDate(userId);
      console.log(holidaysDate);

      res.render('pages/report', {
        userReport, avgStartTime, avgEndTime, weekHr, monthHr, holidaysDate,
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
      return res.json(getData);
    } catch (err) {
      console.log('====>Error form ReportController/reportBetweenTwoDate', err);
      return err;
    }
  },

}

module.exports = ReportController;
