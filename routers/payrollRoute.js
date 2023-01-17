const router = require('express').Router()
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const Payroll = require('../controllers/PayrollController')

router.get('/payroll', decorateHtmlResponse('Payroll'), checkLogin, Payroll.getPayroll)
router.post('/add-payroll', Payroll.addPayroll)
router.post('/payroll/update', Payroll.getUpdate)
router.get('/payroll/delete/:id', Payroll.getDelete)

module.exports = router
