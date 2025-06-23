const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipoUsuario.Controller');

router.get('/', tipoController.listar);
router.get('/crear', tipoController.crearForm);
router.post('/crear', tipoController.crear);
router.get('/editar/:id', tipoController.editarForm);
router.post('/editar/:id', tipoController.editar);
router.post('/eliminar/:id', tipoController.eliminar);
router.post('/reactivar/:id', tipoController.reactivar);

module.exports = router;
