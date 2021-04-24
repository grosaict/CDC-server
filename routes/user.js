const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/', userController.registerUser);

module.exports = router;