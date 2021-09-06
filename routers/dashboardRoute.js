const router = require('express').Router();
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');
const DashboardController = require('../controllers/DashboardController')

router.get('/dashboard', decorateHtmlResponse('Dashboard'), DashboardController.getDashboard)
module.exports = router
