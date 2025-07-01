const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definir los modelos correctamente
const TipoUsuario = require('./TipoUsuario')(sequelize, DataTypes);
const Usuario = require('./Usuario')(sequelize, DataTypes);
const Estudiante = require('./Estudiante')(sequelize, DataTypes);
const Profesor = require('./Profesor')(sequelize, DataTypes);
const Curso = require('./Curso')(sequelize, DataTypes);
const Nota = require('./Nota')(sequelize, DataTypes);
const NotaDetalle = require('./NotaDetalle')(sequelize, DataTypes);
const Carrera = require('./Carrera')(sequelize, DataTypes);
const Matricula = require('./Matricula')(sequelize, DataTypes);
const Pago = require('./Pago')(sequelize, DataTypes);
const Asistencia = require('./Asistencia')(sequelize, DataTypes);
const Cronograma = require('./cronograma')(sequelize, DataTypes);

// Relaciones de Usuario
Usuario.belongsTo(TipoUsuario, { foreignKey: 'ID_TIPO', as: 'tipo' });
Usuario.hasOne(Estudiante, { foreignKey: 'ID_USUARIO', as: 'estudiante' });
Usuario.hasOne(Profesor, { foreignKey: 'ID_USUARIO', as: 'profesor' });

// Relaciones de Estudiante
Estudiante.belongsTo(Usuario, { foreignKey: 'ID_USUARIO', as: 'usuario' });
Estudiante.hasMany(Matricula, { foreignKey: 'ID_ESTUDIANTE', as: 'matriculas' });

// Relaciones de Profesor
Profesor.belongsTo(Usuario, { foreignKey: 'ID_USUARIO', as: 'usuario' });
Profesor.hasMany(Curso, { foreignKey: 'ID_PROFESOR', as: 'cursos' });

// Relaciones de Curso
Curso.belongsTo(Profesor, { foreignKey: 'ID_PROFESOR', as: 'profesor' });

// Relaciones de Carrera
Carrera.hasMany(Matricula, { foreignKey: 'ID_CARRERA', as: 'matriculas' });

// Relaciones de Matricula
Matricula.belongsTo(Estudiante, { foreignKey: 'ID_ESTUDIANTE', as: 'estudiante' });
Matricula.belongsTo(Carrera, { foreignKey: 'ID_CARRERA', as: 'carrera' });
Matricula.hasMany(Pago, { foreignKey: 'ID_MATRICULA', as: 'pagos' });
// Matricula.hasMany(Nota, { foreignKey: 'ID_MATRICULA', as: 'notas' });
// Matricula.hasMany(Asistencia, { foreignKey: 'ID_MATRICULA', as: 'asistencias' });
Matricula.hasMany(Cronograma, { foreignKey: 'ID_MATRICULA', as: 'cronogramas' });

// Relaciones de Nota
Nota.belongsTo(Cronograma, { foreignKey: 'ID_CRONOGRAMA', as: 'cronograma' });
Nota.hasMany(NotaDetalle, { foreignKey: 'ID_NOTA', as: 'detalles' });

// Relaciones de NotaDetalle
NotaDetalle.belongsTo(Nota, { foreignKey: 'ID_NOTA', as: 'nota' });

// Relaciones de Asistencia
// Asistencia.belongsTo(Matricula, { foreignKey: 'ID_MATRICULA', as: 'matricula' });
Asistencia.belongsTo(Cronograma, { foreignKey: 'ID_CRONOGRAMA', as: 'cronograma' });

// Relaciones de Pago
Pago.belongsTo(Matricula, { foreignKey: 'ID_MATRICULA', as: 'matricula' });

// Relaciones de Cronograma
Cronograma.belongsTo(Matricula, { foreignKey: 'ID_MATRICULA', as: 'matricula' });
Cronograma.belongsTo(Curso, { foreignKey: 'ID_CURSO', as: 'curso' });
Cronograma.belongsTo(Profesor, { foreignKey: 'ID_PROFESOR', as: 'profesor' });

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