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
    type: DataTypes.DECIMAL(5,2),
    allowNull: false,
  },
  TEORIA: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: false,
  },
  FECHA: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'NOTAS_DETALLE',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = NotaDetalle;