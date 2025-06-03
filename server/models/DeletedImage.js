const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const DeletedImage = sequelize.define('DeletedImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: DataTypes.INTEGER,
  fileWidth: DataTypes.INTEGER,
  fileHeight: DataTypes.INTEGER,
  fileFormat: DataTypes.STRING,
  deletedBy: DataTypes.INTEGER,
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'deleted_images',
  timestamps: false
});

module.exports = DeletedImage;
