const router = require('express').Router();
// Import Routes
const homeRoute = require('./homeRoute')
const loginRoute = require('./loginRoute')
const logoutRoute = require('./logoutRoute')
const registerRoute = require('./userRoute')
const googlePlatformRoute = require('./googlePlatformRoute')
const fbUserRoute = require('./fbUserRoute')
const profileRoute = require('./profileRoute')
const attendanceRoute = require('./attendanceRoute')
const holidayRouter = require('./holidayRoute')
const leavedayRoute = require('./leavedayRoute')
const optionsRoute = require('./optionsRoute')
const landingPage = require('./landingPageRoute')
const dashboardRoute = require('./dashboardRoute')

const productivity = require('./productivityRoute')
const payroll = require('./payrollRoute')

// all routers use
router.use(
  homeRoute,
  landingPage,
  registerRoute,
  loginRoute,
  logoutRoute,
  googlePlatformRoute,
  fbUserRoute,
  profileRoute,
  attendanceRoute,
  holidayRouter,
  productivity,
  payroll,
)
router.use('/options', optionsRoute)
router.use('/options', holidayRouter)
router.use('/options', leavedayRoute)
router.use('/profile', profileRoute)
router.use('/dashboard', dashboardRoute)

// exports route
module.exports = router;
