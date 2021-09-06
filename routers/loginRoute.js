const router = require('express').Router()

const LoginController = require('../controllers/LoginController')
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse')
const { loginValidator } = require('../middleware/validator/loginValidator')

router.get('/', decorateHtmlResponse('Login'), LoginController.getLogin)
router.post('/', decorateHtmlResponse('Login'), loginValidator, LoginController.loginController)
module.exports = router
