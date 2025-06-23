const express = require('express');
const router = express.Router();
const controller = require('../controllers/curso.Controller');

router.get('/', controller.listar);
router.get('/crear', controller.crearForm);
router.post('/crear', controller.crear);
router.get('/editar/:id', controller.editarForm);
router.post('/editar/:id', controller.editar);
router.post('/eliminar/:id', controller.eliminar);
router.post('/reactivar/:id', controller.reactivar);

module.exports = router;
