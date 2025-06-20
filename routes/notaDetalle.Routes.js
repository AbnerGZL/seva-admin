const express = require('express');
const router = express.Router();
const controller = require('../controllers/notaDetalle.Controller');

router.get('/', controller.listar);
router.get('/crear', controller.mostrarFormularioCrear);
router.post('/crear', controller.crear);
router.get('/editar/:id', controller.mostrarFormularioEditar);
router.post('/editar/:id', controller.actualizar);
router.post('/eliminar/:id', controller.eliminar);

module.exports = router;
