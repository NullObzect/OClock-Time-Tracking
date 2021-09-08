const router = require('express').Router()

const LoginController = require('../controllers/LoginController')
const { checkCurrentLogin } = require('../middleware/common/AuthMiddleware')
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse')
const { loginValidator } = require('../middleware/login/loginValidator')

router.get('/', decorateHtmlResponse('Login'), LoginController.getLogin)
router.post('/', decorateHtmlResponse('Login'), checkCurrentLogin, loginValidator, LoginController.login)
module.exports = router
