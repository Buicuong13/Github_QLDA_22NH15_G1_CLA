const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  fileWidth: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  fileHeight: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  fileFormat: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'images',
  timestamps: false
});

Image.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Image, { foreignKey: 'userId' });

module.exports = Image;
