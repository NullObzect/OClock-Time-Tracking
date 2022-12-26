const router = require('express').Router()
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const DashboardController = require('../controllers/DashboardController')
const ReportController = require('../controllers/ReportController')

router.get('/', decorateHtmlResponse('Dashboard'), checkLogin, DashboardController.getDashboard)
router.get('/admin-chart', DashboardController.chartDataAdmin)
router.get('/user-today-details-for-admin/:id', DashboardController.userTodayDetailsForAdmin)
router.get('/user-report/:api', ReportController.userReport)

module.exports = router
