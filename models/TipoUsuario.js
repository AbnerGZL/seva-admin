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
  tableName: 'TIPO_USUARIO',
  timestamps: false,
});

module.exports = TipoUsuario;