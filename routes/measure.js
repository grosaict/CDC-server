const router = require('express').Router();
const measureController = require('../controllers/measureController');
const tokenController = require('../controllers/tokenController');

router.put('/update/:id', tokenController.validation, measureController.updateMeasure);

module.exports = router;