const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');

const Content = sequelize.define('Content', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  fileName: { type: DataTypes.STRING, allowNull: false },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  fileType: { type: DataTypes.STRING, allowNull: false },
  cloudinaryId: { type: DataTypes.STRING },
}, {
  timestamps: true
});

Content.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Content, { foreignKey: 'userId' });

module.exports = Content;
