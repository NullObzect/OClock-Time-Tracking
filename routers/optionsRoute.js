const router = require('express').Router();

const OptionsController = require('../controllers/OptionsController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin } = require('../middleware/common/AuthMiddleware')

router.get('/', decorateHtmlResponse('Options'), checkLogin, OptionsController.getOptionsList)
router.get('/projects', decorateHtmlResponse('Projects'), checkLogin, OptionsController.getProjects)
router.post('/projects', decorateHtmlResponse('Projects'), checkLogin, OptionsController.createProject)
router.get('/notice', decorateHtmlResponse('Notice'), checkLogin, OptionsController.getNotice)
router.post('/notice', decorateHtmlResponse('Notice'), checkLogin, OptionsController.sendNotice)
router.post('/contact-admin', decorateHtmlResponse('Notice'), checkLogin, OptionsController.contactAdmin)

module.exports = router
