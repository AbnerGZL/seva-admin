const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
  ID_PAGO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_MATRICULA: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FECHA_PAGO: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  MONTO: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  FORMATO: {
    type: DataTypes.STRING(45),
  },
  RECIBO: {
    type: DataTypes.STRING(45),
  },
  OBSERVACION: {
    type: DataTypes.STRING(100),
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'PAGO',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Pago;