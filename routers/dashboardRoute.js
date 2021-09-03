const router = require('express').Router();
const DashboardController = require('../controllers/DashboardController')

router.get('/dashboard', DashboardController.getDashboard)
module.exports = router
