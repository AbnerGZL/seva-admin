const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nota = sequelize.define('Nota', {
  ID_NOTA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_MATRICULA: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ID_CURSO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PROMEDIOP: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  PROMEDIOT: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  CONDICION: {
    type: DataTypes.STRING(20),
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
  tableName: 'NOTAS',
  timestamps: false,
});

module.exports = Nota;