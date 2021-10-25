const AttendanceModel = require('../models/AttendanceModel');
const { timeToHour } = require('../utilities/formater')

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
      res.render('pages/report', {
        userReport, avgStartTime, avgEndTime, weekHr, monthHr,
      });
    } catch (err) {
      console.log('====>Error form ReportController/ userReport', err);
    }
  },
  reportBetweenTwoDate: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log({ userId })

      const { startDate, endDate } = req.query;
      console.log('xxxx', startDate, endDate);

      const getData = await AttendanceModel.anEmployeeReportBetweenTwoDate(userId, startDate, endDate);
      console.log('data', getData)
      return res.json(getData);
    } catch (err) {
      console.log('====>Error form ReportController/reportBetweenTwoDate', err);
      return err;
    }
  },

}

module.exports = ReportController;
