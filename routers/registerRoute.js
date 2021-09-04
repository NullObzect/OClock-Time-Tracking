const router = require('express').Router();
const RegisterController = require('../controllers/RegisterController');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');
const { registerValidator } = require('../middleware/validator/registerValidator');

router.get('/register', decorateHtmlResponse('Register'), RegisterController.register);
router.post('/register', decorateHtmlResponse('Register'), registerValidator, RegisterController.registerController);

module.exports = router;
