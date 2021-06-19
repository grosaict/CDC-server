const router = require('express').Router();
const vaccineController = require('../controllers/vaccineController');
const tokenController = require('../controllers/tokenController');

router.post('/', tokenController.validation, vaccineController.newVaccine);
router.put('/update/:id', tokenController.validation, vaccineController.updateVaccine);
router.delete('/delete/:id', tokenController.validation, vaccineController.deleteVaccine);

module.exports = router;