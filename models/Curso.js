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
    unique: true
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
    defaultValue: true
  }
}, {
  tableName: 'CURSOS',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION'
});

module.exports = Curso;