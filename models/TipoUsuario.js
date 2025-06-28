const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoUsuario = sequelize.define('TipoUsuario', {
  ID_TIPO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NOMBRE: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'TIPO_USUARIO',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION',
});

module.exports = TipoUsuario;