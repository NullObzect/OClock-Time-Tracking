const router = require('express').Router()
const { redirectLoggedIn } = require('../middleware/common/AuthMiddleware')

router.get('/', redirectLoggedIn, (req, res) => {
  // res.send('hello')
  res.render('pages/home')
})

module.exports = router;
