const express = require('express');
const router = express.Router();
const cronogramaController = require('../controllers/cronograma.Controller');

router.get('/', cronogramaController.listar);
router.get('/crear', cronogramaController.crearForm);
router.post('/crear', cronogramaController.crear);
router.get('/editar/:id', cronogramaController.editarForm);
router.post('/editar/:id', cronogramaController.editar);
router.post('/eliminar/:id', cronogramaController.eliminar);
router.post('/reactivar/:id', cronogramaController.reactivar);

module.exports = router;
