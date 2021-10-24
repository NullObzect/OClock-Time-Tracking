const router = require('express').Router()
const AttendanceController = require('../controllers/AttendanceController');
const ReportController = require('../controllers/ReportController');
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

router.post('/attendance-start', AttendanceController.attendanceStart)
router.post('/attendance-end', AttendanceController.attendanceEnd)

// report router
router.get('/report', decorateHtmlResponse('Report'), ReportController.userReport)
router.get('/report/between/two-date', ReportController.reportBetweenTwoDate)

module.exports = router;
