const router = require('express').Router()
const ProfileController = require('../controllers/ProfileController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

const { checkLogin } = require('../middleware/common/AuthMiddleware');

// Router for user profile page
router.get('/profile', decorateHtmlResponse('User Profile'), checkLogin, ProfileController.userProfile)
router.get('/profile/picture/:id', decorateHtmlResponse('User Profile'), ProfileController.changeProfile)

module.exports = router;
