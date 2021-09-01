const router = require('express').Router();
const RootController = require('../controllers/RootController')
const auth = require('./authRoute')

router.get('/', RootController.home)
// all routers use
router.use(auth)

//
module.exports = router;
