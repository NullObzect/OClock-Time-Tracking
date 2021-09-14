const router = require('express').Router();
const UserController = require('../controllers/UserController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin, requireRole } = require('../middleware/common/AuthMiddleware')
const { userValidator } = require('../middleware/user/userValidator');

router.get('/add-user', decorateHtmlResponse('Add User'), checkLogin, requireRole(['admin']), UserController.getUser);
router.post('/add-user', decorateHtmlResponse('Add User'), userValidator, UserController.addUser);
router.get('/all-users', decorateHtmlResponse('All User'), checkLogin, requireRole(['admin']), UserController.allUsersList)
router.get('/users-list', decorateHtmlResponse('Users List'), checkLogin, requireRole(['admin']), UserController.usersList)
router.get('/admin-list', decorateHtmlResponse('Admin List'), checkLogin, requireRole(['admin']), UserController.adminList)
router.get('/delete/user/:id', decorateHtmlResponse('Delete'), checkLogin, requireRole(['admin']), UserController.deleteUser)

module.exports = router;
