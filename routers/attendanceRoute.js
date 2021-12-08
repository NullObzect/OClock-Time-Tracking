const router = require('express').Router()
const AttendanceController = require('../controllers/AttendanceController');
const ReportController = require('../controllers/ReportController');
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

router.post('/attendance-start', AttendanceController.attendanceStart)
router.post('/attendance-end', AttendanceController.attendanceEnd)

// report router
// gr
router.get('/report', decorateHtmlResponse('Report'), checkLogin, ReportController.userReport)
router.get('/report/between/two-date', ReportController.reportBetweenTwoDate)
//
router.get('/report/employee/:id', decorateHtmlResponse('Employee Report'), ReportController.reportEmployees)
router.get('/report/between/two-date/:id', ReportController.reportBetweenTwoDateForAdmin)

module.exports = router;
