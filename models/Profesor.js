const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('Profesor', {
  ID_PROFESOR: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NOMBRES: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  APELLIDOS: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  ESPECIALIDAD: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  DNI: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TELEFONO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  CORREO: {
    type: DataTypes.STRING(100),
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
  tableName: 'PROFESOR',
  timestamps: false,
});

module.exports = Profesor;