const router = require('express').Router();
// Import Routes
const dashboardRoute = require('./dashboardRoute')
const loginRoute = require('./loginRoute')
const logoutRoute = require('./logoutRoute')
const registerRoute = require('./userRoute')
const userPlatformRoute = require('./userPlatformRoute')
const fbUserRoute = require('./fbUserRoute')
const profileRoute = require('./profileRoute')
const attendanceRoute = require('./attendanceRoute')

// all routers use
router.use(
  dashboardRoute,
  registerRoute,
  loginRoute,
  logoutRoute,
  userPlatformRoute,
  fbUserRoute,
  profileRoute,
  attendanceRoute,

)

// exports route
module.exports = router;
