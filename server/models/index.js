const User = require('./User');
const Image = require('./Image');
const Album = require('./Album').Album;
const AlbumImage = require('./Album').AlbumImage;

// User - Image associations
User.hasMany(Image, { foreignKey: 'userId', onDelete: 'CASCADE' });
Image.belongsTo(User, { foreignKey: 'userId' });

// User - Album associations
User.hasMany(Album, { foreignKey: 'userId', onDelete: 'CASCADE' });
Album.belongsTo(User, { foreignKey: 'userId' });

// Album - Image associations through AlbumImage
Album.belongsToMany(Image, { through: AlbumImage, foreignKey: 'albumId' });
Image.belongsToMany(Album, { through: AlbumImage, foreignKey: 'imageId' });

module.exports = {
  User,
  Image,
  Album,
  AlbumImage
};
