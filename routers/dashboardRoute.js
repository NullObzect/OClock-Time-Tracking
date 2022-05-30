const router = require('express').Router()
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const DashboardController = require('../controllers/DashboardController')

router.get('/', decorateHtmlResponse('Dashboard'), checkLogin, DashboardController.getDashboard )
module.exports = router
