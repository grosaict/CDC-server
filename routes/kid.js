const router = require('express').Router();
const kidController = require('../controllers/kidController');
const tokenController = require('../controllers/tokenController');

router.get('/', tokenController.validation, kidController.loadAllKids);
router.post('/', tokenController.validation, kidController.createKid);
router.get('/:id', tokenController.validation, kidController.loadKid);


/* 
router.get('/:id', tokenController.validation, itemController.buscarItem);
outer.put('/deactivate/:id', itemController.desativarItem);
*/

module.exports = router;