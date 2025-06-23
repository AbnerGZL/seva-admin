const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.Controller');

router.get('/', usuarioController.listar);
router.get('/crear', usuarioController.crearForm);
router.post('/crear', usuarioController.crear);

router.get('/editar/:id', usuarioController.editarForm);
router.post('/editar/:id', usuarioController.editar);

router.get('/eliminar/:id', usuarioController.eliminar);
router.post('/reactivar/:id', usuarioController.reactivar);

module.exports = router;