const router = require('express').Router();
// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')
const registerRoute = require('./userRoute')

// all routers use
router.use(dashboardRoute, loginRoute, registerRoute)

// exports route
module.exports = router;
