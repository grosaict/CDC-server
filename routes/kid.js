const router = require('express').Router();
const kidController = require('../controllers/kidController');
const tokenController = require('../controllers/tokenController');

router.get('/', tokenController.validation, kidController.loadAllKids);
router.post('/', tokenController.validation, kidController.createKid);
router.get('/:id', tokenController.validation, kidController.loadKid);
router.get('/measure/:id', tokenController.validation, kidController.loadKidByMeasure);
router.get('/vaccine/:id', tokenController.validation, kidController.loadKidByVaccine);

module.exports = router;