const router = require('express').Router();
const RootController = require('../controllers/RootController')

// Import Routes
const dashboardRoute = require('./dashboardRoute')

router.get('/', RootController.home)
// all routers use
router.use(dashboardRoute)

//
module.exports = router;
