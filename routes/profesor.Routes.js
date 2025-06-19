const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesor.Controller');

router.get('/', profesorController.listar);
router.get('/crear', profesorController.crearForm);
router.post('/crear', profesorController.crear);
router.get('/editar/:id', profesorController.editarForm);
router.post('/editar/:id', profesorController.editar);
router.post('/eliminar/:id', profesorController.eliminar);

module.exports = router;
