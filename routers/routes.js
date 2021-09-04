const router = require('express').Router();
// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')
const registerRoute = require('./registerRoute')

// all routers use
router.use(dashboardRoute, loginRoute, registerRoute)

// exports route
module.exports = router;
