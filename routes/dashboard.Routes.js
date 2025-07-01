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
      Estudiante.count({ where: { ESTATUS: true } }),
      Curso.count({ where: { ESTATUS: true } }),
      Profesor.count({ where: { ESTATUS: true } }),
      Usuario.count({ where: { ESTATUS: true } }),
      TipoUsuario.count(),
      Carrera.count({ where: { ESTATUS: true } }),
      Nota.count({ where: { ESTATUS: true } }),
      Matricula.count({ where: { ESTATUS: true } }),
      Pago.count({ where: { ESTATUS: true } }),
      Asistencia.count({ where: { ESTATUS: true } }),
      NotaDetalle.count({ where: { ESTATUS: true } }),
      Cronograma.count({ where: { ESTATUS: true } }) 
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
