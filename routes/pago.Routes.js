const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pago.Controller');

router.get('/', pagoController.listar);
router.get('/crear', pagoController.crearForm);
router.post('/crear', pagoController.crear);
router.get('/editar/:id', pagoController.editarForm);
router.post('/editar/:id', pagoController.editar);
router.post('/eliminar/:id', pagoController.eliminar);

module.exports = router;
