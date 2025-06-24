const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  ID_USUARIO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ID_TIPO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CODIGOU: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  EMAIL: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  CONTRASEÑA: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  FECHA_CREACION: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  FECHA_MODIFICACION: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ESTATUS: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
}, {
  tableName: 'USUARIOS',
  timestamps: false,
});

module.exports = Usuario;