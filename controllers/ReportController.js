const AttendanceModel = require('../models/AttendanceModel');

const ReportController = {

  userReport: async (req, res) => {
    try {
      const userId = req.user.id;
      const userReport = await AttendanceModel.anEmployeeReportLastSavenDays(userId);

      res.render('pages/report', { userReport });
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
