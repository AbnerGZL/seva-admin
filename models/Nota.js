const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nota = sequelize.define('Nota', {
  ID_NOTA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_ESTUDIANTE: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ID_CURSO: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  NOTA: {
    type: DataTypes.INTEGER,
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
  tableName: 'NOTAS',
  timestamps: false,
});

module.exports = Nota;