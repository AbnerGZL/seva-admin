const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const TipoUsuario = require('./TipoUsuario');
const Usuario = require('./Usuario');
const Estudiante = require('./Estudiante');
const Profesor = require('./Profesor');
const Curso = require('./Curso');
const Nota = require('./Nota');
const DatosEstudiante = require('./DatosEstudiante');
const Carrera = require('./Carrera');
const Matricula = require('./Matricula');
const Pago = require('./Pago');
const Asistencia = require('./Asistencia');
const NotaDetalle = require('./NotaDetalle');

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

Estudiante.belongsTo(Usuario, {
  foreignKey: 'ID_USUARIO',
  as: 'usuario',
});

Estudiante.hasOne(DatosEstudiante, {
  foreignKey: 'ID_ESTUDIANTE',
  as: 'datos',
});

Estudiante.hasMany(Matricula, {
  foreignKey: 'ID_ESTUDIANTE',
  as: 'matriculas',
});

Profesor.belongsTo(Usuario, {
  foreignKey: 'ID_USUARIO',
  as: 'usuario',
});

Profesor.hasMany(Curso, {
  foreignKey: 'ID_PROFESOR',
  as: 'cursos',
});

Curso.belongsTo(Profesor, {
  foreignKey: 'ID_PROFESOR',
  as: 'profesor',
});

Curso.hasMany(Nota, {
  foreignKey: 'ID_CURSO',
  as: 'notas',
});

Carrera.hasMany(Matricula, {
  foreignKey: 'ID_CARRERA',
  as: 'matriculas',
});

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
  as: 'nota',
});

Matricula.hasMany(Asistencia, {
  foreignKey: 'ID_MATRICULA',
  as: 'asistencias',
});

Nota.belongsTo(Estudiante, {
  foreignKey: 'ID_ESTUDIANTE',
  as: 'estudiante',
});

Nota.belongsTo(Curso, {
  foreignKey: 'ID_CURSO',
  as: 'curso',
});

Nota.belongsTo(Matricula, {
  foreignKey: 'ID_MATRICULA',
  as: 'matricula',
});

Nota.hasMany(NotaDetalle, {
  foreignKey: 'ID_NOTA',
  as: 'detalles',
});

NotaDetalle.belongsTo(Nota, {
  foreignKey: 'ID_NOTA',
  as: 'nota',
});

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

DatosEstudiante.belongsTo(Estudiante, {
  foreignKey: 'ID_ESTUDIANTE',
  as: 'estudiante',
});

Pago.belongsTo(Matricula, {
  foreignKey: 'ID_MATRICULA',
  as: 'matricula',
});

module.exports = {
  sequelize,
  TipoUsuario,
  Usuario,
  Estudiante,
  Profesor,
  Curso,
  Nota,
  DatosEstudiante,
  Carrera,
  Matricula,
  Pago,
  Asistencia,
  NotaDetalle
};