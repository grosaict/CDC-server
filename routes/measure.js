const router = require('express').Router();
const measureController = require('../controllers/measureController');
const tokenController = require('../controllers/tokenController');

//router.get('/:id', tokenController.validation, measureController.loadMeasure);

module.exports = router;