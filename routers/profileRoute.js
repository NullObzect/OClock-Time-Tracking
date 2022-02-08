const router = require('express').Router()
const ProfileController = require('../controllers/ProfileController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { passwordValidator ,passwordValidationHandler } = require('../middleware/user/updateProfileValidation')

const { checkLogin } = require('../middleware/common/AuthMiddleware');
const avatarUpload = require('../middleware/user/avatarUpload');

// Router for user profile page
router.get('/', decorateHtmlResponse('User Profile'), checkLogin, ProfileController.userProfile)
router.get('/picture/:id', decorateHtmlResponse('User Profile'), ProfileController.changeProfile)
router.post('/update-profile', decorateHtmlResponse('User Profile'), avatarUpload, passwordValidator, passwordValidationHandler, ProfileController.updateProfile)

module.exports = router;
