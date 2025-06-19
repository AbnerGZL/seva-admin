const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
  ID_CURSO: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_PROFESOR: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CODIGOCU: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  NOMBRE: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  DESCRIPCION: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  CREDITOS: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  DURACION: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  HORAS: {
    type: DataTypes.INTEGER,
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
  tableName: 'CURSOS',
  timestamps: false,
});

module.exports = Curso;