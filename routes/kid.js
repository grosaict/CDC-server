const router = require('express').Router();
const kidController = require('../controllers/kidController');
const tokenController = require('../controllers/tokenController');
const multer = require('multer');
const multerConfig = require('../config/multer');

router.get('/', tokenController.validation, kidController.loadAllKids);


/* 
const itemController = require('../controllers/itemController');

router.post('/', [tokenController.validation, multer(multerConfig).array("imagens")], itemController.cadastrarItem);
router.get('/:id', tokenController.validation, itemController.buscarItem);
router.put('/edit/:id', [tokenController.validation, multer(multerConfig).array("imagens")], itemController.atualizarItem);
router.put('/deactivate/:id', itemController.desativarItem);

*/

module.exports = router;