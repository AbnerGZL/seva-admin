const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrera = sequelize.define('Carrera', {
  ID_CARRERA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NOMBRE: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  CODIGOCA: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  DESCRIPCION: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  DURACION: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  TOTAL_CREDITOS: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  TITULO: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  GRADO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  DEPARTAMENTO: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  MODALIDAD: {
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
  tableName: 'CARRERAS',
  timestamps: false,
});

module.exports = Carrera;