const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
  ID_ESTUDIANTE: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ESTADO: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  NOMBRES: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  APELLIDOS: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  DNI: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CARRERA: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  CORREO: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  FECHA_CREACION: {
    type: DataTypes.DATE,
    allowNull: false
  },
  FECHA_MODIFICACION: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'ESTUDIANTE',
  timestamps: false
});

module.exports = Estudiante;