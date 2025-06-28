const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
  ID_ESTUDIANTE: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ESTADO: {
    type: DataTypes.STRING(45),
    allowNull: true
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
    type: DataTypes.STRING(100),
    allowNull: false
  },
  FECHA_NAC: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  CORREO: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  SEXO: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  DIRECCION: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  TELEFONO: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'ESTUDIANTE',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Estudiante;