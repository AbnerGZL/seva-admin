const express = require('express');
const router = express.Router();
const {
  Estudiante,
  Curso,
  Profesor,
  Usuario,
  TipoUsuario,
  Carrera,
  Nota,
  Matricula,
  Pago,
  Asistencia,
  NotaDetalle,
  Cronograma
} = require('../models');

router.get('/', async (req, res) => {
  try {
    const [
      totalEstudiantes,
      totalCursos,
      totalProfesores,
      totalUsuarios,
      totalTipos,
      totalCarreras,
      totalNotas,
      totalMatriculas,
      totalPagos,
      totalAsistencias,
      totalNotaDetalles,
      totalCronograma
    ] = await Promise.all([
      Estudiante.count({ where: { ESTATUS: 1 } }),
      Curso.count({ where: { ESTATUS: 1 } }),
      Profesor.count({ where: { ESTATUS: 1 } }),
      Usuario.count({ where: { ESTATUS: 1 } }),
      TipoUsuario.count(),
      Carrera.count({ where: { ESTATUS: true } }),
      Nota.count({ where: { ESTATUS: 1 } }),
      Matricula.count({ where: { ESTATUS: 1 } }),
      Pago.count({ where: { ESTATUS: 1 } }),
      Asistencia.count({ where: { ESTATUS: 1 } }),
      NotaDetalle.count({ where: { ESTATUS: 1 } }),
      Cronograma.count({ where: { ESTATUS: 1 } }) 
    ]);

    res.render('dashboard', {
      totalEstudiantes,
      totalCursos,
      totalProfesores,
      totalUsuarios,
      totalTipos,
      totalCarreras,
      totalNotas,
      totalMatriculas,
      totalPagos,
      totalAsistencias,
      totalNotaDetalles,
      totalCronograma
    });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar el dashboard' });
  }
});

module.exports = router;
