const router = require('express').Router()
const HolidayController = require('../controllers/HolidayController')
const { checkLogin } = require('../middleware/common/AuthMiddleware')
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')

router.get('/holiday', decorateHtmlResponse('Holiday'), checkLogin, HolidayController.holidayList)

router.post('/add-holiday', decorateHtmlResponse('Add Holiday'), HolidayController.addHoliday)
router.get('/edit/holiday/:id', decorateHtmlResponse('Edit Holiday'), HolidayController.getEditHolidayPage)
router.post('/holiday/edit/holiday', decorateHtmlResponse('Edit Holiday'), HolidayController.getUpdateHoliday)

router.get('/delete/holiday/:id', HolidayController.getDeleteHoliday)

router.get('/employee-see/holidays', decorateHtmlResponse('Holidays'), checkLogin, HolidayController.employeeSeeHolidays)

module.exports = router
