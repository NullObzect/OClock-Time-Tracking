const router = require('express').Router()

const LoginController = require('../controllers/LoginController')
const { checkCurrentLogin } = require('../middleware/AuthMiddleware')
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse')
const { loginValidator } = require('../middleware/validator/loginValidator')

router.get('/', decorateHtmlResponse('Login'), LoginController.getLogin)
router.post('/', decorateHtmlResponse('Login'), checkCurrentLogin, loginValidator, LoginController.login)
module.exports = router
