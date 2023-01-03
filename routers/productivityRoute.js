const router = require('express').Router();
const Productivity = require('../controllers/Productivity');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin } = require('../middleware/common/AuthMiddleware')

router.get('/productivity', decorateHtmlResponse('Productivity'), checkLogin, Productivity.getProductivityPage)
router.get('/productivity-chart', checkLogin, Productivity.lastThirtydaysData)
module.exports = router
