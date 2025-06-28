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
CURSACION: {
  type: DataTypes.STRING(45),
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