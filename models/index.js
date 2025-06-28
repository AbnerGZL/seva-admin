const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const TipoUsuario = require('./TipoUsuario');
const Usuario = require('./Usuario');
const Estudiante = require('./Estudiante');
const Profesor = require('./Profesor');
const Curso = require('./Curso');
const Nota = require('./Nota');
const NotaDetalle = require('./NotaDetalle');
const Carrera = require('./Carrera');
const Matricula = require('./Matricula');
const Pago = require('./Pago');
const Asistencia = require('./Asistencia');
const Cronograma = require('./cronograma');

// Relaciones Usuario
Usuario.belongsTo(TipoUsuario, {
  foreignKey: 'ID_TIPO',
  as: 'tipo',
});

Usuario.hasOne(Estudiante, {
  foreignKey: 'ID_USUARIO',
  as: 'estudiante',
});

Usuario.hasOne(Profesor, {
  foreignKey: 'ID_USUARIO',
  as: 'profesor',
});

// Estudiante
Estudiante.belongsTo(Usuario, {
  foreignKey: 'ID_USUARIO',
  as: 'usuario',
});

Estudiante.hasMany(Matricula, {
  foreignKey: 'ID_ESTUDIANTE',
  as: 'matriculas',
});

// Profesor
Profesor.belongsTo(Usuario, {
  foreignKey: 'ID_USUARIO',
  as: 'usuario',
});

Profesor.hasMany(Curso, {
  foreignKey: 'ID_PROFESOR',
  as: 'cursos',
});

// Curso
Curso.belongsTo(Profesor, {
  foreignKey: 'ID_PROFESOR',
  as: 'profesor',
});

Curso.hasMany(Nota, {
  foreignKey: 'ID_CURSO',
  as: 'notas',
});

// Carrera
Carrera.hasMany(Matricula, {
  foreignKey: 'ID_CARRERA',
  as: 'matriculas',
});

// Matricula
Matricula.belongsTo(Estudiante, {
  foreignKey: 'ID_ESTUDIANTE',
  as: 'estudiante',
});

Matricula.belongsTo(Carrera, {
  foreignKey: 'ID_CARRERA',
  as: 'carrera',
});

Matricula.hasMany(Pago, {
  foreignKey: 'ID_MATRICULA',
  as: 'pagos',
});

Matricula.hasMany(Nota, {
  foreignKey: 'ID_MATRICULA',
  as: 'notas',
});

Matricula.hasMany(Asistencia, {
  foreignKey: 'ID_MATRICULA',
  as: 'asistencias',
});

Matricula.hasMany(Cronograma, {
  foreignKey: 'ID_MATRICULA',
  as: 'cronogramas',
});

// Nota
Nota.belongsTo(Curso, {
  foreignKey: 'ID_CURSO',
  as: 'curso',
});

Nota.belongsTo(Matricula, {
  foreignKey: 'ID_MATRICULA',
  as: 'matricula',
});

Nota.belongsTo(Cronograma, {
  foreignKey: 'ID_CRONOGRAMA',
  as: 'cronograma',
});

Nota.hasMany(NotaDetalle, {
  foreignKey: 'ID_NOTA',
  as: 'detalles',
});

// NotaDetalle
NotaDetalle.belongsTo(Nota, {
  foreignKey: 'ID_NOTA',
  as: 'nota',
});

// Asistencia
Asistencia.belongsTo(Matricula, {
  foreignKey: 'ID_MATRICULA',
  as: 'matricula',
});

Asistencia.belongsTo(Profesor, {
  foreignKey: 'ID_PROFESOR',
  as: 'profesor',
});

Asistencia.belongsTo(Curso, {
  foreignKey: 'ID_CURSO',
  as: 'curso',
});

Asistencia.belongsTo(Cronograma, {
  foreignKey: 'ID_CRONOGRAMA',
  as: 'cronograma',
});

// Pago
Pago.belongsTo(Matricula, {
  foreignKey: 'ID_MATRICULA',
  as: 'matricula',
});

// Cronograma

Cronograma.belongsTo(Matricula, {
  foreignKey: 'ID_MATRICULA',
  as: 'matricula',
});

Cronograma.belongsTo(Curso, {
  foreignKey: 'ID_CURSO',
  as: 'curso',
});

Cronograma.belongsTo(Profesor, {
  foreignKey: 'ID_PROFESOR',
  as: 'profesor',
});

module.exports = {
  sequelize,
  TipoUsuario,
  Usuario,
  Estudiante,
  Profesor,
  Curso,
  Nota,
  NotaDetalle,
  Carrera,
  Matricula,
  Pago,
  Asistencia,
  Cronograma,
};
