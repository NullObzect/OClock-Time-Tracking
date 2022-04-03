const router = require('express').Router();

const OptionsController = require('../controllers/OptionsController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin, requireRole } = require('../middleware/common/AuthMiddleware')

router.get('/', decorateHtmlResponse('Options'), checkLogin, OptionsController.getOptionsList)
router.get('/option-values', decorateHtmlResponse('Options'), checkLogin, OptionsController.getOptionValues)
router.get('/projects', decorateHtmlResponse('Projects'), checkLogin, OptionsController.getProjects)
router.post('/projects', decorateHtmlResponse('Projects'), checkLogin, OptionsController.createProject)
router.get('/notice', decorateHtmlResponse('Notice'), checkLogin, OptionsController.getNotice)
router.post('/notice', decorateHtmlResponse('Notice'), checkLogin, OptionsController.sendNotice)
router.post('/contact-admin', decorateHtmlResponse('Notice'), checkLogin, OptionsController.contactAdmin)
// update option values
router.post('/option-values/update-option-value', OptionsController.getUpdateOptionValues)
router.post('/projects/update-project', OptionsController.getUpdateProject)
router.get('/projects/delete/:id', decorateHtmlResponse('Delete'), checkLogin, requireRole(['admin']), OptionsController.getDeleteProject)

module.exports = router
