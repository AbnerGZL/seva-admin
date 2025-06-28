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
    unique: true
  },
  EMAIL: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true
  },
  CONTRASEÑA: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'USUARIOS',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Usuario;