const router = require('express').Router();
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const HomeController = require('../controllers/HomeController')
const { checkLogin } = require('../middleware/common/AuthMiddleware')

router.get('/home', decorateHtmlResponse('Home'), checkLogin, HomeController.getHome)
router.get('/get-start-data', HomeController.getRunStartData)
router.post('/update-option-value', HomeController.getUpdateOptionValues)

module.exports = router
