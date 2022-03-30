const router = require('express').Router()
const AttendanceController = require('../controllers/AttendanceController');
const ReportController = require('../controllers/ReportController');
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

router.post('/attendance-start', AttendanceController.attendanceStart)
router.post('/attendance-end', AttendanceController.attendanceEnd)
router.post('/update-end-time', AttendanceController.updateEndTime)
router.post('/update-start-time', AttendanceController.updateStartTime)

// router.get('/start-time', AttendanceController.startTime)

// reports router
// gr
router.get('/reports', decorateHtmlResponse('Report'), checkLogin, ReportController.userReport)
router.get('/reports/:id', decorateHtmlResponse('Report'), checkLogin, ReportController.userReport)
//
router.get('/reports/between/two-date', ReportController.reportBetweenTwoDate)
//
// router.get('/reports/between/two-date/:id', ReportController.reportBetweenTwoDate)

// router.get('/reports/employee/:id', decorateHtmlResponse('Employee Report'), ReportController.reportEmployees)
// router.get('/reports/between/two-date/:id', ReportController.reportBetweenTwoDateForAdmin)

module.exports = router;
