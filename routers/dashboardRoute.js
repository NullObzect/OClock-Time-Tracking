const router = require('express').Router()
const { checkLogin } = require('../middleware/common/AuthMiddleware');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

router.get('/', decorateHtmlResponse('Dashboard'), checkLogin, (req, res) => {
  res.render('pages/dashboard')
})
module.exports = router
