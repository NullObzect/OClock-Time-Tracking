const router = require('express').Router();
const RootController = require('../controllers/RootController');

router.get('/auth', RootController.home);

module.exports = router;
