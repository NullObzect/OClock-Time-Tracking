const router = require('express').Router();
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const DashboardController = require('../controllers/DashboardController')
const { checkLogin } = require('../middleware/common/AuthMiddleware')

router.get('/dashboard', decorateHtmlResponse('Dashboard'), checkLogin, DashboardController.getDashboard)
module.exports = router
