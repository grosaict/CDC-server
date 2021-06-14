const router = require('express').Router();
const vaccineController = require('../controllers/vaccineController');
const tokenController = require('../controllers/tokenController');

router.put('/update/:id', tokenController.validation, vaccineController.updateVaccine);

module.exports = router;