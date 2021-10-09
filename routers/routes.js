const router = require('express').Router();
// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')
const logoutRoute = require('./logoutRoute')
const registerRoute = require('./userRoute')
const fbUserRoute = require('./fbUserRoute')

// all routers use
router.use(dashboardRoute, registerRoute, loginRoute, logoutRoute, fbUserRoute)

// exports route
module.exports = router;
