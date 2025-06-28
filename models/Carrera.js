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
    unique: true
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
    type: DataTypes.STRING(50),
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
    defaultValue: true
  }
}, {
  tableName: 'CARRERAS',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Carrera;