const router = require('express').Router()
const LeaveController = require('../controllers/LeaveController')
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')

router.get('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.getAddLeavedayPage)
router.post('/add-leaveday', decorateHtmlResponse('Add Leaveday'), LeaveController.addLeaveday)

module.exports = router
