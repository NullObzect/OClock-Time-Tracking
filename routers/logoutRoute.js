const router = require('express').Router();
const LogoutController = require('../controllers/LogoutController');
const decorateHtmlResponse = require('../middleware/decorateHtmlResponse');

router.get('/logout', decorateHtmlResponse('Logout'), LogoutController.logout)

module.exports = router
