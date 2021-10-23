const router = require('express').Router()
const AttendanceController = require('../controllers/AttendanceController');

router.post('/attendance-start', AttendanceController.attendanceStart)
router.post('/attendance-end', AttendanceController.attendanceEnd)

module.exports = router;
