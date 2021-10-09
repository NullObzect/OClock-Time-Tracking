const router = require('express').Router();
const passport = require('passport')
const UserPlatformController = require('../controllers/UserPlatformController')

require('../utilities/googlePassport')(passport)

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), UserPlatformController.googleUserSet);
router.get('/remove/google', UserPlatformController.googleUserDelete)

module.exports = router
