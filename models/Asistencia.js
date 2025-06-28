const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asistencia = sequelize.define('Asistencia', {
  ID_ASISTENCIA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_CRONOGRAMA: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ID_PROFESOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ID_CURSO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FECHA: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ESTADO: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'ASISTENCIAS',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Asistencia;