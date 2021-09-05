const router = require('express').Router();
const DashboardController = require('../controllers/DashboardController')

const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

router.get('/dashboard', decorateHtmlResponse('Dashboard'), DashboardController.getDashboard)
module.exports = router
