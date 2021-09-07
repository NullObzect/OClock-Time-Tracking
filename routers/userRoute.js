const router = require('express').Router();
const UserController = require('../controllers/UserController');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');
const { registerValidator } = require('../middleware/validator/registerValidator');

router.get('/add-user', decorateHtmlResponse('Add User'), UserController.getUser);
router.post('/add-user', decorateHtmlResponse('Add User'), registerValidator, UserController.addUser);

module.exports = router;
