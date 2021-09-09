const router = require('express').Router();
const UserController = require('../controllers/UserController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin, requireRole } = require('../middleware/common/AuthMiddleware')
const { userValidator } = require('../middleware/user/userValidator');

router.get('/add-user', decorateHtmlResponse('Add User'), checkLogin, requireRole(['admin']), UserController.getUser);
router.post('/add-user', decorateHtmlResponse('Add User'), userValidator, UserController.addUser);

module.exports = router;
