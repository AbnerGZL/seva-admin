const express = require('express');
const router = express.Router();
const { Estudiante, Curso, Profesor, Usuario, TipoUsuario, DatosEstudiante, Carrera } = require('../models');

router.get('/', async (req, res) => {
  try {
    const [
      totalEstudiantes,
      totalCursos,
      totalProfesores,
      totalUsuarios,
      totalTipos,
      totalDatosEstudiantes,
      totalCarreras
    ] = await Promise.all([
      Estudiante.count({ where: { ESTATUS: 1 } }),
      Curso.count({ where: { ESTATUS: 1 } }),
      Profesor.count({ where: { ESTATUS: 1 } }),
      Usuario.count({ where: { ESTATUS: 1 } }),
      TipoUsuario.count(),
      DatosEstudiante.count(),
      Carrera.count({ where: { ESTATUS: true } })
    ]);

    res.render('dashboard', {
      totalEstudiantes,
      totalCursos,
      totalProfesores,
      totalUsuarios,
      totalTipos,
      totalDatosEstudiantes,
      totalCarreras
    });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar el dashboard' });
  }
});

module.exports = router;
