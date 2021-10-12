const router = require('express').Router();
// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')
const logoutRoute = require('./logoutRoute')
const registerRoute = require('./userRoute')
const userPlatformRoute = require('./userPlatformRoute')
const fbUserRoute = require('./fbUserRoute')
const profileRoute = require('./profileRoute')

// all routers use
router.use(
  dashboardRoute,
  registerRoute,
  loginRoute,
  logoutRoute,
  userPlatformRoute,
  fbUserRoute,
  profileRoute,
)

// exports route
module.exports = router;
