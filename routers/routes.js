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
const holidayRouter = require('./holidayRoute')
const leavedayRoute = require('./leavedayRoute')
const optionsRoute = require('./optionsRoute')

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
  holidayRouter,
  leavedayRoute,

)
router.use('/options', optionsRoute)
router.use('/profile', profileRoute)

// exports route
module.exports = router;
