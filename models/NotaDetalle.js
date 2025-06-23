const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotaDetalle = sequelize.define('NotaDetalle', {
  ID_NOTA_DETALLE: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_NOTA: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PRACTICA: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  TEORIA: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  FECHA: {
    type: DataTypes.DATEONLY,
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
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'NOTAS_DETALLE',
  timestamps: false,
});

module.exports = NotaDetalle;