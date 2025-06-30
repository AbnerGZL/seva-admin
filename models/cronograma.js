const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cronograma = sequelize.define('CRONOGRAMA', {
ID_CRONOGRAMA: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
},
ID_MATRICULA: {
  type: DataTypes.INTEGER,
  allowNull: false
},
ID_CURSO: {
  type: DataTypes.INTEGER,
  allowNull: false
},
ID_PROFESOR: {
  type: DataTypes.INTEGER,
  allowNull: false
},
ESTADOC: {
  type: DataTypes.STRING,
  allowNull: true
},
NOTAF: {
  type: DataTypes.DECIMAL(5,2),
  allowNull: true
},            
CURSACION: {
  type: DataTypes.INTEGER,
  allowNull: false
},
ESTATUS: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
}
}, {
  tableName: 'CRONOGRAMA',
  timestamps: true,
  createdAt: 'FECHA_CREACION',
  updatedAt: 'FECHA_ACTUALIZACION',
});

module.exports = Cronograma;