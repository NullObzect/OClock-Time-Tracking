const router = require('express').Router();
const passport = require('passport')
const FbUserController = require('../controllers/FbUserController');

require('../utilities/passportFB')(passport)

router.get('/profile', FbUserController.profile)
// router.get('/profile', (req, res) => { res.send('This is profile page ') })
router.get('/error', FbUserController.error)

// passport router
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email,user_photos' }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }), FbUserController.profile);

router.get('/remove/facebook', FbUserController.facebookUserDelete)

module.exports = router;
