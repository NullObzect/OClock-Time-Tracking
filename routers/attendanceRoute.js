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

// for log
// SELECT user_id, in_time, out_time, TIME(MIN(start)) AS start, TIME(MAX(end)) AS end, TIME_FORMAT( O.option_value, '%h') AS work_hour, TIMEDIFF(SEC_TO_TIME(SUM(TIME_TO_SEC(end))), SEC_TO_TIME(SUM(TIME_TO_SEC(start)))) as totalWorkTime, work_details  FROM attendance JOIN options AS O ON o.option_title = 'fixed time'   WHERE user_id = 18 AND DATE(create_at) = CURRENT_DATE
module.exports = router;
