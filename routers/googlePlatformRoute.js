const router = require('express').Router();
const passport = require('passport')
const GooglePlatformController = require('../controllers/GooglePlatformController')

require('../utilities/googlePassport')(passport)

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), GooglePlatformController.googleUserSet);
router.get('/remove/google', GooglePlatformController.googleUserDelete)

module.exports = router
