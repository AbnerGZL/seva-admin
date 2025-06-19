const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('adminnotas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;