const router = require('express').Router();
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const DashboardController = require('../controllers/DashboardController')

router.get('/dashboard', decorateHtmlResponse('Dashboard'), DashboardController.getDashboard)
module.exports = router
