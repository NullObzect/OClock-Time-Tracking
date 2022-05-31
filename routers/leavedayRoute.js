const router = require('express').Router()
const LeaveController = require('../controllers/LeaveController')
const { checkLogin, requireRole } = require('../middleware/common/AuthMiddleware')

const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')

// router.get('/leavedays', decorateHtmlResponse('Leavedays'), checkLogin, LeaveController.getAddLeavedayPage)
// router.get('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.getAddLeavedayPage)
router.post('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.addLeaveday)
router.get('/leavedays', decorateHtmlResponse('Leavedays'), checkLogin, LeaveController.employeeLeavedaysList)
router.get('/leavedays/:id', requireRole(['admin']), decorateHtmlResponse('Leavedays'), checkLogin, LeaveController.employeeLeavedaysList)

router.post('/leavedays/update', LeaveController.setLeaveData)
router.get('/leavedays/delete/:id', LeaveController.getDeleteLeaveday)
router.get('/leavedays/between-two-date', LeaveController.getLeavedayListBetweenTwoDate)
router.get('/leavedays/:id/between-two-date', LeaveController.getLeavedayListBetweenTwoDate)

// Request leave

router.get('/request-leave', decorateHtmlResponse('Request Leave'), checkLogin, LeaveController.requestLeaveList)
router.post('/send-request-leave', LeaveController.sendRequestLeave)

router.post('/add-leave-type', LeaveController.addLeaveType)
router.get('/accept-leave-request/:id', LeaveController.acceptRequestLeave)
router.get('/reject-leave-request/:id', LeaveController.rejectRequestLeave)
router.post('/edit-leave-type', LeaveController.editLeaveType)

module.exports = router
