const router = require('express').Router()
const LeaveController = require('../controllers/LeaveController')
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')

router.get('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.getAddLeavedayPage)
router.post('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.addLeaveday)
router.get('/leavedays-list', decorateHtmlResponse('Leavedays'), LeaveController.employeeLeavedaysList)

router.get('/edit/leaveday/:id', decorateHtmlResponse('Edit Leavedays'), LeaveController.getEditLeavePage)
router.post('/edit/leaveday', LeaveController.setLeaveData)

module.exports = router