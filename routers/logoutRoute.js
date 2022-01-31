const router = require('express').Router();
const LogoutController = require('../controllers/LogoutController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

router.get('/logout', decorateHtmlResponse('Logout'), LogoutController.logout)

router.get('/active-user', decorateHtmlResponse('Logout'), LogoutController.logout)

module.exports = router
