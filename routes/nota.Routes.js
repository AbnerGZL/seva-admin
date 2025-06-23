const express = require('express');
const router = express.Router();
const notaController = require('../controllers/nota.Controller');
const { reactivar } = require('../controllers/usuario.Controller');

router.get('/', notaController.listar);
router.get('/crear', notaController.crearForm);
router.post('/crear', notaController.crear);
router.get('/editar/:id', notaController.editarForm);
router.post('/editar/:id', notaController.editar);
router.post('/eliminar/:id', notaController.eliminar);
router.post('/reactivar/:id', notaController.reactivar);

module.exports = router;
