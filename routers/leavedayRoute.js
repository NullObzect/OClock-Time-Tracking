const router = require('express').Router()
const LeaveController = require('../controllers/LeaveController')
const { checkLogin } = require('../middleware/common/AuthMiddleware')

const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')

// router.get('/leavedays', decorateHtmlResponse('Leavedays'), checkLogin, LeaveController.getAddLeavedayPage)
// router.get('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.getAddLeavedayPage)
router.post('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.addLeaveday)
router.get('/leavedays', decorateHtmlResponse('Leavedays'), checkLogin, LeaveController.employeeLeavedaysList)

router.post('/leavedays/update', LeaveController.setLeaveData)
router.get('/leavedays/delete/:id', LeaveController.getDeleteLeaveday)

module.exports = router
