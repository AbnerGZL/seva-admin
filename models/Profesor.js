const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('Profesor', {
  ID_PROFESOR: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  ESTADO: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  CORREO: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'PROFESOR',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Profesor;