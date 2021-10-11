const router = require('express').Router()
const ProfileController = require('../controllers/ProfileController');
const { checkLogin } = require('../middleware/common/AuthMiddleware');

router.get('/user/profile', checkLogin, ProfileController.userConnectionDetails)
module.exports = router;
