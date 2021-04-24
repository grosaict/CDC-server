const router = require('express').Router();
const itemController = require('../controllers/itemController');
const tokenController = require('../controllers/tokenController');
const multer = require('multer');
const multerConfig = require('../config/multer');

router.post('/', [tokenController.validation, multer(multerConfig).array("imagens")], itemController.cadastrarItem);
router.get('/', tokenController.validation, itemController.buscarTodosItens);
router.get('/:id', tokenController.validation, itemController.buscarItem);
router.put('/edit/:id', [tokenController.validation, multer(multerConfig).array("imagens")], itemController.atualizarItem);
router.put('/deactivate/:id', itemController.desativarItem);

module.exports = router;