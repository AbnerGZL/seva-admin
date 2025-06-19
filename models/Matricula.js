const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matricula = sequelize.define('Matricula', {
  ID_MATRICULA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_ESTUDIANTE: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ID_CARRERA: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FECHA_MATRICULA: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ESTADO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  PERIODOA: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  CICLO: {
    type: DataTypes.INTEGER,
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
  tableName: 'MATRICULAS',
  timestamps: false,
});

module.exports = Matricula;