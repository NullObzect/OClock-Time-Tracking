const router = require('express').Router()

const LoginController = require('../controllers/LoginController')
const { checkCurrentLogin, redirectLoggedIn } = require('../middleware/common/AuthMiddleware')
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')
const { loginValidator, loginValidationHandler } = require('../middleware/login/loginValidator')

router.get('/', decorateHtmlResponse('Login'), redirectLoggedIn, LoginController.getLogin)
router.post('/', decorateHtmlResponse('Login'), checkCurrentLogin, loginValidator, loginValidationHandler, LoginController.login)
module.exports = router
