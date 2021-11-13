const router = require('express').Router()
const HolidayController = require('../controllers/HolidayControlle')
// const { checkLogin } = require('../middleware/common/AuthMiddleware')
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')

router.get('/add-holiday', decorateHtmlResponse('Add Holiday'), HolidayController.getAddHolidayPage)
router.post('/add-holiday', decorateHtmlResponse('Add Holiday'), HolidayController.addHoliday)
module.exports = router
