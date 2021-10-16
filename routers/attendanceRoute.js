const router = require('express').Router()
const AttendanceController = require('../controllers/AttendanceController');
const { checkLogin } = require('../middleware/common/AuthMiddleware');

// router.get('/attendance', AttendanceController.userAttendance)
router.post('/attendance-start', AttendanceController.attendanceStart)

router.post('/attendance-end', AttendanceController.attendanceEnd)

module.exports = router;
