const router = require('express').Router();
const RootController = require('../controllers/RootController')

// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')

router.get('/', RootController.home)
// all routers use
router.use(dashboardRoute, loginRoute)

//
module.exports = router;
