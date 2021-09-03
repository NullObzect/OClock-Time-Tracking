const router = require('express').Router()
const LoginController = require('../controllers/LoginController')

router.get('/', LoginController.getLogin)
module.exports = router
