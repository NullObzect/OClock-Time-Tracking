const router = require('express').Router();
// Import Routes
const homeRoute = require('./homeRoute')
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
const landingPage = require('./landingPageRoute')
const dashboardRoute = require('./dashboardRoute')

// all routers use
router.use(
  homeRoute,
  landingPage,
  registerRoute,
  loginRoute,
  logoutRoute,
  userPlatformRoute,
  fbUserRoute,
  profileRoute,
  attendanceRoute,
  holidayRouter,
)
router.use('/options', optionsRoute)
router.use('/options', holidayRouter)
router.use('/options', leavedayRoute)
router.use('/profile', profileRoute)
router.use('/dashboard', dashboardRoute)

// exports route
module.exports = router;
