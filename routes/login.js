const router = require('express').Router();
const loginController = require('../controllers/loginController');
const tokenController = require('../controllers/tokenController');

router.post('/', loginController.login);
router.get('/token', tokenController.getToken);

module.exports = router;