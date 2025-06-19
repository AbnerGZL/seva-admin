const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiante.Controller');

router.get('/', estudianteController.listar);
router.get('/crear', estudianteController.crearForm);
router.post('/crear', estudianteController.crear);
router.get('/editar/:id', estudianteController.editarForm);
router.post('/editar/:id', estudianteController.editar);
router.post('/eliminar/:id', estudianteController.eliminar);

module.exports = router;
