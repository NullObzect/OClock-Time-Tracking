const router = require('express').Router();
const UserController = require('../controllers/UserController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin, requireRole } = require('../middleware/common/AuthMiddleware')
const { userValidator } = require('../middleware/user/userValidator');
const avatarUpload = require('../middleware/user/avatarUpload');

router.get('/add-user', decorateHtmlResponse('Add User'), checkLogin, requireRole(['admin']), UserController.getUser);
router.post('/add-user', decorateHtmlResponse('Add User'), avatarUpload, userValidator, UserController.addUser);
router.get('/all-users', decorateHtmlResponse('All User'), checkLogin, requireRole(['admin']), UserController.allUsersList)
router.get('/users-list', checkLogin, requireRole(['admin']), UserController.usersList)
router.get('/admin-list', checkLogin, requireRole(['admin']), UserController.adminList)
router.get('/delete/user/:id', decorateHtmlResponse('Delete'), checkLogin, requireRole(['admin']), UserController.deleteUser)

// users sorting  ASC & DCS order
router.get('/async/users/list', checkLogin, requireRole(['admin']), UserController.userSortByAscendingOrder)
router.get('/desc/users/list', checkLogin, requireRole(['admin']), UserController.userSortByDescendingOrder)
// Router for user view
router.get('/user/view', UserController.userView)
// Router for search user
router.get('/search/user', checkLogin, requireRole(['admin']), UserController.searchUser)

router.get('/find-user', decorateHtmlResponse('Find-user'), UserController.getFindUser)
router.post('/find-user', decorateHtmlResponse('Find-user'), UserController.postFindUser)
router.post('/recover', decorateHtmlResponse('Recover'), UserController.recoverUser)
router.get('/recover/:token', decorateHtmlResponse('Recover'), UserController.recoverUserVerify)

// update password
router.post('/update-password', UserController.userUpdatePassword)

// Verify User

router.get('/user-verify', UserController.userVerify)
router.get('/user-verify/:token', UserController.userVerifySet)

// Forget user
// router.get('/forgot-password', UserController.getUserForgotPassword)
// router.post('/forgot-password', UserController.userForgotPassword)

// User Avatar Change
router.post('/user-avatar-change', decorateHtmlResponse('Update User'), avatarUpload, UserController.avatarChange)

// update user
router.get('/update-user/:id', decorateHtmlResponse('Update User'), UserController.updateUser)

module.exports = router;
