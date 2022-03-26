const router = require('express').Router();
const UserController = require('../controllers/UserController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin, requireRole } = require('../middleware/common/AuthMiddleware')
const { userValidator, addUserValidationHandler } = require('../middleware/user/userValidator');
const { updateUserValidator, updateUserValidationHandler } = require('../middleware/user/updateUserValidator');
const avatarUpload = require('../middleware/user/avatarUpload');

router.get('/users', decorateHtmlResponse('Add User'), checkLogin, requireRole(['admin']), UserController.getUsers);
router.post('/add-user', decorateHtmlResponse('Add User'), avatarUpload, userValidator, addUserValidationHandler, UserController.addUser);
router.get('/users', decorateHtmlResponse('Users'), checkLogin, requireRole(['admin']), UserController.allUsersList)
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

router.get('/search-user', decorateHtmlResponse('search-user'), UserController.getSearchUser)

router.post('/search-user', decorateHtmlResponse('search-user'), UserController.postSearchUser)

router.post('/search-inactive-user', decorateHtmlResponse('search-user'), UserController.postSearchInactiveUser)

router.get('/search-account-active', decorateHtmlResponse('search-user'), UserController.getAccountActive)

router.post('/recover', decorateHtmlResponse('Recover'), UserController.recoverUser)
router.get('/recover/:token', decorateHtmlResponse('Recover'), UserController.recoverUserVerify)

// update password
router.post('/update-password', UserController.userUpdatePassword)

// Verify User

router.post('/user-verify', UserController.userVerify)
router.get('/user-verify/:token', UserController.userVerifySet)

// Forget user
// router.get('/forgot-password', UserController.getUserForgotPassword)
// router.post('/forgot-password', UserController.userForgotPassword)

// User Avatar Change
router.post('/user-avatar-change', decorateHtmlResponse('Update User'), avatarUpload, UserController.avatarChange)

// admin can update user
router.get('/update-user/:id', decorateHtmlResponse('Update User'), checkLogin, requireRole(['admin']), UserController.updateUser)
router.post('/update-user', decorateHtmlResponse('Update User'),UserController.updateUserPush)
// user or employee edit name
// router.post('/user/edit/info', UserController.userCanEditName)

module.exports = router;
