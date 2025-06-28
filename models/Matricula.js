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
  PERIODO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  CICLO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CONDICION: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'MATRICULAS',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Matricula;