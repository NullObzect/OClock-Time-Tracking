const router = require('express').Router()
const LoginController = require('../controllers/LoginController')
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse')

router.get('/', decorateHtmlResponse('Login'), LoginController.getLogin)
module.exports = router
