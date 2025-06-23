const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('admin_notastest', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;