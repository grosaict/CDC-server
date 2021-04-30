const router = require('express').Router();
const kidController = require('../controllers/kidController');
const tokenController = require('../controllers/tokenController');

router.get('/', tokenController.validation, kidController.loadAllKids);
router.post('/', tokenController.validation, kidController.createKid);


/* 
router.get('/:id', tokenController.validation, itemController.buscarItem);
router.put('/edit/:id', [tokenController.validation, multer(multerConfig).array("imagens")], itemController.atualizarItem);
router.put('/deactivate/:id', itemController.desativarItem);
*/

module.exports = router;