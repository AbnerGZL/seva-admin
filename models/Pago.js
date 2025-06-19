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
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  MONTO: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  FORMATO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  RECIBO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  OBSERVACION: {
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
  tableName: 'PAGO',
  timestamps: false,
});

module.exports = Pago;