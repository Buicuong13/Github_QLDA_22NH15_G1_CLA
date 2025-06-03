const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');
const Image = require('./Image');

const Album = sequelize.define('Album', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'album',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

const AlbumImage = sequelize.define('AlbumImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  albumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'album',
      key: 'id'
    }
  },
  imageId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'images',
      key: 'id'
    }
  }
}, {
  tableName: 'album_images',
  timestamps: true, 
  createdAt: 'addedAt',
  updatedAt: false
});

Album.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Album, { foreignKey: 'userId' });

Album.belongsToMany(Image, { through: AlbumImage, foreignKey: 'albumId', otherKey: 'imageId' });
Image.belongsToMany(Album, { through: AlbumImage, foreignKey: 'imageId', otherKey: 'albumId' });

module.exports = {
  Album,
  AlbumImage
};
