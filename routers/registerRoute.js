const router = require('express').Router();
const RegisterController = require('../controllers/RegisterController');

router.get('/register', RegisterController.register);
router.post('/register', RegisterController.registerController);

module.exports = router;
