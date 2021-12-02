const router = require('express').Router();
const OptionsController = require('../controllers/OptionsController');
const decorateHtmlResponse = require('../middleware/common/decorateHtmlResponse');

router.get('/options', decorateHtmlResponse('Options'), OptionsController.getOptionsList)

module.exports = router
