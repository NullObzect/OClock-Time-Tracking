const router = require('express').Router();
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const DashboardController = require('../controllers/DashboardController')
const { checkLogin } = require('../middleware/common/AuthMiddleware')

router.get('/dashboard', decorateHtmlResponse('Dashboard'), checkLogin, DashboardController.getDashboard)
router.get('/get-start-data', DashboardController.getRunStartData)
router.post('/update-option-value', DashboardController.getUpdateOptionValues)


module.exports = router
