const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asistencia = sequelize.define('Asistencia', {
  ID_ASISTENCIA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_MATRICULA: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    allowNull: false,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  FECHA_CREACION: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  FECHA_MODIFICACION: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'ASISTENCIAS',
  timestamps: false,
});

module.exports = Asistencia;