const router = require('express').Router();
// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')

// all routers use
router.use(dashboardRoute, loginRoute)

//
module.exports = router;
