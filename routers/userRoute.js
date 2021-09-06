const router = require('express').Router();
const UserController = require('../controllers/UserController');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');
const { registerValidator } = require('../middleware/validator/registerValidator');

router.get('/user', decorateHtmlResponse('Register'), UserController.getUser);
router.post('/user', decorateHtmlResponse('Register'), registerValidator, UserController.addUser);

module.exports = router;
