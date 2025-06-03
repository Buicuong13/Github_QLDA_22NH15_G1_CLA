const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE || 'shotbox',
  process.env.DATABASE_USER || 'root',
  process.env.DATABASE_PASSWORD || '',
  {
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
