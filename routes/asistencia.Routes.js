const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistencia.Controller');

router.get('/', asistenciaController.listar);
router.get('/crear', asistenciaController.mostrarFormularioCrear);
router.post('/crear', asistenciaController.crear);
router.get('/editar/:id', asistenciaController.mostrarFormularioEditar);
router.post('/editar/:id', asistenciaController.actualizar);
router.post('/eliminar/:id', asistenciaController.eliminar);

module.exports = router;